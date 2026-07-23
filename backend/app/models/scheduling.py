import uuid
from datetime import date, time
from typing import TYPE_CHECKING, Optional

from sqlalchemy import Boolean, Date, Time, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.doctor import Doctor


class Shift(AuditableModel):
    __tablename__ = "shifts"

    shift_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Morning, Evening, Night
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
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
        index=True,
    )

    user: Mapped["User"] = relationship(foreign_keys=[user_id])


class Leave(AuditableModel):
    __tablename__ = "leaves"

    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)
    leave_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Casual, Medical, Earned
    status: Mapped[str] = mapped_column(String(50), default="Pending", index=True)  # Pending, Approved, Rejected
    reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    approved_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    user: Mapped["User"] = relationship(foreign_keys=[user_id])
    approved_by: Mapped[Optional["User"]] = relationship(foreign_keys=[approved_by_id])


class Resource(AuditableModel):
    __tablename__ = "resources"

    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)  # Room, Machine, Equipment
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )


class DoctorSchedule(AuditableModel):
    __tablename__ = "doctor_schedules"

    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)  # 0 = Monday, 6 = Sunday
    start_time: Mapped[time] = mapped_column(Time, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, nullable=False)
    slot_duration_minutes: Mapped[int] = mapped_column(Integer, default=15, nullable=False)
    is_available: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("doctors.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    doctor: Mapped["Doctor"] = relationship()
