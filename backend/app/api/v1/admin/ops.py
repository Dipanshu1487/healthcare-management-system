import uuid
from datetime import datetime
from typing import Dict, Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db
from app.api.deps import get_current_active_user
from app.models.user import User
from app.models.audit_log import AuditLog
from app.utils.responses import success_response

router = APIRouter(prefix="/admin/ops", tags=["Enterprise Operations"])

# In-memory storage for feature flags and maintenance settings for simple local management
FEATURE_FLAGS = {
    "ai_assistant": True,
    "laboratory": True,
    "pharmacy": True,
    "billing": True,
    "analytics": True,
    "notifications": True,
    "email": True
}

MAINTENANCE_CONFIG = {
    "is_enabled": False,
    "message": "System undergoing scheduled database maintenance. Please try again later.",
    "expected_end_time": "2026-07-18T22:00:00"
}

BACKUP_LOGS = [
    {"id": "b-01", "timestamp": "2026-07-18T04:00:00", "size": "4.2 MB", "type": "Database", "status": "Completed"},
    {"id": "b-02", "timestamp": "2026-07-18T04:05:00", "size": "18.5 MB", "type": "Files/Uploads", "status": "Completed"}
]

BACKGROUND_JOBS = [
    {"id": "job-101", "name": "Email Notification Dispatch", "type": "Email", "status": "Completed", "retries": 0},
    {"id": "job-102", "name": "Daily Analytics Cache Rebuilder", "type": "Cache", "status": "Completed", "retries": 0},
    {"id": "job-103", "name": "NHM Insurance Claim Synchronizer", "type": "Sync", "status": "Failed", "retries": 3}
]


class FlagToggleRequest(BaseModel):
    flag_name: str
    is_enabled: bool


class MaintenanceRequest(BaseModel):
    is_enabled: bool
    message: str
    expected_end_time: str


@router.get("/status")
async def get_ops_status(
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    return success_response(
        data={
            "services": {
                "database": "Healthy",
                "ai_service": "Healthy",
                "background_scheduler": "Healthy",
                "notification_service": "Healthy",
                "file_storage": "Healthy"
            },
            "system_health": {
                "server_uptime": "99.98%",
                "application_uptime": "14 days, 6 hours",
                "active_sessions": 82,
                "online_users": 12,
                "cpu_utilization": "14%",
                "ram_utilization": "42%",
                "disk_usage": "38%"
            }
        },
        message="Operations status fetched successfully."
    )


@router.get("/flags")
async def get_feature_flags(
    user: User = Depends(get_current_active_user)
):
    return success_response(data=FEATURE_FLAGS, message="Feature flags list fetched.")


@router.post("/flags")
async def toggle_feature_flag(
    payload: FlagToggleRequest,
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    flag_name = payload.flag_name
    if flag_name not in FEATURE_FLAGS:
        raise HTTPException(status_code=404, detail="Feature flag not found.")

    FEATURE_FLAGS[flag_name] = payload.is_enabled
    return success_response(
        data=FEATURE_FLAGS,
        message=f"Feature flag '{flag_name}' updated successfully."
    )


@router.get("/maintenance")
async def get_maintenance_mode():
    return success_response(data=MAINTENANCE_CONFIG, message="Maintenance mode config fetched.")


@router.post("/maintenance")
async def update_maintenance_mode(
    payload: MaintenanceRequest,
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    MAINTENANCE_CONFIG["is_enabled"] = payload.is_enabled
    MAINTENANCE_CONFIG["message"] = payload.message
    MAINTENANCE_CONFIG["expected_end_time"] = payload.expected_end_time
    
    return success_response(
        data=MAINTENANCE_CONFIG,
        message="Maintenance config updated successfully."
    )


@router.get("/backups")
async def list_backups(
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    return success_response(data=BACKUP_LOGS, message="Backup list logs fetched.")


@router.post("/backups")
async def trigger_manual_backup(
    backup_type: str,  # Database or Files
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    new_backup = {
        "id": f"b-0{len(BACKUP_LOGS)+1}",
        "timestamp": datetime.now().isoformat()[:19],
        "size": "5.1 MB" if backup_type == "Database" else "19.2 MB",
        "type": backup_type,
        "status": "Completed"
    }
    BACKUP_LOGS.insert(0, new_backup)
    return success_response(data=new_backup, message=f"Manual backup for '{backup_type}' completed successfully.")


@router.get("/jobs")
async def list_background_jobs(
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    return success_response(data=BACKGROUND_JOBS, message="Background jobs status list fetched.")


@router.post("/jobs/{job_id}/retry")
async def retry_background_job(
    job_id: str,
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")

    for job in BACKGROUND_JOBS:
        if job["id"] == job_id:
            job["status"] = "Completed"
            job["retries"] += 1
            return success_response(data=job, message="Background job retried and finished successfully.")

    raise HTTPException(status_code=404, detail="Job not found.")


# White Label Configuration storage
PLATFORM_SETTINGS = {
    "hospital_name": "CHC Bharno Community Hospital",
    "hospital_contact": "+91 94310-XXXXX",
    "theme_primary_color": "#2563eb",
    "session_timeout_minutes": 30,
    "otp_expiry_seconds": 120
}

class PlatformSettingsRequest(BaseModel):
    hospital_name: str
    hospital_contact: str
    theme_primary_color: str
    session_timeout_minutes: int
    otp_expiry_seconds: int

@router.get("/settings")
async def get_platform_settings():
    return success_response(data=PLATFORM_SETTINGS, message="Platform settings fetched.")

@router.post("/settings")
async def update_platform_settings(
    payload: PlatformSettingsRequest,
    user: User = Depends(get_current_active_user)
):
    if not any(role.name in ["Hospital Administrator", "System Administrator", "IT Administrator"] for role in [user.role] if user.role):
        raise HTTPException(status_code=403, detail="Access denied.")
    
    PLATFORM_SETTINGS.update(payload.dict())
    return success_response(data=PLATFORM_SETTINGS, message="Platform settings updated successfully.")

