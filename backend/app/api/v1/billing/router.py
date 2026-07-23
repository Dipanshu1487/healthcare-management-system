from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.billing import BillingService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/billing", tags=["Billing & Payments"])

@router.post("/invoice")
async def create_invoice(
    patient_id: str,
    total_amount: float,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = BillingService(db)
    bill = await service.create_invoice(
        patient_id=patient_id,
        total_amount=total_amount
    )
    return success_response(
        data={"invoice_id": str(bill.id), "invoice_no": bill.invoice_no, "total": str(bill.total_amount)},
        message="Invoice created successfully"
    )

@router.post("/pay")
async def record_payment(
    bill_id: str,
    amount: float,
    payment_method: str,
    transaction_ref: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = BillingService(db)
    payment = await service.record_payment(
        billing_clerk=user.username,
        bill_id=bill_id,
        amount=amount,
        payment_method=payment_method,
        transaction_ref=transaction_ref
    )
    return success_response(
        data={"payment_id": str(payment.id), "status": payment.status},
        message="Payment recorded successfully"
    )
