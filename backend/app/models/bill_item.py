import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.bill import Bill

class BillItem(AuditableModel):
    __tablename__ = "bill_items"

    item_name: Mapped[str] = mapped_column(String(150), nullable=False)
    cost: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    quantity: Mapped[int] = mapped_column(default=1, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    bill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("bills.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    bill: Mapped["Bill"] = relationship(back_populates="items")
