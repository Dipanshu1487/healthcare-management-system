import asyncio
from datetime import date

from sqlalchemy import select
from app.database.session import SessionLocal
from app.models.user import User
from app.models.role import Role
from app.models.department import Department
from app.models.staff import StaffProfile
from app.models.doctor import Doctor
from app.core.security import hash_password


SEEDED_STAFF = [
    {
        "email": "system.admin@chcbharno.in",
        "username": "system.admin",
        "name": "System Admin",
        "role": "System Administrator",
        "dept": "Information Technology",
        "designation": "IT Principal Architect",
        "password": "Temp@123"
    },
    {
        "email": "it.admin@chcbharno.in",
        "username": "it.admin",
        "name": "IT Admin",
        "role": "IT Administrator",
        "dept": "Information Technology",
        "designation": "IT Security Administrator",
        "password": "Temp@123"
    },
    {
        "email": "admin@chcbharno.in",
        "username": "admin",
        "name": "Hospital Admin",
        "role": "Hospital Administrator",
        "dept": "Administration",
        "designation": "Hospital Director",
        "password": "Temp@123"
    },
    {
        "email": "dr.priya@chcbharno.in",
        "username": "dr.priya",
        "name": "Dr. Priya Sharma",
        "role": "Doctor",
        "dept": "General Medicine",
        "designation": "Chief Medical Officer",
        "password": "Temp@123"
    },
    {
        "email": "reception01@chcbharno.in",
        "username": "reception01",
        "name": "Sunita Kumari",
        "role": "Receptionist",
        "dept": "Reception",
        "designation": "Front Desk Officer",
        "password": "Temp@123"
    },
    {
        "email": "lab.tech01@chcbharno.in",
        "username": "lab.tech01",
        "name": "Arvind Munda",
        "role": "Laboratory Technician",
        "dept": "Laboratory",
        "designation": "Lab Supervisor",
        "password": "Temp@123"
    },
    {
        "email": "pharmacy01@chcbharno.in",
        "username": "pharmacy01",
        "name": "Vikram Oraon",
        "role": "Pharmacist",
        "dept": "Pharmacy",
        "designation": "Store Pharmacist",
        "password": "Temp@12"
    },
    {
        "email": "nurse01@chcbharno.in",
        "username": "nurse01",
        "name": "Anjali Beck",
        "role": "Nurse",
        "dept": "General Medicine",
        "designation": "Senior Staff Nurse",
        "password": "Temp@12"
    },
    {
        "email": "suresh.oraon@example.com",
        "username": "suresh.oraon",
        "name": "Suresh Oraon",
        "role": "Patient",
        "dept": "Patient Care",
        "designation": "Registered Patient",
        "password": "Temp@12"
    }
]


async def seed_data():

    async with SessionLocal() as session:

        for staff in SEEDED_STAFF:

            # --------------------------------------------------
            # 1. Check / Create Department
            # --------------------------------------------------

            dept_res = await session.execute(
                select(Department).where(
                    Department.name == staff["dept"]
                )
            )

            dept = dept_res.scalars().first()

            if not dept:
                dept = Department(
                    name=staff["dept"]
                )

                session.add(dept)
                await session.flush()


            # --------------------------------------------------
            # 2. Check / Create Role
            # --------------------------------------------------

            role_res = await session.execute(
                select(Role).where(
                    Role.name == staff["role"]
                )
            )

            role = role_res.scalars().first()

            if not role:
                role = Role(
                    name=staff["role"],
                    description=f"Access role for {staff['role']}"
                )

                session.add(role)
                await session.flush()


            # --------------------------------------------------
            # 3. Check / Create User
            # --------------------------------------------------

            user_res = await session.execute(
                select(User).where(
                    User.email == staff["email"]
                )
            )

            user = user_res.scalars().first()

            if not user:

                hashed = hash_password(
                    staff["password"]
                )

                user = User(
                    username=staff["username"],
                    email=staff["email"],
                    hashed_password=hashed,
                    full_name=staff["name"],
                    status="active",
                    role_id=role.id
                )

                session.add(user)
                await session.flush()


            # --------------------------------------------------
            # 4. Create Staff Profile
            # --------------------------------------------------

            if staff["role"] != "Patient":

                profile_res = await session.execute(
                    select(StaffProfile).where(
                        StaffProfile.user_id == user.id
                    )
                )

                profile = profile_res.scalars().first()

                if not profile:

                    profile = StaffProfile(
                        user_id=user.id,
                        employee_id=(
                            f"EMP-{user.username.upper().replace('.', '-')}"
                        ),
                        joining_date=date.today(),
                        designation=staff["designation"],
                        department_id=dept.id,
                        status="active"
                    )

                    session.add(profile)
                    await session.flush()


                # --------------------------------------------------
                # 5. Create Doctor Profile
                # --------------------------------------------------

                if staff["role"] == "Doctor":

                    doctor_res = await session.execute(
                        select(Doctor).where(
                            Doctor.staff_profile_id == profile.id
                        )
                    )

                    doctor = doctor_res.scalars().first()

                    if not doctor:

                        doctor = Doctor(
                            name=staff["name"],
                            designation=staff["designation"],
                            qualification="MBBS, MD",
                            available=True,
                            status="active",
                            department_id=dept.id,
                            staff_profile_id=profile.id
                        )

                        session.add(doctor)
                        await session.flush()

                        print(
                            f"Doctor created: {staff['name']}"
                        )


        # --------------------------------------------------
        # 6. Commit Everything
        # --------------------------------------------------

        await session.commit()

        print(
            "Predefined staff accounts seeded successfully."
        )


if __name__ == "__main__":
    asyncio.run(seed_data())