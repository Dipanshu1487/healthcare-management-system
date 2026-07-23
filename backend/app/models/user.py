import uuid
from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import Model
from app.models.enums import RecordStatus

if TYPE_CHECKING:
    from app.models.role import Role
    from app.models.staff import StaffProfile
    from app.models.user_session import UserSession

class User(Model):
    __tablename__ = "users"

    username: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("roles.id", ondelete="RESTRICT"),
        nullable=False,
        index=True,
    )
    created_by_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    role: Mapped["Role"] = relationship(back_populates="users")
    staff_profile: Mapped[Optional["StaffProfile"]] = relationship(
        back_populates="user",
        uselist=False,
        foreign_keys="[StaffProfile.user_id]"
    )
    sessions: Mapped[list["UserSession"]] = relationship(back_populates="user")
    created_by: Mapped[Optional["User"]] = relationship(
        remote_side="User.id",
        foreign_keys=[created_by_id],
    )
