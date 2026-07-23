from typing import Optional, List
import uuid
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.user import User
from app.models.role import Role
from app.models.permission import Permission
from app.models.staff import StaffProfile
from app.models.patient import Patient
from app.models.emergency_contact import EmergencyContact
from app.models.audit_log import AuditLog

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where(User.id == user_id)
            .options(selectinload(User.role))
        )
        return result.scalars().first()

    async def get_by_username_or_email(self, identifier: str) -> Optional[User]:
        result = await self.db.execute(
            select(User)
            .where((User.username == identifier) | (User.email == identifier))
            .options(selectinload(User.role).selectinload(Role.permissions))
        )
        return result.scalars().first()

    async def get_role_by_name(self, name: str) -> Optional[Role]:
        result = await self.db.execute(
            select(Role)
            .where(Role.name == name)
        )
        return result.scalars().first()

    async def create_user(self, user: User) -> User:
        self.db.add(user)
        await self.db.flush()
        return user

    async def create_staff_profile(self, profile: StaffProfile) -> StaffProfile:
        self.db.add(profile)
        await self.db.flush()
        return profile

    async def create_patient(self, patient: Patient) -> Patient:
        self.db.add(patient)
        await self.db.flush()
        return patient

    async def save_audit_log(self, log: AuditLog) -> AuditLog:
        self.db.add(log)
        await self.db.flush()
        return log
