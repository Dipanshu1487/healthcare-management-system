import uuid
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import DeviceStatus, RecordStatus

if TYPE_CHECKING:
    from app.models.staff import StaffProfile

class HospitalDevice(AuditableModel):
    __tablename__ = "hospital_devices"

    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    location: Mapped[str] = mapped_column(String(150), nullable=False)
    device_status: Mapped[str] = mapped_column(
        String(50),
        default=DeviceStatus.ONLINE,
        nullable=False,
        index=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    assigned_to_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("staff_profiles.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )

    assigned_to: Mapped["StaffProfile | None"] = relationship()
