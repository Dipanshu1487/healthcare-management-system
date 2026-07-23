import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.appointment import Appointment
    from app.models.department import Department
    from app.models.lab_order import LabOrder
    from app.models.medical_record import MedicalRecord
    from app.models.prescription import Prescription
    from app.models.staff import StaffProfile
    from app.models.vaccination import Vaccination

class Doctor(AuditableModel):
    __tablename__ = "doctors"

    name: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    qualification: Mapped[str] = mapped_column(String(100), nullable=False)
    available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    staff_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("staff_profiles.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    department: Mapped["Department"] = relationship(back_populates="doctors")
    staff_profile: Mapped["StaffProfile"] = relationship(back_populates="doctors")
    appointments: Mapped[list["Appointment"]] = relationship(back_populates="doctor")
    prescriptions: Mapped[list["Prescription"]] = relationship(back_populates="doctor")
    lab_orders: Mapped[list["LabOrder"]] = relationship(back_populates="doctor")
    medical_records: Mapped[list["MedicalRecord"]] = relationship(back_populates="doctor")
    vaccinations: Mapped[list["Vaccination"]] = relationship(back_populates="administered_by_doctor")
