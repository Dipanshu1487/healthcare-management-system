from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.audit_log import AuditLogRepository
from app.models.audit_log import AuditLog

class AuditService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = AuditLogRepository(db)

    async def log_action(
        self,
        actor_role: str,
        actor_name: str,
        action: str,
        entity_type: str,
        entity_id: str,
        description: str
    ) -> AuditLog:
        """Create and store a unified audit log entry."""
        log = AuditLog(
            actor_role=actor_role,
            actor_name=actor_name,
            action=action,
            entity_type=entity_type,
            entity_id=entity_id,
            description=description
        )
        return await self.repo.create(log)
