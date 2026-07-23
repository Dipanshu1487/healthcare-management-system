from typing import List, Optional
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.prescription import Prescription
from app.models.inventory import Inventory

class PharmacyRepository(BaseRepository[Prescription]):
    def __init__(self, db: AsyncSession):
        super().__init__(Prescription, db)

    async def get_pending_prescriptions(self) -> List[Prescription]:
        result = await self.db.execute(
            select(Prescription).where(Prescription.status == "Pending")
        )
        return result.scalars().all()

    async def get_inventory_stock_by_medicine(self, medicine_id: uuid.UUID) -> List[Inventory]:
        result = await self.db.execute(
            select(Inventory)
            .where(Inventory.medicine_id == medicine_id)
            .order_by(Inventory.expiry_date.asc())
        )
        return result.scalars().all()

    async def update_inventory_qty(self, inventory_id: uuid.UUID, deduct_qty: int) -> Optional[Inventory]:
        result = await self.db.execute(select(Inventory).where(Inventory.id == inventory_id))
        inv = result.scalars().first()
        if inv:
            inv.quantity = max(0, inv.quantity - deduct_qty)
            if inv.quantity == 0:
                inv.status = "Out of Stock"
            elif inv.quantity < 500:
                inv.status = "Low Stock"
            self.db.add(inv)
            await self.db.flush()
        return inv
