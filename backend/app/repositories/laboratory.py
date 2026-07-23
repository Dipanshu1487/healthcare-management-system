from typing import List, Optional
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.lab_order import LabOrder

class LaboratoryRepository(BaseRepository[LabOrder]):
    def __init__(self, db: AsyncSession):
        super().__init__(LabOrder, db)

    async def get_orders_by_status(self, status: str) -> List[LabOrder]:
        result = await self.db.execute(
            select(LabOrder).where(LabOrder.status == status)
        )
        return result.scalars().all()

    async def get_by_sample_id(self, sample_id: str) -> Optional[LabOrder]:
        result = await self.db.execute(
            select(LabOrder).where(LabOrder.sample_id == sample_id)
        )
        return result.scalars().first()
