import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.department import Department
    from app.models.doctor import Doctor
    from app.models.user import User

class StaffProfile(AuditableModel):
    __tablename__ = "staff_profiles"

    employee_id: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    designation: Mapped[str] = mapped_column(String(100), nullable=False)
    joining_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )
    department_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("departments.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )

    user: Mapped["User"] = relationship(back_populates="staff_profile", foreign_keys=[user_id])
    department: Mapped["Department"] = relationship(back_populates="staff_profiles")
    doctors: Mapped[list["Doctor"]] = relationship(back_populates="staff_profile")
