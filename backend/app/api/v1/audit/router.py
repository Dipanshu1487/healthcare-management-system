from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.repositories.audit_log import AuditLogRepository
from app.api.deps import get_current_active_user, RoleChecker
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/audit", tags=["Security Audits"])

@router.get("/logs")
async def list_audit_logs(
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(RoleChecker(["it-admin", "admin"]))
):
    repo = AuditLogRepository(db)
    logs = await repo.get_recent_logs(limit)
    return success_response(
        data=[
            {
                "id": str(log.id),
                "actor_role": log.actor_role,
                "actor_name": log.actor_name,
                "action": log.action,
                "entity_type": log.entity_type,
                "entity_id": log.entity_id,
                "description": log.description,
                "timestamp": str(log.created_at)
            } for log in logs
        ],
        message="Audit logs history retrieved"
    )
