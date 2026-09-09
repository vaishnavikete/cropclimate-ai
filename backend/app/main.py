from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.config import settings
from app.database import Base, engine
from app.models import all_models  # Ensures models are imported for metadata
from app.routers import (
    health_router,
    farm_router,
    weather_router,
    satellite_router,
    recommendations_router,
    ai_chat_router
)

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("cropclimate")

# Initialize FastAPI App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Climate-Smart Farming Decision-Support System. Integrates Crop + Soil + Weather + Satellite Imagery → Risk Prediction → Explainable AI Recommendations.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create Database Tables on Startup
@app.on_event("startup")
def on_startup():
    logger.info("Initializing CropClimate database tables...")
    Base.metadata.create_all(bind=engine)
    logger.info("CropClimate database tables ready.")

# Global Friendly Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Error handling request to {request.url.path}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": "Live agricultural analytics service encountered an unexpected condition. Operating with resilient offline fallbacks.",
            "detail": str(exc) if settings.DEBUG else "Internal server error"
        }
    )

# Register Routers
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(farm_router, prefix=settings.API_V1_STR)
app.include_router(weather_router, prefix=settings.API_V1_STR)
app.include_router(satellite_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(ai_chat_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "tagline": settings.TAGLINE,
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }
