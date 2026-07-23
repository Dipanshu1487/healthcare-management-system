import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.appointment import Appointment
    from app.models.diagnosis import Diagnosis
    from app.models.medical_record import MedicalRecord
    from app.models.prescription import Prescription

class Consultation(AuditableModel):
    __tablename__ = "consultations"

    diagnosis: Mapped[str] = mapped_column(String(255), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    appointment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("appointments.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    appointment: Mapped["Appointment"] = relationship(back_populates="consultations")
    diagnoses: Mapped[list["Diagnosis"]] = relationship(
        back_populates="consultation",
        cascade="all, delete-orphan",
    )
    medical_record: Mapped["MedicalRecord | None"] = relationship(
        back_populates="consultation",
        uselist=False,
    )
    prescription: Mapped["Prescription | None"] = relationship(
        back_populates="consultation",
        uselist=False,
    )
