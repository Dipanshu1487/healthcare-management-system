from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.notification import NotificationService
from app.services.background import BackgroundTasksService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/notifications", tags=["Notification Center"])

@router.get("")
async def list_notifications(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Retrieve alerts targeting user's specific role
    role_name = user.role.name if user.role else "patient"
    service = NotificationService(db)
    
    # Simple list matching targets
    from sqlalchemy import select
    from app.models.notification import Notification
    result = await db.execute(
        select(Notification).where(
            (Notification.target_role == role_name) | 
            (Notification.target_role == "All")
        )
    )
    notes = result.scalars().all()
    
    return success_response(
        data=[
            {
                "id": str(n.id),
                "title": n.title,
                "message": n.message,
                "read": n.read,
                "type": n.notification_type
            } for n in notes
        ],
        message="Notifications list loaded"
    )

@router.patch("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = NotificationService(db)
    await service.mark_read(notification_id)
    return success_response(
        message="Notification marked as read"
    )

@router.post("/trigger-test-email")
async def trigger_test_email(
    to_email: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    """Trigger background job task runner simulation."""
    worker = BackgroundTasksService(db)
    background_tasks.add_task(
        worker.execute_email_job,
        to_email=to_email,
        subject="CHC Bharno Notification Test",
        body=f"Hello! This is a verification check triggered by {user.username}."
    )
    return success_response(
        message="Email background processing job scheduled"
    )
