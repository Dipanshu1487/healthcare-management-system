import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import PrescriptionStatus, Priority

if TYPE_CHECKING:
    from app.models.consultation import Consultation
    from app.models.doctor import Doctor
    from app.models.patient import Patient
    from app.models.prescription_item import PrescriptionItem

class Prescription(AuditableModel):
    __tablename__ = "prescriptions"

    priority: Mapped[str] = mapped_column(
        String(50),
        default=Priority.NORMAL,
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=PrescriptionStatus.PENDING,
        nullable=False,
        index=True,
    )
    diagnosis: Mapped[str | None] = mapped_column(String(255), nullable=True)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    allergies_snapshot: Mapped[str | None] = mapped_column(String(255), nullable=True)
    weight_snapshot: Mapped[str | None] = mapped_column(String(20), nullable=True)
    blood_group_snapshot: Mapped[str | None] = mapped_column(String(10), nullable=True)

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    consultation_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("consultations.id", ondelete="SET NULL"),
        nullable=True,
        unique=True,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="prescriptions")
    doctor: Mapped["Doctor"] = relationship(back_populates="prescriptions")
    consultation: Mapped["Consultation | None"] = relationship(back_populates="prescription")
    items: Mapped[list["PrescriptionItem"]] = relationship(
        back_populates="prescription",
        cascade="all, delete-orphan",
    )
