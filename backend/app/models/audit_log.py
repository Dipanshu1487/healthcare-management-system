import uuid
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base_class import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    actor_role: Mapped[str] = mapped_column(String(50), nullable=False)
    actor_name: Mapped[str] = mapped_column(String(100), nullable=False)
    action: Mapped[str] = mapped_column(String(100), nullable=False) # e.g. PATIENT_REGISTERED, MEDICINE_DISPENSED
    entity_type: Mapped[str] = mapped_column(String(50), nullable=False) # e.g. Patient, Appointment, LabOrder
    entity_id: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="active", nullable=False)
