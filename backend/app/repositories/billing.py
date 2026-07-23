from typing import List, Optional
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.bill import Bill

class BillingRepository(BaseRepository[Bill]):
    def __init__(self, db: AsyncSession):
        super().__init__(Bill, db)

    async def get_by_invoice_no(self, invoice_no: str) -> Optional[Bill]:
        result = await self.db.execute(
            select(Bill).where(Bill.invoice_no == invoice_no)
        )
        return result.scalars().first()

    async def get_patient_bills(self, patient_id: uuid.UUID) -> List[Bill]:
        result = await self.db.execute(
            select(Bill).where(Bill.patient_id == patient_id)
        )
        return result.scalars().all()
