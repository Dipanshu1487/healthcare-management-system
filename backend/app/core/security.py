import jwt
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional, Union
from pwdlib import PasswordHash
from app.core.config import settings

# Initialize password hash engine (prefers Argon2 if installed, which pwdlib[argon2] includes)
password_hash = PasswordHash.recommended()

ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    """Hash plaintext password using recommended Argon2 protocol."""
    return password_hash.hash(password)

def verify_password(password: str, hashed_password: str) -> bool:
    """Verify password match against hashed credentials."""
    return password_hash.verify(password, hashed_password)

def create_access_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """Generate JWT Access Token for authenticated user."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {"exp": expire, "sub": str(subject), "type": "access"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(
    subject: Union[str, Any], 
    expires_delta: Optional[timedelta] = None
) -> str:
    """Generate JWT Refresh Token for session extension."""
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=30)
    to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[Dict[str, Any]]:
    """Decode JWT token verifying signature and expiration constraints."""
    try:
        decoded_payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        return decoded_payload
    except jwt.PyJWTError:
        return None
