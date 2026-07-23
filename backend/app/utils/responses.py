from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class APIResponse(BaseModel, Generic[T]):
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[Any] = None

def success_response(
    data: Optional[Any] = None, 
    message: str = "Operation successful"
) -> dict:
    return {
        "success": True,
        "message": message,
        "data": data,
        "errors": None
    }

def error_response(
    message: str = "An error occurred", 
    errors: Optional[Any] = None
) -> dict:
    return {
        "success": False,
        "message": message,
        "data": None,
        "errors": errors
    }
