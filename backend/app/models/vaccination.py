import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus, VaccinationStatus

if TYPE_CHECKING:
    from app.models.doctor import Doctor
    from app.models.patient import Patient

class Vaccination(AuditableModel):
    __tablename__ = "vaccinations"

    vaccine_name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    scheduled_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    dosage: Mapped[str] = mapped_column(String(100), nullable=False)
    administered_by_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=VaccinationStatus.SCHEDULED,
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    administered_by_doctor_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="vaccinations")
    administered_by_doctor: Mapped["Doctor | None"] = relationship(
        back_populates="vaccinations",
    )
