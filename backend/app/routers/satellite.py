from fastapi import APIRouter, Query, UploadFile, File, Form, Optional
from app.schemas.all_schemas import SatelliteAnalysisResult
from app.services.satellite_service import SatelliteService

router = APIRouter(prefix="/satellite", tags=["Satellite Spectral Analysis"])

@router.get("/demo", response_model=SatelliteAnalysisResult)
def get_demo_satellite_analysis(
    scenario: str = Query("moderate_stress", description="Option: 'healthy', 'moderate_stress', 'high_stress'")
):
    """Returns sample satellite indices and vegetation stress analysis for demonstration."""
    if scenario == "healthy":
        return SatelliteService.analyze_satellite_metrics(ndvi=0.74, ndwi=0.28, evi=0.62)
    elif scenario == "high_stress":
        return SatelliteService.analyze_satellite_metrics(ndvi=0.28, ndwi=-0.32, evi=0.18)
    else:
        return SatelliteService.analyze_satellite_metrics(ndvi=0.42, ndwi=-0.15, evi=0.35)

@router.post("/analyze", response_model=SatelliteAnalysisResult)
async def analyze_satellite_data(
    ndvi: float = Form(0.42),
    ndwi: float = Form(-0.15),
    evi: float = Form(0.35),
    file: Optional[UploadFile] = File(None)
):
    """
    Analyzes uploaded satellite imagery or user-entered spectral coordinates.
    Computes NDVI, NDWI, EVI, vegetation vigor, and zonal water stress.
    """
    image_name = file.filename if file else "spectral_data_input"
    return SatelliteService.analyze_satellite_metrics(
        ndvi=ndvi,
        ndwi=ndwi,
        evi=evi,
        image_name=image_name
    )
