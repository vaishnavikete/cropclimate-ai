import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False, default="Farmer User")
    email = Column(String(120), unique=True, index=True, nullable=True)
    phone = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")


class Farm(Base):
    __tablename__ = "farms"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    name = Column(String(120), nullable=False)
    state = Column(String(80), nullable=False, default="Maharashtra")
    district = Column(String(80), nullable=False, default="Pune")
    village = Column(String(120), nullable=True)
    latitude = Column(Float, nullable=True, default=18.5204)
    longitude = Column(Float, nullable=True, default=73.8567)
    size_acres = Column(Float, nullable=False, default=5.0)
    soil_type = Column(String(60), nullable=False, default="Black Soil (Regur)")
    has_irrigation = Column(Boolean, default=True)
    irrigation_source = Column(String(60), default="Borewell/Canal")
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="farms")
    analyses = relationship("FarmAnalysis", back_populates="farm", cascade="all, delete-orphan")


class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80), unique=True, nullable=False, index=True)
    botanical_name = Column(String(120), nullable=True)
    season = Column(String(40), default="Kharif")  # Kharif, Rabi, Zaid
    optimal_temp_min = Column(Float, default=20.0)
    optimal_temp_max = Column(Float, default=32.0)
    optimal_moisture_min = Column(Float, default=30.0)
    optimal_moisture_max = Column(Float, default=60.0)
    optimal_ph_min = Column(Float, default=6.0)
    optimal_ph_max = Column(Float, default=7.5)
    water_requirement_mm = Column(Float, default=500.0)
    growth_duration_days = Column(Integer, default=110)
    common_pests = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)


class FarmAnalysis(Base):
    __tablename__ = "farm_analyses"

    id = Column(Integer, primary_key=True, index=True)
    farm_id = Column(Integer, ForeignKey("farms.id"), nullable=True)
    crop_name = Column(String(80), nullable=False)
    soil_type = Column(String(60), nullable=False)
    soil_moisture_pct = Column(Float, nullable=False)
    soil_ph = Column(Float, nullable=False, default=6.8)
    soil_n = Column(Float, nullable=True)
    soil_p = Column(Float, nullable=True)
    soil_k = Column(Float, nullable=True)
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    growth_stage = Column(String(60), nullable=False, default="Vegetative")
    sowing_date = Column(String(30), nullable=True)
    has_irrigation = Column(Boolean, default=True)

    # Satellite data linkages (if available)
    satellite_ndvi = Column(Float, nullable=True)
    satellite_ndwi = Column(Float, nullable=True)
    satellite_evi = Column(Float, nullable=True)

    # Overall Summary
    overall_stress_probability = Column(Float, nullable=False)  # 0 to 100
    overall_risk_level = Column(String(30), nullable=False)     # Low, Moderate, High, Extreme
    analysis_summary = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    farm = relationship("Farm", back_populates="analyses")
    weather_data = relationship("WeatherData", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    satellite_analysis = relationship("SatelliteAnalysis", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    risk_prediction = relationship("RiskPrediction", back_populates="analysis", uselist=False, cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="analysis", cascade="all, delete-orphan")


class WeatherData(Base):
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("farm_analyses.id"), nullable=True)
    location_name = Column(String(120), nullable=False)
    temperature_current = Column(Float, nullable=False)
    temperature_max = Column(Float, nullable=False)
    temperature_min = Column(Float, nullable=False)
    humidity_pct = Column(Float, nullable=False)
    rainfall_mm = Column(Float, nullable=False)
    wind_speed_kmh = Column(Float, nullable=True, default=12.0)
    forecast_rain_prob_pct = Column(Float, nullable=True, default=20.0)
    heatwave_risk = Column(String(30), default="Moderate")
    drought_risk = Column(String(30), default="Moderate")
    raw_forecast = Column(JSON, nullable=True)
    recorded_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("FarmAnalysis", back_populates="weather_data")


class SatelliteAnalysis(Base):
    __tablename__ = "satellite_analyses"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("farm_analyses.id"), nullable=True)
    image_url = Column(String(255), nullable=True)
    ndvi_mean = Column(Float, nullable=False)
    ndwi_mean = Column(Float, nullable=False)
    evi_mean = Column(Float, nullable=True)
    vegetation_health = Column(String(40), default="Moderate")
    water_stress_level = Column(String(40), default="Moderate")
    crop_stress_estimate = Column(Float, default=50.0)
    healthy_pct = Column(Float, default=60.0)
    moderate_stress_pct = Column(Float, default=25.0)
    high_stress_pct = Column(Float, default=15.0)
    spectral_meta = Column(JSON, nullable=True)
    analyzed_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("FarmAnalysis", back_populates="satellite_analysis")


class RiskPrediction(Base):
    __tablename__ = "risk_predictions"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("farm_analyses.id"), nullable=False)
    stress_probability = Column(Float, nullable=False)
    risk_level = Column(String(30), nullable=False)
    heat_risk_level = Column(String(30), nullable=False)
    drought_risk_level = Column(String(30), nullable=False)
    rainfall_risk_level = Column(String(30), nullable=False)
    pest_risk_level = Column(String(30), nullable=False)
    model_version = Column(String(40), default="random_forest_v1")
    contributing_factors = Column(JSON, nullable=False)
    explainability_narrative = Column(JSON, nullable=True)

    analysis = relationship("FarmAnalysis", back_populates="risk_prediction")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("farm_analyses.id"), nullable=False)
    category = Column(String(50), nullable=False)  # irrigation, crop, sowing, fertilizer, pest, heat_mitigation
    title = Column(String(160), nullable=False)
    priority = Column(String(20), default="Medium")  # High, Medium, Low
    action_text = Column(Text, nullable=False)
    reasoning = Column(Text, nullable=True)
    safety_disclaimer = Column(Text, nullable=True)
    meta_details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("FarmAnalysis", back_populates="recommendations")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    analysis_id = Column(Integer, ForeignKey("farm_analyses.id"), nullable=True)
    alert_type = Column(String(50), nullable=False)  # HEAT_RISK, LOW_MOISTURE, HEAVY_RAIN, SATELLITE_STRESS, PEST_ALERT
    severity = Column(String(20), default="WARNING")  # INFO, WARNING, CRITICAL
    headline = Column(String(160), nullable=False)
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    analysis = relationship("FarmAnalysis", back_populates="alerts")
