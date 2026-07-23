import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.medicine import Medicine
    from app.models.prescription import Prescription

class PrescriptionItem(AuditableModel):
    __tablename__ = "prescription_items"

    strength: Mapped[str] = mapped_column(String(50), nullable=False)
    dosage: Mapped[str] = mapped_column(String(100), nullable=False)
    frequency: Mapped[str] = mapped_column(String(100), nullable=False)
    duration: Mapped[str] = mapped_column(String(100), nullable=False)
    qty_needed: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    prescription_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("prescriptions.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    medicine_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("medicines.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    prescription: Mapped["Prescription"] = relationship(back_populates="items")
    medicine: Mapped["Medicine"] = relationship(back_populates="prescription_items")
