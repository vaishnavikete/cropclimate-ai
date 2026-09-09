from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import datetime

class HealthCheckResponse(BaseModel):
    status: str
    project: str
    tagline: str
    version: str
    database: str
    timestamp: datetime.datetime

# Farm Input Schema
class FarmInputSchema(BaseModel):
    location_name: str = Field(default="Pune, Maharashtra", description="Village or district name")
    state: str = Field(default="Maharashtra", description="Indian State")
    district: str = Field(default="Pune", description="District")
    latitude: Optional[float] = Field(default=18.5204)
    longitude: Optional[float] = Field(default=73.8567)
    crop_name: str = Field(default="Soybean", description="Crop under cultivation")
    soil_type: str = Field(default="Black Soil (Regur)", description="Type of soil")
    soil_moisture_pct: float = Field(ge=0, le=100, default=25.0, description="Volumetric soil moisture %")
    soil_ph: float = Field(ge=3.0, le=11.0, default=6.8, description="Soil pH value")
    soil_n: Optional[float] = Field(default=None, description="Available Nitrogen in kg/ha (Optional)")
    soil_p: Optional[float] = Field(default=None, description="Available Phosphorus in kg/ha (Optional)")
    soil_k: Optional[float] = Field(default=None, description="Available Potassium in kg/ha (Optional)")
    temperature_c: float = Field(ge=-10, le=60, default=36.5, description="Current ambient temperature in °C")
    humidity_pct: float = Field(ge=0, le=100, default=45.0, description="Relative humidity %")
    rainfall_mm: float = Field(ge=0, le=500, default=2.0, description="Recent 24h rainfall in mm")
    forecast_rainfall_mm: Optional[float] = Field(default=0.5, description="Expected 48h rainfall forecast in mm")
    growth_stage: str = Field(default="Flowering", description="Current growth stage")
    sowing_date: Optional[str] = Field(default=None, description="Sowing date YYYY-MM-DD")
    has_irrigation: bool = Field(default=True, description="Availability of irrigation source")
    satellite_ndvi: Optional[float] = Field(default=None, description="Optional NDVI index (0 to 1)")
    satellite_ndwi: Optional[float] = Field(default=None, description="Optional NDWI index (-1 to 1)")

# Explainability Schema
class ExplainabilityNarrative(BaseModel):
    what_happened: str
    why: List[str]
    what_to_do: List[str]

# Prediction & Risk Schema
class ContributingFactor(BaseModel):
    factor: str
    impact: str  # High, Moderate, Low
    value: str
    threshold: str

class StressPredictionResult(BaseModel):
    stress_probability: float
    risk_level: str  # Low, Moderate, High, Extreme
    contributing_factors: List[ContributingFactor]
    heat_risk_level: str
    drought_risk_level: str
    rainfall_risk_level: str
    pest_risk_level: str
    model_name: str
    confidence_pct: float
    explainability: ExplainabilityNarrative

# Recommendations
class IrrigationRecommendation(BaseModel):
    priority: str  # High, Moderate, Low, Delay
    window_hours: str
    recommendation: str
    reasons: List[str]
    avoid_if_rain: bool
    estimated_water_liters_per_acre: Optional[int] = None

class CropSuitabilityItem(BaseModel):
    crop_name: str
    rank: int
    suitability_pct: float
    why_suitable: str
    water_requirement: str
    climate_suitability: str
    soil_suitability: str
    risk_level: str

class SowingRecommendation(BaseModel):
    recommended_window: str
    reason: str
    favorable_conditions: List[str]
    precaution_note: str

class FertilizerRecommendation(BaseModel):
    nitrogen_status: str
    phosphorus_status: str
    potassium_status: str
    ph_evaluation: str
    suggested_action: str
    timing: str
    has_user_soil_test: bool
    disclaimer: str

class PestDiseaseAdvisory(BaseModel):
    pest_risk_level: str
    possible_concern: str
    risk_factors: List[str]
    ipm_strategy: List[str]
    recommended_active_ingredient: Optional[str] = None
    chemical_category: Optional[str] = None
    regulatory_warning: str

class AlertItem(BaseModel):
    id: Optional[int] = None
    type: str
    severity: str
    headline: str
    message: str
    timestamp: str

# Satellite Analysis Schemas
class SatelliteAnalysisResult(BaseModel):
    ndvi_mean: float
    ndwi_mean: float
    evi_mean: float
    vegetation_health: str
    water_stress_level: str
    crop_stress_estimate_pct: float
    healthy_pct: float
    moderate_stress_pct: float
    high_stress_pct: float
    abnormal_zones_detected: bool
    legend: Dict[str, str]
    disclaimer: str

# Comprehensive Analysis Response
class ComprehensiveAnalysisResponse(BaseModel):
    id: Optional[int] = None
    created_at: str
    farm_summary: Dict[str, Any]
    stress_prediction: StressPredictionResult
    irrigation: IrrigationRecommendation
    crop_suitability: List[CropSuitabilityItem]
    sowing_window: SowingRecommendation
    fertilizer: FertilizerRecommendation
    pest_advisory: PestDiseaseAdvisory
    satellite: Optional[SatelliteAnalysisResult] = None
    alerts: List[AlertItem]

# Weather Data Schema
class DailyWeatherForecast(BaseModel):
    date: str
    day_name: str
    temp_max: float
    temp_min: float
    precipitation_mm: float
    rain_probability_pct: float
    humidity_pct: float
    wind_speed_kmh: float
    condition: str

class WeatherAnalysisResponse(BaseModel):
    location: str
    latitude: float
    longitude: float
    current_temperature: float
    current_humidity: float
    current_wind_speed_kmh: float
    current_rainfall_mm: float
    heat_risk: str
    drought_risk: str
    rainfall_risk: str
    heatwave_probability_pct: float
    overall_weather_risk_score: float  # 0 to 100
    forecast_7_days: List[DailyWeatherForecast]
    source: str

# AI Assistant Chat
class AIChatMessage(BaseModel):
    sender: str  # 'user' | 'assistant'
    text: str
    timestamp: Optional[str] = None

class AIChatRequest(BaseModel):
    message: str
    farm_context: Optional[Dict[str, Any]] = None
    conversation_history: Optional[List[AIChatMessage]] = []

class AIChatResponse(BaseModel):
    reply: str
    context_used: List[str]
    suggested_actions: List[str]
    disclaimer: str
