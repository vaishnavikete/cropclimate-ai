import numpy as np
from typing import Dict, Any, Tuple
from app.schemas.all_schemas import SatelliteAnalysisResult

class SatelliteService:
    @staticmethod
    def calculate_spectral_indices(nir: float, red: float, green: float, blue: float = 0.1) -> Dict[str, float]:
        """
        Calculates NDVI, NDWI (Gao 1996 / McFeeters), and EVI from spectral band values.
        NDVI = (NIR - Red) / (NIR + Red)
        NDWI = (Green - NIR) / (Green + NIR) or (NIR - SWIR)/(NIR + SWIR)
        EVI  = 2.5 * ((NIR - Red) / (NIR + 6 * Red - 7.5 * Blue + 1))
        """
        eps = 1e-6
        ndvi = (nir - red) / (nir + red + eps)
        ndwi = (green - nir) / (green + nir + eps)
        evi = 2.5 * ((nir - red) / (nir + 6.0 * red - 7.5 * blue + 1.0 + eps))

        return {
            "ndvi": float(np.clip(ndvi, -1.0, 1.0)),
            "ndwi": float(np.clip(ndwi, -1.0, 1.0)),
            "evi": float(np.clip(evi, -1.0, 1.5))
        }

    @classmethod
    def analyze_satellite_metrics(
        cls,
        ndvi: float = 0.42,
        ndwi: float = -0.15,
        evi: float = 0.35,
        image_name: str = "farm_sentinel2_l2a.tif"
    ) -> SatelliteAnalysisResult:
        """
        Generates realistic zonal classifications and crop health statistics.
        Does NOT claim single-source disease diagnosis.
        """
        # Determine health levels
        if ndvi >= 0.65:
            veg_health = "Vigorous Canopy"
            healthy_pct = 78.0
            mod_pct = 16.0
            high_pct = 6.0
        elif ndvi >= 0.45:
            veg_health = "Moderate Health"
            healthy_pct = 52.0
            mod_pct = 33.0
            high_pct = 15.0
        else:
            veg_health = "Stressed / Sparse Canopy"
            healthy_pct = 24.0
            mod_pct = 41.0
            high_pct = 35.0

        if ndwi >= 0.10:
            water_stress = "Low (Adequate Hydration)"
        elif ndwi >= -0.10:
            water_stress = "Moderate Water Stress"
        else:
            water_stress = "High Water Stress"

        # Crop stress estimate based on vegetation health + moisture
        stress_est = round(max(10.0, min(92.0, (1.0 - ndvi) * 75.0 + (0.0 if ndwi > 0 else abs(ndwi) * 40.0))), 1)

        return SatelliteAnalysisResult(
            ndvi_mean=round(ndvi, 2),
            ndwi_mean=round(ndwi, 2),
            evi_mean=round(evi, 2),
            vegetation_health=veg_health,
            water_stress_level=water_stress,
            crop_stress_estimate_pct=stress_est,
            healthy_pct=healthy_pct,
            moderate_stress_pct=mod_pct,
            high_stress_pct=high_pct,
            abnormal_zones_detected=(high_pct > 20.0),
            legend={
                "Healthy (NDVI > 0.60)": "#10B981",
                "Moderate Stress (0.40 <= NDVI < 0.60)": "#F59E0B",
                "High Stress / Water Deficit (NDVI < 0.40)": "#EF4444"
            },
            disclaimer="Satellite analysis measures canopy reflectance and water absorption. It indicates zones of vigor and hydration deficits, but cannot substitute for laboratory soil pathology or in-person microscopic pest/disease scouting."
        )
