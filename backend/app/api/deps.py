import uuid
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.core.security import decode_token
from app.repositories.user import UserRepository
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_current_user(
    token: str = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decode_token(token)
    if not payload or payload.get("type") != "access":
        raise credentials_exception
    
    user_id_str: str = payload.get("sub")
    if not user_id_str:
        raise credentials_exception
        
    try:
        user_uuid = uuid.UUID(user_id_str)
    except ValueError:
        raise credentials_exception

    repo = UserRepository(db)
    user = await repo.get_by_id(user_uuid)
    if not user:
        raise credentials_exception
        
    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Inactive user account"
        )
        
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    return current_user

class PermissionChecker:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        # Require all permission checks if role has permission associated
        user_permissions = []
        if current_user.role and current_user.role.permissions:
            user_permissions = [p.name for p in current_user.role.permissions]
            
        # Super admin bypass
        if current_user.role and current_user.role.name in ["it-admin", "super-admin"]:
            return current_user

        if self.required_permission not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions to execute this action"
            )
        return current_user

class RoleChecker:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        if not current_user.role or current_user.role.name not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied: Role not authorized"
            )
        return current_user

# Repository Mappings
from app.repositories.patient import PatientRepository
from app.repositories.appointment import AppointmentRepository
from app.repositories.doctor import DoctorRepository
from app.repositories.pharmacy import PharmacyRepository
from app.repositories.laboratory import LaboratoryRepository
from app.repositories.billing import BillingRepository
from app.repositories.audit_log import AuditLogRepository

def get_patient_repo(db: AsyncSession = Depends(get_db)) -> PatientRepository:
    return PatientRepository(db)

def get_appointment_repo(db: AsyncSession = Depends(get_db)) -> AppointmentRepository:
    return AppointmentRepository(db)

def get_doctor_repo(db: AsyncSession = Depends(get_db)) -> DoctorRepository:
    return DoctorRepository(db)

def get_pharmacy_repo(db: AsyncSession = Depends(get_db)) -> PharmacyRepository:
    return PharmacyRepository(db)

def get_laboratory_repo(db: AsyncSession = Depends(get_db)) -> LaboratoryRepository:
    return LaboratoryRepository(db)

def get_billing_repo(db: AsyncSession = Depends(get_db)) -> BillingRepository:
    return BillingRepository(db)

def get_audit_log_repo(db: AsyncSession = Depends(get_db)) -> AuditLogRepository:
    return AuditLogRepository(db)

# Service Mappings
from app.services.patient import PatientService
from app.services.appointment import AppointmentService
from app.services.doctor import DoctorService
from app.services.pharmacy import PharmacyService
from app.services.laboratory import LaboratoryService
from app.services.billing import BillingService
from app.services.audit import AuditService

def get_patient_service(db: AsyncSession = Depends(get_db)) -> PatientService:
    return PatientService(db)

def get_appointment_service(db: AsyncSession = Depends(get_db)) -> AppointmentService:
    return AppointmentService(db)

def get_doctor_service(db: AsyncSession = Depends(get_db)) -> DoctorService:
    return DoctorService(db)

def get_pharmacy_service(db: AsyncSession = Depends(get_db)) -> PharmacyService:
    return PharmacyService(db)

def get_laboratory_service(db: AsyncSession = Depends(get_db)) -> LaboratoryService:
    return LaboratoryService(db)

def get_billing_service(db: AsyncSession = Depends(get_db)) -> BillingService:
    return BillingService(db)

def get_audit_service(db: AsyncSession = Depends(get_db)) -> AuditService:
    return AuditService(db)
