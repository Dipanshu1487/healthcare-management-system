from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.laboratory import LaboratoryService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/laboratory", tags=["Laboratory Portal"])

@router.post("/collect-sample")
async def collect_sample(
    sample_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = LaboratoryService(db)
    order = await service.collect_sample(
        technician_name=user.username,
        sample_id=sample_id
    )
    return success_response(
        data={"sample_id": order.sample_id, "status": order.status},
        message="Sample collected successfully"
    )

@router.post("/verify-report")
async def verify_report(
    sample_id: str,
    result_value: str,
    normal_range: str,
    remarks: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = LaboratoryService(db)
    report = await service.verify_report(
        technician_name=user.username,
        sample_id=sample_id,
        result_value=result_value,
        normal_range=normal_range,
        remarks=remarks
    )
    return success_response(
        data={"report_id": str(report.id), "status": report.status},
        message="Report verified successfully"
    )
