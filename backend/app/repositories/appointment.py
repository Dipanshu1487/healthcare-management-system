from typing import List
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.appointment import Appointment

class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, db: AsyncSession):
        super().__init__(Appointment, db)

    async def get_appointments_by_date(self, target_date: date) -> List[Appointment]:
        result = await self.db.execute(
            select(Appointment).where(Appointment.date == target_date)
        )
        return result.scalars().all()

    async def get_doctor_queue_by_date(self, doctor_id: str, target_date: date) -> List[Appointment]:
        result = await self.db.execute(
            select(Appointment)
            .where(
                (Appointment.doctor_id == doctor_id) & 
                (Appointment.date == target_date) & 
                (Appointment.status == "Waiting")
            )
            .order_by(Appointment.created_at.asc())
        )
        return result.scalars().all()
