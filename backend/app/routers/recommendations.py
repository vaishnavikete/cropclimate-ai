from fastapi import APIRouter
from typing import List
from app.schemas.all_schemas import (
    FarmInputSchema,
    StressPredictionResult,
    IrrigationRecommendation,
    CropSuitabilityItem,
    SowingRecommendation,
    FertilizerRecommendation,
    PestDiseaseAdvisory,
)
from app.services.advisory_service import AdvisoryService

router = APIRouter(tags=["Advisory & Recommendations"])

@router.post("/predict/stress", response_model=StressPredictionResult)
def predict_stress(data: FarmInputSchema):
    """Predicts crop stress probability, risk level, contributing factors, and explainability narrative."""
    return AdvisoryService.calculate_crop_stress(data)

@router.post("/recommend/irrigation", response_model=IrrigationRecommendation)
def recommend_irrigation(data: FarmInputSchema):
    """Generates explainable smart irrigation recommendation and optimal watering window."""
    stress = AdvisoryService.calculate_crop_stress(data)
    return AdvisoryService.generate_irrigation_recommendation(data, stress)

@router.post("/recommend/crop", response_model=List[CropSuitabilityItem])
def recommend_crops(data: FarmInputSchema):
    """Evaluates suitability of all crops for the given soil, temperature, and moisture conditions."""
    return AdvisoryService.recommend_suitable_crops(data)

@router.post("/recommend/sowing", response_model=SowingRecommendation)
def recommend_sowing(data: FarmInputSchema):
    """Recommends optimal sowing window based on seasonal monsoon progression and soil moisture."""
    return AdvisoryService.recommend_sowing_window(data)

@router.post("/recommend/fertilizer", response_model=FertilizerRecommendation)
def recommend_fertilizer(data: FarmInputSchema):
    """Provides nutrient management advice based on pH and growth stage with strict soil testing caveats."""
    return AdvisoryService.generate_fertilizer_guidance(data)

@router.post("/pest/risk", response_model=PestDiseaseAdvisory)
def evaluate_pest_risk(data: FarmInputSchema):
    """Evaluates pest and disease risks with IPM-first strategies and regulated active ingredient disclaimers."""
    stress = AdvisoryService.calculate_crop_stress(data)
    return AdvisoryService.evaluate_pest_disease_risk(data, stress)
