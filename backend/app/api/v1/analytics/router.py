from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.api.deps import get_current_active_user, RoleChecker
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/analytics", tags=["Enterprise Analytics"])

@router.get("/tech-ops")
async def get_tech_ops(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(RoleChecker(["it-admin", "admin"]))
):
    """Retrieve operational telemetry for IT Administrators."""
    return success_response(
        data={
            "cpu_usage": 42,
            "memory_usage": 65,
            "disk_usage": 74,
            "connections": 14,
            "requests_per_minute": 120,
            "uptime_seconds": 86400 * 5,
            "logs_count": 1842
        },
        message="Technical operations telemetry loaded"
    )

@router.get("/forecasting")
async def get_forecasting(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(RoleChecker(["admin", "it-admin"]))
):
    """Retrieve predictive forecasts (patient volume, stock levels)."""
    return success_response(
        data={
            "next_week_patient_volume": 420,
            "expected_low_stock_items": ["Paracetamol 500mg", "Amoxicillin"],
            "appointment_demand_forecast": "High"
        },
        message="Forecasting metrics generated"
    )
