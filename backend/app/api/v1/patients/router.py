from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.user import PatientRegisterRequest
from app.services.patient import PatientService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/patients", tags=["Patient Management"])

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register_patient(
    payload: PatientRegisterRequest,
    db: AsyncSession = Depends(get_db)
):
    service = PatientService(db)
    patient = await service.register_patient(payload)
    return success_response(
        data={
            "id": str(patient.id),
            "uhid": patient.uhid,
            "name": patient.name
        },
        message="Patient registered successfully"
    )

@router.get("/search")
async def search_patients(
    query: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = PatientService(db)
    results = await service.patient_repo.search_patients(query)
    return success_response(
        data=[
            {
                "id": str(p.id),
                "uhid": p.uhid,
                "name": p.name,
                "mobile": p.mobile,
                "gender": p.gender,
                "age": p.age
            } for p in results
        ],
        message="Search completed"
    )
