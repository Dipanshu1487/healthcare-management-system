import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import InventoryTransactionType, RecordStatus

if TYPE_CHECKING:
    from app.models.inventory import Inventory

class InventoryTransaction(AuditableModel):
    __tablename__ = "inventory_transactions"

    transaction_type: Mapped[str] = mapped_column(
        String(50),
        default=InventoryTransactionType.DISPENSE,
        nullable=False,
        index=True,
    )
    reference_id: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    details: Mapped[str] = mapped_column(String(255), nullable=False)
    quantity_delta: Mapped[int] = mapped_column(nullable=False)
    amount: Mapped[float | None] = mapped_column(Numeric(10, 2), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    inventory_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("inventory.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    inventory: Mapped["Inventory"] = relationship(back_populates="transactions")
