from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends, status, HTTPException

from app.database.session import get_db
from app.schemas.user import StaffCreateRequest
from app.api.deps import RoleChecker
from app.repositories.user import UserRepository
from app.models.user import User
from app.models.staff import StaffProfile
from app.models.role import Role
from app.models.department import Department
from app.core.security import hash_password
from app.utils.responses import success_response

import uuid
import datetime


router = APIRouter(
    prefix="/admin",
    tags=["System Administration"]
)


# ============================================================
# CREATE STAFF
# ============================================================

@router.post(
    "/staff",
    status_code=status.HTTP_201_CREATED
)
async def create_staff(
    payload: StaffCreateRequest,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(
        RoleChecker([
            "Hospital Administrator",
            "System Administrator",
            "IT Administrator"
        ])
    )
):
    repo = UserRepository(db)

    # --------------------------------------------------------
    # 1. Find or create role
    # --------------------------------------------------------

    role = await repo.get_role_by_name(payload.role_name)

    if not role:
        role = Role(
            name=payload.role_name,
            description=f"Access role for {payload.role_name}"
        )

        db.add(role)
        await db.flush()

    # --------------------------------------------------------
    # 2. Find or create department
    # --------------------------------------------------------

    result = await db.execute(
        select(Department).where(
            Department.name == payload.department_name
        )
    )

    department = result.scalars().first()

    if not department:
        department = Department(
            name=payload.department_name
        )

        db.add(department)
        await db.flush()

    # --------------------------------------------------------
    # 3. Generate username and email
    # --------------------------------------------------------

    username = payload.name.lower().replace(" ", "")
    email = f"{username}@chcbharno.in"

    temp_password = "TemporaryPassword123!"

    # --------------------------------------------------------
    # 4. Check if user already exists
    # --------------------------------------------------------

    existing_user = await repo.get_by_username_or_email(email)

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email already exists"
        )
    # --------------------------------------------------------
    # 5. Create User
    # --------------------------------------------------------

    user = User(
        username=username,
        email=email,
        full_name=payload.name,
        hashed_password=hash_password(temp_password),
        role_id=role.id,
        status="active"
    )

    await repo.create_user(user)

    # --------------------------------------------------------
    # 6. Create Staff Profile
    # --------------------------------------------------------

    emp_id = f"EMP-{uuid.uuid4().hex[:6].upper()}"

    profile = StaffProfile(
        employee_id=emp_id,
        designation=payload.designation,
        joining_date=datetime.date.today(),
        status="active",
        user_id=user.id,
        department_id=department.id
    )

    await repo.create_staff_profile(profile)

    # --------------------------------------------------------
    # 7. Commit to Render PostgreSQL
    # --------------------------------------------------------

    await db.commit()

    return success_response(
        data={
            "employee_id": emp_id,
            "username": username,
            "email": email,
            "temporary_password": temp_password,
            "role": role.name,
            "department": department.name
        },
        message="Staff account generated successfully"
    )


# ============================================================
# LIST STAFF
# ============================================================

@router.get("/staff")
async def list_staff(
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(
        RoleChecker([
            "Hospital Administrator",
            "System Administrator",
            "IT Administrator"
        ])
    )
):

    result = await db.execute(
        select(User, StaffProfile, Role, Department)
        .join(StaffProfile, StaffProfile.user_id == User.id)
        .join(Role, Role.id == User.role_id)
        .join(
            Department,
            Department.id == StaffProfile.department_id
        )
    )

    rows = result.all()

    staff = []

    for user, profile, role, department in rows:

        staff.append({
            "id": str(user.id),
            "name": user.full_name,
            "username": user.username,
            "email": user.email,
            "employee_id": profile.employee_id,
            "role": role.name,
            "designation": profile.designation,
            "department": department.name,
            "status": user.status
        })

    return success_response(
        data=staff,
        message="Staff profiles retrieved successfully"
    )