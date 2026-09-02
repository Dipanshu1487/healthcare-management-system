import random
from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.appointment import AppointmentRepository
from app.repositories.patient import PatientRepository
from app.services.audit import AuditService
from app.models.appointment import Appointment
from app.models.doctor import Doctor
from app.core.exceptions import APIException

class AppointmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.appointment_repo = AppointmentRepository(db)
        self.patient_repo = PatientRepository(db)
        self.audit_service = AuditService(db)

    async def book_appointment(
        self,
        patient_id: str,
        doctor_id: str,
        target_date: date,
        time_slot: str,
        symptoms: str,
        priority: str = "Normal"
    ) -> Appointment:

    # 1. Find patient
    patient = await self.patient_repo.get(patient_id)

    if not patient:
        raise APIException(
            message="Patient not found",
            status_code=404
        )

    # 2. Find doctor
    result = await self.db.execute(
        select(Doctor).where(Doctor.id == doctor_id)
    )

    doctor = result.scalars().first()

    if not doctor:
        raise APIException(
            message="Doctor not found",
            status_code=404
        )

    # 3. Generate queue token
    token_num = random.randint(1, 99)
    token = f"T-{token_num:02d}"

    # 4. Create appointment
    appointment = Appointment(
        token=token,
        date=target_date,
        time_slot=time_slot,
        status="Scheduled",
        priority=priority,
        symptoms=symptoms,
        patient_id=patient.id,
        doctor_id=doctor.id,
        department_id=doctor.department_id
    )

    await self.appointment_repo.create(appointment)

    # 5. Audit log
    await self.audit_service.log_action(
        actor_role="Reception",
        actor_name="Reception Desk",
        action="BOOK_APPOINTMENT",
        entity_type="Appointment",
        entity_id=str(appointment.id),
        description=(
            f"Booked appointment for {patient.name} "
            f"with doctor {doctor.name} "
            f"with token {token}"
        )
    )

    # 6. Commit
    await self.db.commit()

    return appointment
        # Generate queue token
        token_num = random.randint(1, 99)
        token = f"T-{token_num:02d}"

        appointment = Appointment(
            token=token,
            date=target_date,
            time_slot=time_slot,
            status="Scheduled",
            priority=priority,
            symptoms=symptoms,
            patient_id=patient.id,
            doctor_id=doctor_id
        )
        await self.appointment_repo.create(appointment)

        # Log action
        await self.audit_service.log_action(
            actor_role="Reception",
            actor_name="Reception Desk",
            action="BOOK_APPOINTMENT",
            entity_type="Appointment",
            entity_id=str(appointment.id),
            description=f"Booked appointment for {patient.name} with token {token}"
        )

        await self.db.commit()
        return appointment
