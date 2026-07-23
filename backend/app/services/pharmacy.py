from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.pharmacy import PharmacyRepository
from app.services.audit import AuditService
from app.core.exceptions import APIException
from app.models.prescription import Prescription

class PharmacyService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.pharmacy_repo = PharmacyRepository(db)
        self.audit_service = AuditService(db)

    async def dispense_prescription(
        self,
        pharmacist_name: str,
        prescription_id: str
    ) -> Prescription:
        prescription = await self.pharmacy_repo.get(prescription_id)
        if not prescription:
            raise APIException(message="Prescription not found", status_code=404)

        if prescription.status == "Dispensed":
            raise APIException(message="Prescription already dispensed", status_code=400)

        # 1. Verify and deduct inventory for each item
        for item in prescription.items:
            stocks = await self.pharmacy_repo.get_inventory_stock_by_medicine(item.medicine_id)
            available_qty = sum(stock.quantity for stock in stocks)
            if available_qty < item.qty_needed:
                raise APIException(
                    message=f"Insufficient inventory stock for medicine: {item.medicine.name}",
                    status_code=400
                )

            # Deduct from nearest expiry batches
            remaining_needed = item.qty_needed
            for stock in stocks:
                if remaining_needed <= 0:
                    break
                deduct = min(stock.quantity, remaining_needed)
                await self.pharmacy_repo.update_inventory_qty(stock.id, deduct)
                remaining_needed -= deduct

        # 2. Update prescription status
        prescription.status = "Dispensed"
        self.db.add(prescription)

        # 3. Log Audit action
        await self.audit_service.log_action(
            actor_role="Pharmacist",
            actor_name=pharmacist_name,
            action="DISPENSE_PRESCRIPTION",
            entity_type="Prescription",
            entity_id=str(prescription.id),
            description=f"Dispensed prescription items for ID: {prescription_id}"
        )

        await self.db.commit()
        return prescription
