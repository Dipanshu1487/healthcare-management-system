import random
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.billing import BillingRepository
from app.services.audit import AuditService
from app.models.bill import Bill
from app.models.payment import Payment
from app.core.exceptions import APIException

class BillingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.billing_repo = BillingRepository(db)
        self.audit_service = AuditService(db)

    async def create_invoice(
        self,
        patient_id: str,
        total_amount: float
    ) -> Bill:
        random_suffix = random.randint(1000, 9999)
        invoice_no = f"INV-2026-{random_suffix}"

        bill = Bill(
            invoice_no=invoice_no,
            total_amount=total_amount,
            status="Unpaid",
            patient_id=patient_id
        )
        await self.billing_repo.create(bill)

        await self.audit_service.log_action(
            actor_role="System",
            actor_name="Billing Engine",
            action="CREATE_INVOICE",
            entity_type="Bill",
            entity_id=str(bill.id),
            description=f"Generated invoice {invoice_no} for total amount {total_amount}"
        )

        await self.db.commit()
        return bill

    async def record_payment(
        self,
        billing_clerk: str,
        bill_id: str,
        amount: float,
        payment_method: str,
        transaction_ref: str
    ) -> Payment:
        bill = await self.billing_repo.get(bill_id)
        if not bill:
            raise APIException(message="Invoice bill not found", status_code=404)

        if bill.status == "Paid":
            raise APIException(message="Invoice already paid", status_code=400)

        # 1. Record payment
        pay = Payment(
            amount=amount,
            payment_method=payment_method,
            transaction_ref=transaction_ref,
            status="Completed",
            bill_id=bill.id
        )
        self.db.add(pay)

        # 2. Update Bill status
        bill.status = "Paid"
        bill.payment_method = payment_method
        self.db.add(bill)

        # 3. Log Audit Action
        await self.audit_service.log_action(
            actor_role="Cashier",
            actor_name=billing_clerk,
            action="RECORD_PAYMENT",
            entity_type="Payment",
            entity_id=str(pay.id),
            description=f"Recorded payment for invoice {bill.invoice_no}"
        )

        await self.db.commit()
        return pay
