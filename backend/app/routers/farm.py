from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.all_schemas import FarmInputSchema, ComprehensiveAnalysisResponse
from app.services.advisory_service import AdvisoryService
from app.utils.constants import DEMO_FARMS, INDIAN_STATES_DISTRICTS, INDIAN_SOIL_TYPES, CROP_DATABASE

router = APIRouter(prefix="/farm", tags=["Farm Operations"])

@router.get("/constants")
def get_agricultural_constants():
    """Returns supported Indian states, districts, soil types, and crop options."""
    return {
        "states": INDIAN_STATES_DISTRICTS,
        "soil_types": INDIAN_SOIL_TYPES,
        "crops": list(CROP_DATABASE.keys())
    }

@router.get("/demo/{farm_id}")
def get_demo_farm(farm_id: str):
    """Returns one of the pre-configured demo farms (Soybean Pune, Wheat Ludhiana, Rice Thanjavur)."""
    if farm_id not in DEMO_FARMS:
        raise HTTPException(
            status_code=404,
            detail=f"Demo farm '{farm_id}' not found. Available options: {list(DEMO_FARMS.keys())}"
        )
    return DEMO_FARMS[farm_id]

@router.get("/demos")
def list_demo_farms():
    """Returns all available demo farm profiles."""
    return list(DEMO_FARMS.values())

@router.post("/analyze", response_model=ComprehensiveAnalysisResponse)
def analyze_farm(data: FarmInputSchema, db: Session = Depends(get_db)):
    """
    Primary endpoint: Analyzes comprehensive farm inputs and returns
    crop stress prediction, irrigation plan, crop suitability, sowing window,
    fertilizer guidance, pest advisory, and explainable AI narrative.
    """
    response = AdvisoryService.run_comprehensive_analysis(data)
    return response
