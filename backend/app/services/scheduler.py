import uuid
from datetime import date, datetime, time, timedelta
from typing import List, Dict, Any, Optional
from sqlalchemy import select, and_, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.models.scheduling import DoctorSchedule, Leave, Shift, Resource
from app.models.user import User
from app.models.enums import AppointmentStatus
from app.models.patient import Patient


class SchedulerService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_doctor_availability(self, doctor_id: uuid.UUID, target_date: date) -> List[Dict[str, Any]]:
        # 1. Check if doctor is on leave
        leave_stmt = select(Leave).where(
            and_(
                Leave.user_id == select(User.id).join(Doctor, Doctor.staff_profile_id == User.id).where(Doctor.id == doctor_id).scalar_subquery(),
                Leave.status == "Approved",
                Leave.start_date <= target_date,
                Leave.end_date >= target_date
            )
        )
        leave_res = await self.db.execute(leave_stmt)
        if leave_res.scalars().first():
            return []  # Not available - on leave

        # 2. Get schedule config
        day_val = target_date.weekday()  # 0 = Monday, 6 = Sunday
        sched_stmt = select(DoctorSchedule).where(
            and_(
                DoctorSchedule.doctor_id == doctor_id,
                DoctorSchedule.day_of_week == day_val,
                DoctorSchedule.is_available == True
            )
        )
        sched_res = await self.db.execute(sched_stmt)
        schedule = sched_res.scalars().first()

        start_t = time(9, 0)
        end_t = time(17, 0)
        slot_duration = 15

        if schedule:
            start_t = schedule.start_time
            end_t = schedule.end_time
            slot_duration = schedule.slot_duration_minutes

        # 3. Get existing appointments
        app_stmt = select(Appointment).where(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.date == target_date,
                Appointment.status != AppointmentStatus.CANCELLED
            )
        )
        app_res = await self.db.execute(app_stmt)
        existing_apps = app_res.scalars().all()
        booked_slots = {app.time_slot: app for app in existing_apps}

        # 4. Generate slots
        slots = []
        current_dt = datetime.combine(target_date, start_t)
        end_dt = datetime.combine(target_date, end_t)

        while current_dt < end_dt:
            slot_time_str = current_dt.strftime("%I:%M %p")
            existing_booking = booked_slots.get(slot_time_str)

            slots.append({
                "time": slot_time_str,
                "is_booked": existing_booking is not None,
                "appointment_id": str(existing_booking.id) if existing_booking else None,
                "patient_name": existing_booking.patient.name if existing_booking else None
            })
            current_dt += timedelta(minutes=slot_duration)

        return slots

    async def book_appointment_slot(
        self,
        patient_id: uuid.UUID,
        doctor_id: uuid.UUID,
        target_date: date,
        time_slot: str,
        symptoms: str,
        priority: str = "Normal",
        room: Optional[str] = None
    ) -> Appointment:
        # Check conflict / double booking
        stmt = select(Appointment).where(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.date == target_date,
                Appointment.time_slot == time_slot,
                Appointment.status != AppointmentStatus.CANCELLED
            )
        )
        res = await self.db.execute(stmt)
        if res.scalars().first() and priority != "Critical":
            raise ValueError("Time slot is already booked for this doctor.")

        # Token generation
        token_stmt = select(Appointment).where(Appointment.date == target_date)
        token_res = await self.db.execute(token_stmt)
        token_count = len(token_res.scalars().all()) + 1
        token = f"OPD-{token_count:03d}"

        # Fetch doctor's department
        doc_stmt = select(Doctor).where(Doctor.id == doctor_id)
        doc_res = await self.db.execute(doc_stmt)
        doc = doc_res.scalars().first()
        if not doc:
            raise ValueError("Doctor not found.")

        appointment = Appointment(
            patient_id=patient_id,
            doctor_id=doctor_id,
            department_id=doc.department_id,
            date=target_date,
            time_slot=time_slot,
            symptoms=symptoms,
            priority=priority,
            room=room or f"Room #{doc.department.name[:3].upper()}",
            token=token,
            status=AppointmentStatus.SCHEDULED
        )
        self.db.add(appointment)
        await self.db.commit()
        await self.db.refresh(appointment)
        return appointment

    async def cancel_appointment(self, appointment_id: uuid.UUID) -> bool:
        stmt = select(Appointment).where(Appointment.id == appointment_id)
        res = await self.db.execute(stmt)
        apt = res.scalars().first()
        if not apt:
            return False
        apt.status = AppointmentStatus.CANCELLED
        await self.db.commit()
        return True

    async def file_leave_request(
        self,
        user_id: uuid.UUID,
        start_date: date,
        end_date: date,
        leave_type: str,
        reason: Optional[str] = None
    ) -> Leave:
        leave = Leave(
            user_id=user_id,
            start_date=start_date,
            end_date=end_date,
            leave_type=leave_type,
            reason=reason,
            status="Pending"
        )
        self.db.add(leave)
        await self.db.commit()
        await self.db.refresh(leave)
        return leave

    async def process_leave_request(self, leave_id: uuid.UUID, status: str, admin_id: uuid.UUID) -> Optional[Leave]:
        stmt = select(Leave).where(Leave.id == leave_id)
        res = await self.db.execute(stmt)
        leave = res.scalars().first()
        if not leave:
            return None

        leave.status = status
        leave.approved_by_id = admin_id

        if status == "Approved":
            # Auto-cancel/reassign appointments for doctors during this leave
            doc_stmt = select(Doctor).where(Doctor.staff_profile_id == leave.user_id)
            doc_res = await self.db.execute(doc_stmt)
            doc = doc_res.scalars().first()
            if doc:
                app_stmt = select(Appointment).where(
                    and_(
                        Appointment.doctor_id == doc.id,
                        Appointment.date >= leave.start_date,
                        Appointment.date <= leave.end_date,
                        Appointment.status != AppointmentStatus.CANCELLED
                    )
                )
                app_res = await self.db.execute(app_stmt)
                for apt in app_res.scalars().all():
                    apt.status = "Needs Rescheduling"
                    # Auto notification or trigger logs

        await self.db.commit()
        await self.db.refresh(leave)
        return leave

    async def get_shifts(self, target_date: date) -> List[Shift]:
        stmt = select(Shift).where(Shift.date == target_date)
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def assign_shift(self, user_id: uuid.UUID, shift_type: str, target_date: date) -> Shift:
        # Check conflicts
        stmt = select(Shift).where(
            and_(
                Shift.user_id == user_id,
                Shift.date == target_date,
                Shift.shift_type == shift_type
            )
        )
        res = await self.db.execute(stmt)
        if res.scalars().first():
            raise ValueError("User is already assigned to this shift on this date.")

        # Default timings
        timings = {
            "Morning": (time(8, 0), time(14, 0)),
            "Evening": (time(14, 0), time(20, 0)),
            "Night": (time(20, 0), time(8, 0))
        }
        start, end = timings.get(shift_type, (time(9, 0), time(17, 0)))

        shift = Shift(
            user_id=user_id,
            shift_type=shift_type,
            start_time=start,
            end_time=end,
            date=target_date,
            status="active"
        )
        self.db.add(shift)
        await self.db.commit()
        await self.db.refresh(shift)
        return shift
