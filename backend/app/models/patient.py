import uuid
from datetime import date, datetime
from typing import TYPE_CHECKING, Any

from sqlalchemy import Date, DateTime, Index, Integer, String, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.appointment import Appointment
    from app.models.bill import Bill
    from app.models.emergency_case import EmergencyCase
    from app.models.emergency_contact import EmergencyContact
    from app.models.lab_order import LabOrder
    from app.models.medical_history import MedicalHistory
    from app.models.medical_record import MedicalRecord
    from app.models.prescription import Prescription
    from app.models.timeline_event import TimelineEvent
    from app.models.vaccination import Vaccination

class Patient(AuditableModel):
    __tablename__ = "patients"
    __table_args__ = (
        Index("ix_patients_district_state", "district", "state"),
    )

    uhid: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    gender: Mapped[str] = mapped_column(String(20), nullable=False)
    dob: Mapped[date] = mapped_column(Date, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    mobile: Mapped[str] = mapped_column(String(20), nullable=False, index=True)
    alt_mobile: Mapped[str | None] = mapped_column(String(20), nullable=True)
    aadhaar: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    blood_group: Mapped[str | None] = mapped_column(String(10), nullable=True)
    guardian: Mapped[str | None] = mapped_column(String(100), nullable=True)
    guardian_relation: Mapped[str | None] = mapped_column(String(50), nullable=True)
    scheme: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    occupation: Mapped[str | None] = mapped_column(String(100), nullable=True)
    weight: Mapped[str | None] = mapped_column(String(20), nullable=True)
    allergies: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    chronic_conditions: Mapped[list[Any] | None] = mapped_column(JSON, nullable=True)
    registered_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    emergency_contacts: Mapped[list["EmergencyContact"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    medical_history: Mapped[list["MedicalHistory"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
    )
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="patient")
    prescriptions: Mapped[list["Prescription"]] = relationship(back_populates="patient")
    lab_orders: Mapped[list["LabOrder"]] = relationship(back_populates="patient")
    bills: Mapped[list["Bill"]] = relationship(back_populates="patient")
    medical_records: Mapped[list["MedicalRecord"]] = relationship(back_populates="patient")
    vaccinations: Mapped[list["Vaccination"]] = relationship(back_populates="patient")
    timeline_events: Mapped[list["TimelineEvent"]] = relationship(back_populates="patient")
    emergency_cases: Mapped[list["EmergencyCase"]] = relationship(back_populates="patient")
