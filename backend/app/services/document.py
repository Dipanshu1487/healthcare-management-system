import os
import uuid
import shutil
from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.document import Document
from app.services.audit import AuditService
from app.core.exceptions import APIException

UPLOAD_DIR = "storage"
MAX_FILE_SIZE = 10 * 1024 * 1024 # 10MB
ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"]

class DocumentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.audit_service = AuditService(db)

    async def upload_document(
        self,
        patient_id: str,
        category: str,
        file: UploadFile,
        uploader_name: str
    ) -> Document:
        # 1. Validate File Size
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise APIException(message="File size exceeds maximum limit of 10MB", status_code=400)

        # 2. Validate MIME Type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise APIException(message="Unsupported file type format", status_code=400)

        # 3. Create Storage directory (Format: storage/patients/{id}/{category}/)
        patient_storage_path = os.path.join(UPLOAD_DIR, "patients", patient_id, category)
        os.makedirs(patient_storage_path, exist_ok=True)

        # 4. Generate Stored name to prevent collision
        file_extension = os.path.splitext(file.filename)[1]
        stored_filename = f"{uuid.uuid4().hex}{file_extension}"
        stored_path = os.path.join(patient_storage_path, stored_filename)

        # 5. Save file to disk
        with open(stored_path, "wb") as f:
            shutil.copyfileobj(file.file, f)

        # 6. Save metadata
        doc = Document(
            filename=file.filename,
            stored_path=stored_path,
            mime_type=file.content_type,
            file_size=file_size,
            category=category,
            status="active",
            patient_id=uuid.UUID(patient_id)
        )
        self.db.add(doc)
        await self.db.flush()

        # 7. Log Audit
        await self.audit_service.log_action(
            actor_role="System",
            actor_name=uploader_name,
            action="UPLOAD_DOCUMENT",
            entity_type="Patient",
            entity_id=patient_id,
            description=f"Uploaded file: {file.filename} as category {category}"
        )

        await self.db.commit()
        return doc
