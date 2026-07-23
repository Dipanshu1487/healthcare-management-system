import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, Index, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import LabOrderStatus, Priority

if TYPE_CHECKING:
    from app.models.doctor import Doctor
    from app.models.lab_report import LabReport
    from app.models.lab_test import LabTest
    from app.models.patient import Patient

class LabOrder(AuditableModel):
    __tablename__ = "lab_orders"
    __table_args__ = (
        Index("ix_lab_orders_status_priority", "status", "priority"),
    )

    sample_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    sample_type: Mapped[str] = mapped_column(String(50), nullable=False)
    priority: Mapped[str] = mapped_column(
        String(50),
        default=Priority.NORMAL,
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=LabOrderStatus.PENDING_COLLECTION,
        nullable=False,
        index=True,
    )
    collector_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    collection_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_time: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)

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
    test_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lab_tests.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="lab_orders")
    doctor: Mapped["Doctor"] = relationship(back_populates="lab_orders")
    test: Mapped["LabTest"] = relationship(back_populates="orders")
    reports: Mapped[list["LabReport"]] = relationship(
        back_populates="order",
        cascade="all, delete-orphan",
    )
