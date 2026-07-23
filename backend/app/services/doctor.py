from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.appointment import AppointmentRepository
from app.services.audit import AuditService
from app.models.consultation import Consultation
from app.models.diagnosis import Diagnosis
from app.core.exceptions import APIException

class DoctorService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.appointment_repo = AppointmentRepository(db)
        self.audit_service = AuditService(db)

    async def complete_consultation(
        self,
        doctor_name: str,
        appointment_id: str,
        diagnosis_desc: str,
        summary: str
    ) -> Consultation:
        appointment = await self.appointment_repo.get(appointment_id)
        if not appointment:
            raise APIException(message="Appointment not found", status_code=404)

        # 1. Create Consultation record
        consult = Consultation(
            diagnosis=diagnosis_desc,
            summary=summary,
            appointment_id=appointment.id,
            status="active"
        )
        self.db.add(consult)
        await self.db.flush()

        # 2. Add Diagnosis
        diag = Diagnosis(
            description=diagnosis_desc,
            consultation_id=consult.id,
            status="active"
        )
        self.db.add(diag)
        await self.db.flush()

        # 3. Complete Appointment status
        appointment.status = "Completed"
        self.db.add(appointment)

        # 4. Save Audit log
        await self.audit_service.log_action(
            actor_role="Doctor",
            actor_name=doctor_name,
            action="COMPLETE_CONSULTATION",
            entity_type="Consultation",
            entity_id=str(consult.id),
            description=f"Consultation completed for appointment {appointment.token}"
        )

        await self.db.commit()
        return consult
