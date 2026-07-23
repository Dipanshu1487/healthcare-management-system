from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.laboratory import LaboratoryRepository
from app.services.audit import AuditService
from app.models.lab_order import LabOrder
from app.models.lab_report import LabReport
from app.core.exceptions import APIException

class LaboratoryService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.lab_repo = LaboratoryRepository(db)
        self.audit_service = AuditService(db)

    async def collect_sample(
        self,
        technician_name: str,
        sample_id: str
    ) -> LabOrder:
        order = await self.lab_repo.get_by_sample_id(sample_id)
        if not order:
            raise APIException(message="Laboratory order not found", status_code=404)

        order.status = "Collected"
        self.db.add(order)

        # Log action
        await self.audit_service.log_action(
            actor_role="Laboratory Technician",
            actor_name=technician_name,
            action="SAMPLE_COLLECTED",
            entity_type="LabOrder",
            entity_id=str(order.id),
            description=f"Collected sample for lab order token: {order.sample_id}"
        )

        await self.db.commit()
        return order

    async def verify_report(
        self,
        technician_name: str,
        sample_id: str,
        result_value: str,
        normal_range: str,
        remarks: str
    ) -> LabReport:
        order = await self.lab_repo.get_by_sample_id(sample_id)
        if not order:
            raise APIException(message="Laboratory order not found", status_code=404)

        # 1. Create lab report
        report = LabReport(
            result_value=result_value,
            normal_range=normal_range,
            remarks=remarks,
            technician_name=technician_name,
            status="Verified",
            order_id=order.id
        )
        self.db.add(report)

        # 2. Update order status
        order.status = "Completed"
        self.db.add(order)

        # 3. Log Audit Action
        await self.audit_service.log_action(
            actor_role="Laboratory Technician",
            actor_name=technician_name,
            action="VERIFY_REPORT",
            entity_type="LabReport",
            entity_id=str(report.id),
            description=f"Verified laboratory test result values for sample {sample_id}"
        )

        await self.db.commit()
        return report
