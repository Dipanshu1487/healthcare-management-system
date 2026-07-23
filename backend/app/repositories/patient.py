from typing import Optional, List
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.patient import Patient

class PatientRepository(BaseRepository[Patient]):
    def __init__(self, db: AsyncSession):
        super().__init__(Patient, db)

    async def get_by_uhid(self, uhid: str) -> Optional[Patient]:
        result = await self.db.execute(select(Patient).where(Patient.uhid == uhid))
        return result.scalars().first()

    async def get_by_aadhaar(self, aadhaar: str) -> Optional[Patient]:
        result = await self.db.execute(select(Patient).where(Patient.aadhaar == aadhaar))
        return result.scalars().first()

    async def search_patients(self, query: str) -> List[Patient]:
        result = await self.db.execute(
            select(Patient)
            .where(
                or_(
                    Patient.name.ilike(f"%{query}%"),
                    Patient.uhid.ilike(f"%{query}%"),
                    Patient.mobile.ilike(f"%{query}%")
                )
            )
        )
        return result.scalars().all()
