from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/dashboard", tags=["System Dashboard"])

@router.get("/kpis")
async def get_kpis(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Mock data statistics matching frontend dashboard cards
    return success_response(
        data={
            "total_patients": 1824,
            "active_doctors": 12,
            "pending_prescriptions": 18,
            "pending_lab_reports": 9,
            "today_appointments": 42
        },
        message="Dashboard KPIs statistics loaded successfully"
    )
