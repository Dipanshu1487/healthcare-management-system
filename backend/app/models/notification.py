import uuid
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base_class import Base

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    target_role: Mapped[str] = mapped_column(String(50), default="All", nullable=False) # admin, doctor, pharmacist, etc., or All
    title: Mapped[str] = mapped_column(String(100), nullable=False)
    message: Mapped[str] = mapped_column(String(255), nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notification_type: Mapped[str] = mapped_column(String(50), default="info", nullable=False) # info, alert, warning
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
