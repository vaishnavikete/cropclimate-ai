from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "CropClimate AI"
    assert data["tagline"] == "Predict. Protect. Grow."

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["healthy", "degraded"]
    assert "connected" in data["database"]

def test_farm_constants_endpoint():
    response = client.get("/api/farm/constants")
    assert response.status_code == 200
    data = response.json()
    assert "Maharashtra" in data["states"]
    assert "Soybean" in data["crops"]
    assert "Black Soil (Regur)" in data["soil_types"]

def test_demo_farm_endpoint():
    response = client.get("/api/farm/demo/farm-1")
    assert response.status_code == 200
    data = response.json()
    assert data["crop_name"] == "Soybean"
    assert data["temperature_c"] == 38.0
    assert data["expected_stress_prob"] == 78.0
