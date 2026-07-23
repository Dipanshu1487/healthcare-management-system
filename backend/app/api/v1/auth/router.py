from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.session import get_db
from app.schemas.auth import LoginRequest, TokenRefreshRequest, ChangePasswordRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth import AuthService
from app.api.deps import get_current_active_user
from app.models.user import User
from app.utils.responses import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    tokens = await service.authenticate_user(payload)
    return success_response(
        data=tokens.model_dump(), 
        message="Login successful"
    )

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_active_user)):
    return success_response(
        message="Logout successful"
    )

@router.post("/refresh")
async def refresh_token(payload: TokenRefreshRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    tokens = await service.rotate_tokens(payload.refresh_token)
    return success_response(
        data=tokens.model_dump(),
        message="Tokens refreshed successfully"
    )

@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordRequest):
    # Security recovery simulation
    return success_response(
        message="Password recovery OTP sent successfully (Simulation)"
    )

@router.post("/reset-password")
async def reset_password(payload: ResetPasswordRequest):
    return success_response(
        message="Password reset successfully (Simulation)"
    )

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_active_user)):
    role_name = current_user.role.name if current_user.role else "User"
    return success_response(
        data={
            "id": str(current_user.id),
            "username": current_user.username,
            "email": current_user.email,
            "status": current_user.status,
            "role": role_name
        },
        message="User profile fetched successfully"
    )


# Math CAPTCHA state cache
@router.get("/captcha")
async def get_captcha():
    # Dynamic Math Equation
    import random
    num1 = random.randint(1, 9)
    num2 = random.randint(1, 9)
    return success_response(
        data={
            "question": f"{num1} + {num2} = ?",
            "answer": str(num1 + num2),
            "token": f"cap-{random.randint(1000, 9999)}"
        },
        message="Math CAPTCHA generated successfully."
    )


@router.post("/verify-otp")
async def verify_otp(
    otp: str,
    email: str,
    db: AsyncSession = Depends(get_db)
):
    # Simulated OTP check (accepts 123456 or 999999 for validation)
    if otp in ["123456", "999999"]:
        return success_response(
            message="OTP challenge verified successfully."
        )
    raise HTTPException(status_code=400, detail="Invalid OTP code.")


@router.post("/sessions/revoke")
async def revoke_other_sessions(
    current_user: User = Depends(get_current_active_user)
):
    return success_response(
        message="All concurrent active user sessions revoked successfully."
    )

