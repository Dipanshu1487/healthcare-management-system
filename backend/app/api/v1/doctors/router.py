from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.doctor import Doctor
from app.models.staff import StaffProfile
from app.models.appointment import Appointment
from app.models.patient import Patient
from app.utils.responses import success_response
from app.core.exceptions import APIException


router = APIRouter(
    prefix="/doctors",
    tags=["Clinical Portal"]
)


# ---------------------------------------------------------
# List Doctors
# ---------------------------------------------------------

@router.get("")
async def list_doctors(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Doctor)
    )

    doctors = result.scalars().all()

    return success_response(
        data=[
            {
                "id": str(doctor.id),
                "name": doctor.name,
                "designation": doctor.designation,
                "qualification": doctor.qualification,
                "available": doctor.available,
                "status": doctor.status,
                "department_id": str(doctor.department_id)
            }
            for doctor in doctors
        ],
        message="Doctors retrieved successfully"
    )


# ---------------------------------------------------------
# Doctor Patient Queue
# ---------------------------------------------------------

@router.get("/queue")
async def get_patient_queue(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):

    # -----------------------------------------------------
    # 1. Find Staff Profile of logged-in user
    # -----------------------------------------------------

    profile_result = await db.execute(
        select(StaffProfile).where(
            StaffProfile.user_id == user.id
        )
    )

    profile = profile_result.scalars().first()

    if not profile:
        raise APIException(
            message="Staff profile not found",
            status_code=404
        )


    # -----------------------------------------------------
    # 2. Find Doctor linked to Staff Profile
    # -----------------------------------------------------

    doctor_result = await db.execute(
        select(Doctor).where(
            Doctor.staff_profile_id == profile.id
        )
    )

    doctor = doctor_result.scalars().first()

    if not doctor:
        raise APIException(
            message="Doctor profile not found",
            status_code=404
        )


    # -----------------------------------------------------
    # 3. Get today's appointments for this doctor
    # -----------------------------------------------------

    appointment_result = await db.execute(
        select(Appointment, Patient)
        .join(
            Patient,
            Appointment.patient_id == Patient.id
        )
        .where(
            Appointment.doctor_id == doctor.id,
            Appointment.date == date.today(),
            Appointment.status.in_(["Scheduled", "Waiting"])
        )
        .order_by(
            Appointment.created_at.asc()
        )
    )

    rows = appointment_result.all()


    # -----------------------------------------------------
    # 4. Build queue response
    # -----------------------------------------------------

    queue = []

    for appointment, patient in rows:

        queue.append(
            {
                "id": str(appointment.id),
                "token": appointment.token,
                "uhid": patient.uhid,
                "name": patient.name,
                "priority": appointment.priority,
                "time_slot": appointment.time_slot,
                "status": appointment.status,
                "symptoms": appointment.symptoms
            }
        )


    # -----------------------------------------------------
    # 5. Return real queue
    # -----------------------------------------------------

    return success_response(
        data=queue,
        message="Patient queue fetched successfully"
    )