import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import AppointmentStatus, Priority

if TYPE_CHECKING:
    from app.models.consultation import Consultation
    from app.models.department import Department
    from app.models.doctor import Doctor
    from app.models.patient import Patient

class Appointment(AuditableModel):
    __tablename__ = "appointments"
    __table_args__ = (
        Index("ix_appointments_date_doctor", "date", "doctor_id"),
        Index("ix_appointments_date_status", "date", "status"),
    )

    token: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    time_slot: Mapped[str] = mapped_column(String(50), nullable=False)
    room: Mapped[str | None] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=AppointmentStatus.SCHEDULED,
        nullable=False,
        index=True,
    )
    priority: Mapped[str] = mapped_column(
        String(50),
        default=Priority.NORMAL,
        nullable=False,
        index=True,
    )
    symptoms: Mapped[str | None] = mapped_column(String(255), nullable=True)
    triage: Mapped[str | None] = mapped_column(String(100), nullable=True)

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
    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="appointments")
    doctor: Mapped["Doctor"] = relationship(back_populates="appointments")
    department: Mapped["Department"] = relationship(back_populates="appointments")
    consultations: Mapped[list["Consultation"]] = relationship(
        back_populates="appointment",
        cascade="all, delete-orphan",
    )
