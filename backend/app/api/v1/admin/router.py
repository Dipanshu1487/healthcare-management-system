from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.user import StaffCreateRequest
from app.api.deps import get_current_active_user, RoleChecker
from app.repositories.user import UserRepository
from app.models.user import User
from app.models.staff import StaffProfile
from app.models.role import Role
from app.core.security import hash_password
from app.utils.responses import success_response
import uuid
import datetime

router = APIRouter(prefix="/admin", tags=["System Administration"])

@router.post("/staff", status_code=status.HTTP_201_CREATED)
async def create_staff(
    payload: StaffCreateRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(RoleChecker(["it-admin", "admin"]))
):
    repo = UserRepository(db)
    
    # Check if role exists
    role = await repo.get_role_by_name(payload.role_name)
    if not role:
        # Auto-create role if missing in dev/demo database config
        role = Role(name=payload.role_name, description=f"{payload.role_name} role")
        await repo.create_user(role)
        
    # Generate staff credentials
    username = f"{payload.name.lower().replace(' ', '')}"
    email = f"{username}@chcbharno.org"
    temp_password = "TemporaryPassword123!"
    
    user = User(
        username=username,
        email=email,
        hashed_password=hash_password(temp_password),
        role_id=role.id,
        status="active"
    )
    await repo.create_user(user)
    
    emp_id = f"EMP-{uuid.uuid4().hex[:6].upper()}"
    profile = StaffProfile(
        employee_id=emp_id,
        designation=payload.designation,
        joining_date=datetime.date.today(),
        status="active",
        user_id=user.id,
        department_id=uuid.uuid4() # Mock department link for prototype
    )
    await repo.create_staff_profile(profile)
    await db.commit()
    
    return success_response(
        data={
            "employee_id": emp_id,
            "username": username,
            "email": email,
            "temporary_password": temp_password
        },
        message="Staff account generated successfully"
    )

@router.get("/staff")
async def list_staff(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(RoleChecker(["it-admin", "admin"]))
):
    # Mock data return matching existing React layout
    return success_response(
        data=[
            {"id": "1", "name": "Dr. Priya Sharma", "role": "Doctor", "status": "active"},
            {"id": "2", "name": "Rajesh Kumar", "role": "Pharmacist", "status": "active"}
        ],
        message="Staff profiles retrieved"
    )
