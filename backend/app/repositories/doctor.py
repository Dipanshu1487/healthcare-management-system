from typing import List, Optional
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.doctor import Doctor

class DoctorRepository(BaseRepository[Doctor]):
    def __init__(self, db: AsyncSession):
        super().__init__(Doctor, db)

    async def get_available_doctors(self) -> List[Doctor]:
        result = await self.db.execute(
            select(Doctor).where(Doctor.available == True)
        )
        return result.scalars().all()

    async def get_by_department(self, department_id: uuid.UUID) -> List[Doctor]:
        result = await self.db.execute(
            select(Doctor).where(Doctor.department_id == department_id)
        )
        return result.scalars().all()
