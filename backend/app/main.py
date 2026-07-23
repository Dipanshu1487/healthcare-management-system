from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import setup_exception_handlers
from app.api.v1.api import api_router
from app.utils.responses import success_response
import logging

# Configure basic console logger for startup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("app")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Setup CORS
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Setup custom exception handler mappings
setup_exception_handlers(app)

# Include v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting up CHC Bharno HIS Backend Service...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down CHC Bharno HIS Backend Service...")

# Root route
@app.get("/", tags=["Root"])
async def root():
    return success_response(
        data={
            "app_name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "api_prefix": settings.API_V1_STR
        },
        message="CHC Bharno HIS REST API service is online."
    )

# Health Check route
@app.get("/health", tags=["Root"])
async def health_check():
    return success_response(
        data={"status": "healthy"},
        message="Backend is fully operational."
    )
