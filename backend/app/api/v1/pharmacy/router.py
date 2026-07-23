from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.pharmacy import PharmacyService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy & Inventory"])

@router.post("/dispense")
async def dispense_prescription(
    prescription_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = PharmacyService(db)
    prescription = await service.dispense_prescription(
        pharmacist_name=user.username,
        prescription_id=prescription_id
    )
    return success_response(
        data={"prescription_id": str(prescription.id), "status": prescription.status},
        message="Prescription items dispensed and inventory stocks updated"
    )
