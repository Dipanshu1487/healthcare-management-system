import uuid
from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import Optional

class UserOut(BaseModel):
    id: uuid.UUID
    username: str
    email: EmailStr
    status: str
    role_name: str

    class Config:
        from_attributes = True

class StaffCreateRequest(BaseModel):
    name: str = Field(..., min_length=2)
    role_name: str # doctor, reception, lab, pharmacy, admin, it-admin
    department_name: str
    designation: str

class PatientRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str = Field(..., min_length=8)
    name: str
    gender: str
    dob: date
    age: int
    mobile: str
    aadhaar: str
    address: str
    district: str
    state: str
