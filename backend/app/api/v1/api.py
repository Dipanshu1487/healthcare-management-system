from fastapi import APIRouter
from app.api.v1.auth.router import router as auth_router
from app.api.v1.admin.router import router as admin_router
from app.api.v1.patients.router import router as patients_router
from app.api.v1.doctors.router import router as doctors_router
from app.api.v1.appointments.router import router as appointments_router
from app.api.v1.laboratory.router import router as laboratory_router
from app.api.v1.pharmacy.router import router as pharmacy_router
from app.api.v1.billing.router import router as billing_router
from app.api.v1.dashboard.router import router as dashboard_router
from app.api.v1.notifications.router import router as notifications_router
from app.api.v1.audit.router import router as audit_router
from app.api.v1.documents.router import router as documents_router
from app.api.v1.ai.router import router as ai_router
from app.api.v1.analytics.router import router as analytics_router
from app.api.v1.schedules.router import router as schedules_router
from app.api.v1.admin.ops import router as ops_router

api_router = APIRouter()

# Register all modules
api_router.include_router(auth_router)
api_router.include_router(admin_router)
api_router.include_router(patients_router)
api_router.include_router(doctors_router)
api_router.include_router(appointments_router)
api_router.include_router(laboratory_router)
api_router.include_router(pharmacy_router)
api_router.include_router(billing_router)
api_router.include_router(dashboard_router)
api_router.include_router(notifications_router)
api_router.include_router(audit_router)
api_router.include_router(documents_router)
api_router.include_router(ai_router)
api_router.include_router(analytics_router)
api_router.include_router(schedules_router)
api_router.include_router(ops_router)
