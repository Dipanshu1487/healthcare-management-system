from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/doctors", tags=["Clinical Portal"])

@router.get("/queue")
async def get_patient_queue(
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Mock return values for consultations queue
    return success_response(
        data=[
            {"id": "1", "uhid": "JHR-2026-98124", "name": "Rohan Oraon", "priority": "Normal"},
            {"id": "2", "uhid": "JHR-2026-38294", "name": "Geeta Devi", "priority": "Urgent"}
        ],
        message="Patient queue fetched"
    )
