import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import BillStatus

if TYPE_CHECKING:
    from app.models.bill_item import BillItem
    from app.models.patient import Patient
    from app.models.payment import Payment

class Bill(AuditableModel):
    __tablename__ = "bills"

    invoice_no: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    bill_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    total_amount: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=BillStatus.PENDING,
        nullable=False,
        index=True,
    )
    payment_method: Mapped[str | None] = mapped_column(String(100), nullable=True)

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="bills")
    items: Mapped[list["BillItem"]] = relationship(
        back_populates="bill",
        cascade="all, delete-orphan",
    )
    payments: Mapped[list["Payment"]] = relationship(
        back_populates="bill",
        cascade="all, delete-orphan",
    )
