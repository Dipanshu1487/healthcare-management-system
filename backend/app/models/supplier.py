from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import Model
from app.models.enums import RecordStatus, SupplierDeliveryStatus

if TYPE_CHECKING:
    from app.models.inventory import Inventory

class Supplier(Model):
    __tablename__ = "suppliers"

    name: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    contact_phone: Mapped[str | None] = mapped_column(String(20), nullable=True)
    contact_email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    address: Mapped[str | None] = mapped_column(String(255), nullable=True)
    pending_orders: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    next_delivery_date: Mapped[date | None] = mapped_column(Date, nullable=True)
    delivery_status: Mapped[str] = mapped_column(
        String(50),
        default=SupplierDeliveryStatus.SCHEDULED,
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    inventories: Mapped[list["Inventory"]] = relationship(back_populates="supplier")
