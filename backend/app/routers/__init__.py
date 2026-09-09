from app.routers.health import router as health_router
from app.routers.farm import router as farm_router
from app.routers.weather import router as weather_router
from app.routers.satellite import router as satellite_router
from app.routers.recommendations import router as recommendations_router
from app.routers.ai_chat import router as ai_chat_router

__all__ = [
    "health_router",
    "farm_router",
    "weather_router",
    "satellite_router",
    "recommendations_router",
    "ai_chat_router"
]
