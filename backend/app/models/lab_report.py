import uuid
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import LabReportStatus

if TYPE_CHECKING:
    from app.models.lab_order import LabOrder

class LabReport(AuditableModel):
    __tablename__ = "lab_reports"

    result_value: Mapped[str] = mapped_column(String(255), nullable=False)
    normal_range: Mapped[str | None] = mapped_column(String(100), nullable=True)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)
    technician_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    findings: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_critical: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    critical_finding: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=LabReportStatus.PENDING_REVIEW,
        nullable=False,
        index=True,
    )

    order_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("lab_orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    order: Mapped["LabOrder"] = relationship(back_populates="reports")
