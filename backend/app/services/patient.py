import random
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.patient import PatientRepository
from app.repositories.user import UserRepository
from app.services.audit import AuditService
from app.models.patient import Patient
from app.models.user import User
from app.core.security import hash_password
from app.core.exceptions import APIException
from app.schemas.user import PatientRegisterRequest

class PatientService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.patient_repo = PatientRepository(db)
        self.user_repo = UserRepository(db)
        self.audit_service = AuditService(db)

    async def register_patient(self, payload: PatientRegisterRequest) -> Patient:
        # Check Aadhaar collision
        existing_aadhaar = await self.patient_repo.get_by_aadhaar(payload.aadhaar)
        if existing_aadhaar:
            raise APIException(message="Aadhaar already registered with another patient record", status_code=400)

        # Check Username/Email collision
        existing_user = await self.user_repo.get_by_username_or_email(payload.username)
        if existing_user:
            raise APIException(message="Username already taken", status_code=400)
            
        existing_email = await self.user_repo.get_by_username_or_email(payload.email)
        if existing_email:
            raise APIException(message="Email address already registered", status_code=400)

        # Fetch Patient Role
        role = await self.user_repo.get_role_by_name("patient")
        if not role:
            raise APIException(message="Patient Role not configured in system", status_code=500)

        # 1. Create credential user
        user = User(
            username=payload.username,
            email=payload.email,
            hashed_password=hash_password(payload.password),
            role_id=role.id,
            status="active"
        )
        await self.user_repo.create_user(user)

        # 2. Generate UHID (Format: JHR-2026-XXXXX)
        random_suffix = "".join([str(random.randint(0, 9)) for _ in range(5)])
        uhid = f"JHR-2026-{random_suffix}"

        # 3. Create Patient
        patient = Patient(
            uhid=uhid,
            name=payload.name,
            gender=payload.gender,
            dob=payload.dob,
            age=payload.age,
            mobile=payload.mobile,
            aadhaar=payload.aadhaar,
            address=payload.address,
            district=payload.district,
            state=payload.state,
            status="active"
        )
        await self.patient_repo.create(patient)

        # 4. Save Audit log
        await self.audit_service.log_action(
            actor_role="Patient",
            actor_name=payload.username,
            action="PATIENT_SELF_REGISTER",
            entity_type="Patient",
            entity_id=str(patient.id),
            description=f"Self-registered patient {payload.name} with UHID: {uhid}"
        )

        await self.db.commit()
        return patient
