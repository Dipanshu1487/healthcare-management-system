from typing import Any
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.utils.responses import error_response

class APIException(Exception):
    def __init__(
        self, 
        message: str, 
        status_code: int = status.HTTP_400_BAD_REQUEST, 
        errors: Any = None
    ):
        self.message = message
        self.status_code = status_code
        self.errors = errors
        super().__init__(message)

def setup_exception_handlers(app: FastAPI) -> None:
    # Handle custom API exceptions
    @app.exception_handler(APIException)
    async def api_exception_handler(request: Request, exc: APIException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(message=exc.message, errors=exc.errors)
        )

    # Handle Starlette/FastAPI HTTPExceptions
    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=error_response(message=exc.detail, errors=None)
        )

    # Handle Request Validation Errors (Pydantic / FastAPI query params)
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        formatted_errors = []
        for error in exc.errors():
            formatted_errors.append({
                "field": ".".join(map(str, error.get("loc", []))),
                "type": error.get("type", "unknown"),
                "msg": error.get("msg", "Validation error")
            })
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=error_response(
                message="Validation failed", 
                errors=formatted_errors
            )
        )

    # Handle all other uncaught exceptions
    @app.exception_handler(Exception)
    async def uncaught_exception_handler(request: Request, exc: Exception):
        # In a real environment, we'd log the stack trace using app logger
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=error_response(
                message="An unexpected server error occurred",
                errors=str(exc) if app.debug else None
            )
        )
