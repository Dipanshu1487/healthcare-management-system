from typing import Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user import UserRepository
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.core.exceptions import APIException
from app.models.user import User
from app.models.audit_log import AuditLog
from app.schemas.auth import LoginRequest, TokenResponse

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)

    async def authenticate_user(self, payload: LoginRequest) -> TokenResponse:
        user = await self.repo.get_by_username_or_email(payload.username)
        if not user or not verify_password(payload.password, user.hashed_password):
            # Create failed login audit record
            audit = AuditLog(
                actor_role="Anonymous",
                actor_name=payload.username,
                action="FAILED_LOGIN",
                entity_type="User",
                entity_id="N/A",
                description=f"Failed login attempt for user: {payload.username}"
            )
            await self.repo.save_audit_log(audit)
            await self.db.commit()
            raise APIException(message="Incorrect username/email or password", status_code=401)

        if user.status != "active":
            raise APIException(message="Account is deactivated", status_code=403)

        # Successful login log
        audit = AuditLog(
            actor_role=user.role.name if user.role else "User",
            actor_name=user.username,
            action="LOGIN_SUCCESS",
            entity_type="User",
            entity_id=str(user.id),
            description="User logged in successfully"
        )
        await self.repo.save_audit_log(audit)
        await self.db.commit()

        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    async def rotate_tokens(self, refresh_token: str) -> TokenResponse:
        payload = decode_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            raise APIException(message="Invalid or expired refresh token", status_code=401)

        user_id_str = payload.get("sub")
        user = await self.repo.get_by_id(user_id_str)
        if not user or user.status != "active":
            raise APIException(message="Invalid session credentials", status_code=401)

        return TokenResponse(
            access_token=create_access_token(user.id),
            refresh_token=create_refresh_token(user.id)
        )
