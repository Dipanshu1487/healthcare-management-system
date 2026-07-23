import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, Index, Integer, Numeric, String, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import InventoryStatus

if TYPE_CHECKING:
    from app.models.inventory_transaction import InventoryTransaction
    from app.models.medicine import Medicine
    from app.models.supplier import Supplier

class Inventory(AuditableModel):
    __tablename__ = "inventory"
    __table_args__ = (
        UniqueConstraint("medicine_id", "batch_no", name="uq_inventory_medicine_batch"),
        Index("ix_inventory_expiry_status", "expiry_date", "status"),
    )

    batch_no: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    quantity: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    unit: Mapped[str] = mapped_column(String(50), nullable=False)
    mrp: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    purchase_price: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=InventoryStatus.OPTIMAL,
        nullable=False,
        index=True,
    )

    medicine_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("medicines.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    supplier_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    medicine: Mapped["Medicine"] = relationship(back_populates="inventories")
    supplier: Mapped["Supplier | None"] = relationship(back_populates="inventories")
    transactions: Mapped[list["InventoryTransaction"]] = relationship(
        back_populates="inventory",
    )
