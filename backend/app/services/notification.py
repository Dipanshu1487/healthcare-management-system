from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.notification import Notification
from app.services.audit import AuditService
import uuid

class NotificationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit_service = AuditService(db)

    async def create_notification(
        self,
        target_role: str,
        title: str,
        message: str,
        notification_type: str = "info"
    ) -> Notification:
        note = Notification(
            target_role=target_role,
            title=title,
            message=message,
            read=False,
            notification_type=notification_type,
            status="active"
        )
        self.db.add(note)
        await self.db.flush()
        
        # Log Audit
        await self.audit_service.log_action(
            actor_role="System",
            actor_name="Notification Service",
            action="CREATE_NOTIFICATION",
            entity_type="System",
            entity_id=str(note.id),
            description=f"Generated '{title}' alert targeted to: {target_role}"
        )
        await self.db.commit()
        return note

    async def mark_read(self, notification_id: str) -> None:
        notification_uuid = uuid.UUID(notification_id)
        await self.db.execute(
            update(Notification)
            .where(Notification.id == notification_uuid)
            .values(read=True)
        )
        await self.db.commit()
