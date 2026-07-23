import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.consultation import Consultation
    from app.models.doctor import Doctor
    from app.models.patient import Patient

class MedicalRecord(AuditableModel):
    __tablename__ = "medical_records"
    __table_args__ = (
        Index("ix_medical_records_patient_date", "patient_id", "record_date"),
    )

    record_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    record_type: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    department: Mapped[str] = mapped_column(String(100), nullable=False)
    diagnosis: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    doctor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    consultation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("consultations.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="medical_records")
    doctor: Mapped["Doctor | None"] = relationship(back_populates="medical_records")
    consultation: Mapped["Consultation | None"] = relationship(back_populates="medical_record")
