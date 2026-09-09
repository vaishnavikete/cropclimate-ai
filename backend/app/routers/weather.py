from fastapi import APIRouter, Query
from app.schemas.all_schemas import WeatherAnalysisResponse
from app.services.weather_service import WeatherService

router = APIRouter(prefix="/weather", tags=["Weather Risk Engine"])

@router.get("", response_model=WeatherAnalysisResponse)
def get_weather_analysis(
    lat: float = Query(18.5204, description="Latitude"),
    lon: float = Query(73.8567, description="Longitude"),
    location: str = Query("Pune, Maharashtra", description="Location name")
):
    """
    Returns current weather, 7-day forecast, heat risk, drought risk,
    rainfall risk, and composite weather risk score.
    """
    return WeatherService.get_weather(latitude=lat, longitude=lon, location_name=location)
