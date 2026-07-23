from typing import TYPE_CHECKING

from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import Model
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.inventory import Inventory
    from app.models.prescription_item import PrescriptionItem

class Medicine(Model):
    __tablename__ = "medicines"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    manufacturer: Mapped[str | None] = mapped_column(String(150), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    prescription_items: Mapped[list["PrescriptionItem"]] = relationship(
        back_populates="medicine",
    )
    inventories: Mapped[list["Inventory"]] = relationship(back_populates="medicine")
