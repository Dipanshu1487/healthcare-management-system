import uuid
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.services.scheduler import SchedulerService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/schedules", tags=["Enterprise Scheduler"])


@router.get("/availability")
async def get_availability(
    doctor_id: str,
    target_date: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    try:
        doc_uuid = uuid.UUID(doctor_id)
        d_date = date.fromisoformat(target_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid doctor ID or date format.")

    service = SchedulerService(db)
    slots = await service.get_doctor_availability(doc_uuid, d_date)
    return success_response(data=slots, message="Doctor availability slots fetched.")


@router.post("/appointments", status_code=status.HTTP_201_CREATED)
async def book_slot(
    patient_id: str,
    doctor_id: str,
    target_date: str,
    time_slot: str,
    symptoms: str,
    priority: str = "Normal",
    room: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    try:
        p_uuid = uuid.UUID(patient_id)
        d_uuid = uuid.UUID(doctor_id)
        d_date = date.fromisoformat(target_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID or date format.")

    service = SchedulerService(db)
    try:
        appointment = await service.book_appointment_slot(
            patient_id=p_uuid,
            doctor_id=d_uuid,
            target_date=d_date,
            time_slot=time_slot,
            symptoms=symptoms,
            priority=priority,
            room=room
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return success_response(
        data={
            "id": str(appointment.id),
            "token": appointment.token,
            "date": str(appointment.date),
            "time_slot": appointment.time_slot,
            "room": appointment.room
        },
        message="Appointment booked successfully"
    )


@router.delete("/appointments/{appointment_id}")
async def cancel_appointment_slot(
    appointment_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    try:
        apt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid appointment ID.")

    service = SchedulerService(db)
    success = await service.cancel_appointment(apt_uuid)
    if not success:
        raise HTTPException(status_code=404, detail="Appointment not found.")

    return success_response(message="Appointment cancelled successfully.")


@router.post("/leaves")
async def request_leave(
    start_date: str,
    end_date: str,
    leave_type: str,
    reason: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    try:
        s_date = date.fromisoformat(start_date)
        e_date = date.fromisoformat(end_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    service = SchedulerService(db)
    leave = await service.file_leave_request(
        user_id=user.id,
        start_date=s_date,
        end_date=e_date,
        leave_type=leave_type,
        reason=reason
    )
    return success_response(
        data={"id": str(leave.id), "status": leave.status},
        message="Leave request submitted."
    )


@router.post("/leaves/{leave_id}/process")
async def process_leave(
    leave_id: str,
    status: str,  # Approved or Rejected
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Enforce admin check
    if not any(role.name in ["Hospital Administrator", "System Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Only administrators can approve/reject leaves.")

    try:
        l_uuid = uuid.UUID(leave_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid leave ID format.")

    service = SchedulerService(db)
    leave = await service.process_leave_request(l_uuid, status, user.id)
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found.")

    return success_response(
        data={"id": str(leave.id), "status": leave.status},
        message=f"Leave request {status.lower()} successfully."
    )


@router.get("/shifts")
async def get_shifts(
    target_date: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    try:
        t_date = date.fromisoformat(target_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format.")

    service = SchedulerService(db)
    shifts = await service.get_shifts(t_date)
    return success_response(
        data=[
            {
                "id": str(s.id),
                "user_id": str(s.user_id),
                "shift_type": s.shift_type,
                "start_time": s.start_time.strftime("%H:%M:%S") if s.start_time else None,
                "end_time": s.end_time.strftime("%H:%M:%S") if s.end_time else None,
                "date": str(s.date)
            }
            for s in shifts
        ],
        message="Shifts list fetched."
    )


@router.post("/shifts")
async def assign_user_shift(
    user_id: str,
    shift_type: str,
    target_date: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Only administrators can assign shifts.")

    try:
        u_uuid = uuid.UUID(user_id)
        t_date = date.fromisoformat(target_date)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid UUID or date format.")

    service = SchedulerService(db)
    try:
        shift = await service.assign_shift(u_uuid, shift_type, t_date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return success_response(
        data={
            "id": str(shift.id),
            "shift_type": shift.shift_type,
            "date": str(shift.date)
        },
        message="Shift assigned successfully."
    )
