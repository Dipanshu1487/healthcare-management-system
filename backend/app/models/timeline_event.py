import uuid
from datetime import date
from typing import TYPE_CHECKING

from sqlalchemy import Date, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base_class import AuditableModel
from app.models.enums import RecordStatus, TimelineEventType

if TYPE_CHECKING:
    from app.models.patient import Patient

class TimelineEvent(AuditableModel):
    __tablename__ = "timeline_events"

    event_date: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    event_time: Mapped[str | None] = mapped_column(String(20), nullable=True)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    event_type: Mapped[str] = mapped_column(
        String(50),
        default=TimelineEventType.VISIT,
        nullable=False,
        index=True,
    )
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    status: Mapped[str] = mapped_column(
        String(50),
        default=RecordStatus.ACTIVE,
        nullable=False,
        index=True,
    )

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    patient: Mapped["Patient"] = relationship(back_populates="timeline_events")
