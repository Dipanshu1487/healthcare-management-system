import logging
import asyncio
from app.services.audit import AuditService
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger("app")

class EmailService:
    @staticmethod
    async def send_email(to_email: str, subject: str, body: str) -> None:
        """Simulate async SMTP email dispatch."""
        logger.info(f"[Email Simulation] Dispatching to: {to_email}")
        logger.info(f"[Email Simulation] Subject: {subject}")
        logger.info(f"[Email Simulation] Body: {body}")
        await asyncio.sleep(1) # Simulate network transmission latency

class BackgroundTasksService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit_service = AuditService(db)

    async def execute_email_job(self, to_email: str, subject: str, body: str) -> None:
        try:
            await EmailService.send_email(to_email, subject, body)
            # Log action
            await self.audit_service.log_action(
                actor_role="System",
                actor_name="Background Workers",
                action="EMAIL_DISPATCH_SUCCESS",
                entity_type="System",
                entity_id="N/A",
                description=f"Successfully delivered email subject: '{subject}' to: {to_email}"
            )
            await self.db.commit()
        except Exception as err:
            logger.error(f"Background email delivery failed: {err}")
