import uuid
from sqlalchemy import String, ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base_class import Base

class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    amount: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False) # UPI, Cash, Card, Scheme
    transaction_ref: Mapped[str] = mapped_column(String(100), nullable=True, unique=True, index=True)
    status: Mapped[str] = mapped_column(String(50), default="Completed", nullable=False) # Completed, Failed, Refunded

    bill_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("bills.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    bill: Mapped["Bill"] = relationship(back_populates="payments")
