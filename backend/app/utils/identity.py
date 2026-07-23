import re
import string
import secrets
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User

DOMAIN = "chcbharno.in"

def generate_temp_password(length: int = 10) -> str:
    """Generates a secure temporary password with digits, letters, and select punctuation."""
    chars = string.ascii_letters + string.digits + "@#$%"
    return "HIS@" + "".join(secrets.choice(chars) for _ in range(length - 4))


async def generate_official_email(
    db: AsyncSession,
    full_name: str,
    role_name: str
) -> str:
    """Generates a clean lowercase email: role.firstname.lastname@chcbharno.in"""
    # Sanitize names (keep alphanumeric only)
    role_part = re.sub(r'[^a-zA-Z0-9]', '', role_name.lower())
    
    name_parts = [re.sub(r'[^a-zA-Z0-9]', '', p.lower()) for p in full_name.split() if p]
    if len(name_parts) >= 2:
        firstname = name_parts[0]
        lastname = name_parts[-1]
        base_email = f"{role_part}.{firstname}.{lastname}"
    elif len(name_parts) == 1:
        base_email = f"{role_part}.{name_parts[0]}"
    else:
        base_email = f"{role_part}.staff"
        
    candidate = f"{base_email}@{DOMAIN}"
    
    # Check duplicate in database
    suffix = 1
    while True:
        stmt = select(User).where(User.email == candidate)
        res = await db.execute(stmt)
        existing = res.scalars().first()
        if not existing:
            return candidate
        
        suffix += 1
        candidate = f"{base_email}{suffix}@{DOMAIN}"
