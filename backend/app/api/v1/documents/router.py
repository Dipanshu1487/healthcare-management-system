from fastapi import APIRouter, Depends, UploadFile, File, Response, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.services.document import DocumentService
from app.services.pdf import PDFGeneratorService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response
import uuid

router = APIRouter(prefix="/documents", tags=["Document Management"])

@router.post("/upload")
async def upload_document(
    patient_id: str,
    category: str,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    service = DocumentService(db)
    doc = await service.upload_document(
        patient_id=patient_id,
        category=category,
        file=file,
        uploader_name=user.username
    )
    return success_response(
        data={
            "id": str(doc.id),
            "filename": doc.filename,
            "category": doc.category,
            "mime_type": doc.mime_type
        },
        message="Document uploaded successfully"
    )

@router.get("/prescription/{prescription_id}/pdf")
async def get_prescription_pdf(
    prescription_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_active_user)
):
    # Retrieve mock PDF representation
    pdf_bytes = PDFGeneratorService.generate_prescription_pdf(
        patient_name="Rohan Oraon",
        uhid="JHR-2026-98124",
        doctor_name="Dr. Priya Sharma",
        diagnosis="Hypertension",
        items=[{"name": "Amlodipine 5mg", "dosage": "Once Daily", "duration": "30 Days"}]
    )
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=prescription_{prescription_id}.pdf"}
    )
