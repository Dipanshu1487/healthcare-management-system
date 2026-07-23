from typing import TYPE_CHECKING

from sqlalchemy import Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import Model
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.lab_order import LabOrder

class LabTest(Model):
    __tablename__ = "lab_tests"

    name: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    normal_range: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cost: Mapped[float] = mapped_column(Numeric(10, 2), default=0.00, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    orders: Mapped[list["LabOrder"]] = relationship(back_populates="test")
