import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import EmergencyStatus, EmergencyTriage, RecordStatus

if TYPE_CHECKING:
    from app.models.patient import Patient

class EmergencyCase(AuditableModel):
    __tablename__ = "emergency_cases"

    patient_name: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    condition: Mapped[str] = mapped_column(String(255), nullable=False)
    triage: Mapped[str] = mapped_column(
        String(50),
        default=EmergencyTriage.MODERATE,
        nullable=False,
        index=True,
    )
    case_status: Mapped[str] = mapped_column(
        String(50),
        default=EmergencyStatus.ACTIVE,
        nullable=False,
        index=True,
    )
    admitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        index=True,
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    patient: Mapped["Patient | None"] = relationship(back_populates="emergency_cases")
