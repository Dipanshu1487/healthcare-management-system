from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.appointment import AppointmentService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response
import datetime

router = APIRouter(prefix="/appointments", tags=["OPD Management"])

@router.post("", status_code=status.HTTP_201_CREATED)
async def book_appointment(
    patient_id: str,
    doctor_id: str,
    time_slot: str,
    symptoms: str,
    priority: str = "Normal",
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = AppointmentService(db)
    appointment = await service.book_appointment(
        patient_id=patient_id,
        doctor_id=doctor_id,
        target_date=datetime.date.today(),
        time_slot=time_slot,
        symptoms=symptoms,
        priority=priority
    )
    return success_response(
        data={
            "id": str(appointment.id),
            "token": appointment.token,
            "date": str(appointment.date)
        },
        message="Appointment booked successfully"
    )
