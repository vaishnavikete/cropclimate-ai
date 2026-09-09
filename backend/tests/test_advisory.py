from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_analyze_farm_endpoint():
    payload = {
        "location_name": "Baramati, Pune",
        "state": "Maharashtra",
        "district": "Pune",
        "crop_name": "Soybean",
        "soil_type": "Black Soil (Regur)",
        "soil_moisture_pct": 21.0,
        "soil_ph": 7.1,
        "temperature_c": 38.0,
        "humidity_pct": 32.0,
        "rainfall_mm": 0.0,
        "forecast_rainfall_mm": 1.2,
        "growth_stage": "Flowering",
        "has_irrigation": True,
        "satellite_ndvi": 0.42,
        "satellite_ndwi": -0.15
    }
    response = client.post("/api/farm/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "stress_prediction" in data
    assert data["stress_prediction"]["risk_level"] in ["Moderate", "High", "Extreme"]
    assert data["stress_prediction"]["stress_probability"] > 50.0
    assert "explainability" in data["stress_prediction"]
    assert "what_happened" in data["stress_prediction"]["explainability"]
    assert "irrigation" in data
    assert "crop_suitability" in data
    assert len(data["crop_suitability"]) > 0
    assert "sowing_window" in data
    assert "fertilizer" in data
    assert "pest_advisory" in data

def test_weather_endpoint():
    response = client.get("/api/weather?lat=18.5204&lon=73.8567&location=Pune")
    assert response.status_code == 200
    data = response.json()
    assert "current_temperature" in data
    assert "forecast_7_days" in data
    assert len(data["forecast_7_days"]) >= 5

def test_ai_chat_endpoint():
    payload = {
        "message": "My soybean field has low soil moisture and tomorrow temperature is 40°C. What should I do?",
        "farm_context": {
            "crop": "Soybean",
            "temperature_c": 40.0,
            "soil_moisture_pct": 20.0,
            "stress_prob": 82.0,
            "location": "Pune"
        }
    }
    response = client.post("/api/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
    assert "heat-stress" in data["reply"].lower() or "irrigation" in data["reply"].lower()
    assert "disclaimer" in data
