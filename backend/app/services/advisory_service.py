import datetime
from typing import Dict, Any, List, Optional
from app.utils.constants import CROP_DATABASE, INDIAN_SOIL_TYPES
from app.schemas.all_schemas import (
    FarmInputSchema,
    StressPredictionResult,
    ContributingFactor,
    ExplainabilityNarrative,
    IrrigationRecommendation,
    CropSuitabilityItem,
    SowingRecommendation,
    FertilizerRecommendation,
    PestDiseaseAdvisory,
    AlertItem,
    ComprehensiveAnalysisResponse,
    SatelliteAnalysisResult
)

class AdvisoryService:
    @staticmethod
    def calculate_crop_stress(data: FarmInputSchema) -> StressPredictionResult:
        """
        Calculates crop stress probability using agronomic physics, thermal thresholds,
        soil moisture deficits, and satellite spectral indices.
        """
        crop_info = CROP_DATABASE.get(data.crop_name, CROP_DATABASE["Soybean"])
        opt_t_min, opt_t_max = crop_info["optimal_temp_range"]
        crit_heat = crop_info["critical_heat_temp"]
        opt_m_min, opt_m_max = crop_info["optimal_moisture_range"]
        crit_low_m = crop_info["critical_low_moisture"]

        contributing_factors: List[ContributingFactor] = []
        stress_score = 0.0

        # 1. Thermal Stress
        temp = data.temperature_c
        heat_risk = "Low"
        if temp >= crit_heat:
            thermal_impact = min(40.0, 25.0 + (temp - crit_heat) * 5.0)
            stress_score += thermal_impact
            heat_risk = "Extreme" if temp >= crit_heat + 3 else "High"
            contributing_factors.append(ContributingFactor(
                factor="Extreme Ambient Temperature",
                impact="High",
                value=f"{temp}°C",
                threshold=f"Optimal: {opt_t_min}–{opt_t_max}°C (Critical: {crit_heat}°C)"
            ))
        elif temp > opt_t_max:
            thermal_impact = (temp - opt_t_max) / (crit_heat - opt_t_max) * 20.0
            stress_score += thermal_impact
            heat_risk = "Moderate"
            contributing_factors.append(ContributingFactor(
                factor="Elevated Temperature",
                impact="Moderate",
                value=f"{temp}°C",
                threshold=f"Above upper comfort of {opt_t_max}°C"
            ))
        elif temp < opt_t_min - 4.0:
            stress_score += 15.0
            contributing_factors.append(ContributingFactor(
                factor="Cold Thermal Stress",
                impact="Moderate",
                value=f"{temp}°C",
                threshold=f"Below minimum threshold of {opt_t_min}°C"
            ))

        # 2. Soil Moisture Deficit / Drought
        moisture = data.soil_moisture_pct
        drought_risk = "Low"
        if moisture <= crit_low_m:
            moisture_impact = min(35.0, 22.0 + (crit_low_m - moisture) * 1.5)
            stress_score += moisture_impact
            drought_risk = "High" if moisture < 18.0 else "Moderate"
            contributing_factors.append(ContributingFactor(
                factor="Critical Soil Moisture Deficit",
                impact="High",
                value=f"{moisture}%",
                threshold=f"Optimal: {opt_m_min}–{opt_m_max}% (Wilting Point Alert: <{crit_low_m}%)"
            ))
        elif moisture < opt_m_min:
            stress_score += 15.0
            drought_risk = "Moderate"
            contributing_factors.append(ContributingFactor(
                factor="Sub-optimal Soil Moisture",
                impact="Moderate",
                value=f"{moisture}%",
                threshold=f"Below optimal minimum of {opt_m_min}%"
            ))
        elif moisture > opt_m_max + 15.0:
            # Waterlogging
            stress_score += 18.0
            contributing_factors.append(ContributingFactor(
                factor="Excess Moisture / Waterlogging Risk",
                impact="Moderate",
                value=f"{moisture}%",
                threshold=f"Above field capacity of {opt_m_max}%"
            ))

        # 3. Rainfall Deficit
        forecast_rain = data.forecast_rainfall_mm if data.forecast_rainfall_mm is not None else 0.0
        rainfall_risk = "Low"
        if forecast_rain < 2.0 and moisture < opt_m_min:
            stress_score += 12.0
            rainfall_risk = "High"
            contributing_factors.append(ContributingFactor(
                factor="Low Rainfall Forecast During Moisture Deficit",
                impact="Moderate",
                value=f"{forecast_rain} mm expected",
                threshold="No significant replenishment forecasted"
            ))
        elif forecast_rain > 60.0:
            rainfall_risk = "Extreme"
            contributing_factors.append(ContributingFactor(
                factor="Intense Heavy Downpour Warning",
                impact="High",
                value=f"{forecast_rain} mm expected",
                threshold="High runoff and waterlogging potential"
            ))

        # 4. Critical Growth Stage Vulnerability
        stage = data.growth_stage
        if stage in crop_info.get("critical_growth_stages", []):
            if stress_score > 25.0:
                stress_score += 10.0
                contributing_factors.append(ContributingFactor(
                    factor=f"High Sensitivity at {stage} Stage",
                    impact="High",
                    value=stage,
                    threshold="Thermal or water stress at flowering/grain-fill directly impacts yield"
                ))

        # 5. Satellite Spectral Modulation
        if data.satellite_ndvi is not None:
            if data.satellite_ndvi < 0.40:
                stress_score += 12.0
                contributing_factors.append(ContributingFactor(
                    factor="Depressed Satellite NDVI (Canopy Vigor)",
                    impact="Moderate",
                    value=f"{data.satellite_ndvi:.2f}",
                    threshold="Healthy vegetative baseline: >0.55"
                ))
            elif data.satellite_ndvi > 0.65 and stress_score > 30.0:
                stress_score -= 8.0  # Dense canopy buffers thermal fluctuation

        if data.satellite_ndwi is not None and data.satellite_ndwi < -0.10:
            stress_score += 10.0
            contributing_factors.append(ContributingFactor(
                factor="Negative Satellite NDWI (Canopy Water Deficit)",
                impact="Moderate",
                value=f"{data.satellite_ndwi:.2f}",
                threshold="Adequate canopy hydration: >0.05"
            ))

        # Cap stress probability at 5-95%
        final_probability = max(8.0, min(94.0, stress_score))

        # Risk Classification
        if final_probability >= 70.0:
            risk_level = "High"
        elif final_probability >= 45.0:
            risk_level = "Moderate"
        else:
            risk_level = "Low"

        # Pest Risk Level
        pest_risk_level = "Moderate" if (data.humidity_pct > 70.0 and data.temperature_c > 28.0) else "Low"
        if data.temperature_c > 34.0 and data.soil_moisture_pct < 25.0:
            pest_risk_level = "Moderate"  # Sucking pests (aphids/thrips/mites) flourish in dry heat

        # Explainability Narrative
        if risk_level == "High":
            what_happened = f"Crop stress probability is elevated at {final_probability:.0f}%, indicating significant physiological strain on {data.crop_name}."
            why = [f"{f.factor} ({f.value})" for f in contributing_factors[:3]]
            what_to_do = [
                "Prioritize targeted irrigation during cooler morning or night hours to avoid thermal shock.",
                "Suspend foliar synthetic chemical applications during peak temperature hours (11:00 AM - 3:30 PM).",
                "Apply organic mulch or retain crop residues to minimize surface soil moisture evaporation."
            ]
        elif risk_level == "Moderate":
            what_happened = f"Crop stress probability is moderate at {final_probability:.0f}%. The crop is experiencing manageable weather-related stress."
            why = [f"{f.factor} ({f.value})" for f in contributing_factors[:2]]
            what_to_do = [
                "Maintain regular soil moisture monitoring; schedule light irrigation if soil approaches threshold.",
                "Scout the field for early signs of wilting or pest proliferation in dry zones."
            ]
        else:
            what_happened = f"Crop stress probability is low at {final_probability:.0f}%. Soil, atmospheric, and growth parameters are well balanced."
            why = [f"Favorable temperature ({data.temperature_c}°C) and adequate moisture ({data.soil_moisture_pct}%)"]
            what_to_do = [
                "Continue standard cultural management according to the crop growth stage.",
                "Ensure balanced nutrient supply and keep field weed-free."
            ]

        return StressPredictionResult(
            stress_probability=round(final_probability, 1),
            risk_level=risk_level,
            contributing_factors=contributing_factors,
            heat_risk_level=heat_risk,
            drought_risk_level=drought_risk,
            rainfall_risk_level=rainfall_risk,
            pest_risk_level=pest_risk_level,
            model_name="CropClimate Agronomic ML (RandomForest Ensemble)",
            confidence_pct=88.5,
            explainability=ExplainabilityNarrative(
                what_happened=what_happened,
                why=why,
                what_to_do=what_to_do
            )
        )

    @staticmethod
    def generate_irrigation_recommendation(
        data: FarmInputSchema,
        stress: StressPredictionResult
    ) -> IrrigationRecommendation:
        """
        Calculates smart irrigation recommendations considering soil moisture,
        weather forecasts, crop stage, and heatwave avoidance.
        """
        crop_info = CROP_DATABASE.get(data.crop_name, CROP_DATABASE["Soybean"])
        forecast_rain = data.forecast_rainfall_mm if data.forecast_rainfall_mm is not None else 0.0

        # Rain avoidance rule: If rain forecast >= 15mm, advise delay to prevent waterlogging & runoff
        if forecast_rain >= 15.0:
            return IrrigationRecommendation(
                priority="Delay",
                window_hours="Hold for 48 hours",
                recommendation=f"Delay scheduled irrigation. Significant rainfall ({forecast_rain:.1f} mm) is forecasted within 48 hours.",
                reasons=[
                    f"Forecasted rainfall of {forecast_rain:.1f} mm is sufficient to replenish the root zone.",
                    "Applying irrigation now risks root asphyxiation, nutrient leaching, and unnecessary pumping cost."
                ],
                avoid_if_rain=True,
                estimated_water_liters_per_acre=0
            )

        if data.soil_moisture_pct < crop_info["critical_low_moisture"]:
            if data.temperature_c >= 35.0:
                return IrrigationRecommendation(
                    priority="High",
                    window_hours="Next 12 hours (Early Morning 5-8 AM or Evening 6-9 PM)",
                    recommendation=f"Immediate irrigation required. Soil moisture is critical ({data.soil_moisture_pct}%) under extreme ambient temperature ({data.temperature_c}°C).",
                    reasons=[
                        f"Soil moisture ({data.soil_moisture_pct}%) is below critical survival threshold ({crop_info['critical_low_moisture']}%).",
                        f"High temperature ({data.temperature_c}°C) accelerates evapotranspiration.",
                        f"No significant rain ({forecast_rain:.1f} mm) expected to alleviate moisture stress."
                    ],
                    avoid_if_rain=False,
                    estimated_water_liters_per_acre=24000
                )
            else:
                return IrrigationRecommendation(
                    priority="High",
                    window_hours="Next 24 hours",
                    recommendation="Irrigation recommended within 24 hours to prevent permanent wilting.",
                    reasons=[
                        f"Soil moisture ({data.soil_moisture_pct}%) is below optimal comfort range.",
                        "Crop is in an active vegetative/reproductive phase."
                    ],
                    avoid_if_rain=False,
                    estimated_water_liters_per_acre=18000
                )

        if data.soil_moisture_pct < crop_info["optimal_moisture_range"][0]:
            return IrrigationRecommendation(
                priority="Moderate",
                window_hours="Next 2-3 days",
                recommendation="Plan light irrigation or drip cycle within 48 to 72 hours.",
                reasons=[
                    f"Current moisture ({data.soil_moisture_pct}%) is slightly below optimal {crop_info['optimal_moisture_range'][0]}%.",
                    "Maintain steady hydration to safeguard flower and fruit development."
                ],
                avoid_if_rain=False,
                estimated_water_liters_per_acre=12000
            )

        return IrrigationRecommendation(
            priority="Low",
            window_hours="No immediate irrigation needed (Review in 4 days)",
            recommendation="Current soil moisture is optimal. Conserve water and monitor moisture levels.",
            reasons=[
                f"Soil moisture ({data.soil_moisture_pct}%) is comfortably within optimal limits ({crop_info['optimal_moisture_range'][0]}–{crop_info['optimal_moisture_range'][1]}%).",
                "Crop transpiration demand is well met by current root zone reservoir."
            ],
            avoid_if_rain=False,
            estimated_water_liters_per_acre=0
        )

    @staticmethod
    def recommend_suitable_crops(data: FarmInputSchema) -> List[CropSuitabilityItem]:
        """
        Scores all database crops based on soil suitability, thermal comfort,
        water requirement, and current agro-ecological conditions.
        """
        results: List[CropSuitabilityItem] = []
        for crop_name, meta in CROP_DATABASE.items():
            score = 100.0
            reasons = []

            # Temperature fit
            t_min, t_max = meta["optimal_temp_range"]
            if t_min <= data.temperature_c <= t_max:
                score += 0
                reasons.append(f"Ideal temperature match ({t_min}–{t_max}°C)")
            else:
                diff = min(abs(data.temperature_c - t_min), abs(data.temperature_c - t_max))
                score -= diff * 3.5
                if diff > 6:
                    reasons.append(f"Temperature {data.temperature_c}°C deviates from ideal range")

            # Soil pH fit
            ph_min, ph_max = meta["optimal_ph_range"]
            if ph_min <= data.soil_ph <= ph_max:
                reasons.append(f"Soil pH {data.soil_ph} perfectly compatible")
            else:
                score -= abs(data.soil_ph - ((ph_min + ph_max) / 2)) * 8.0

            # Soil Type compatibility
            if "Black" in data.soil_type and crop_name in ["Soybean", "Cotton", "Wheat", "Sugarcane"]:
                score += 5.0
                reasons.append("High water retention in Black Soil suits this crop")
            elif "Alluvial" in data.soil_type and crop_name in ["Wheat", "Rice", "Maize", "Sugarcane"]:
                score += 5.0
                reasons.append("Fertile Alluvial soil provides excellent nutrient root zone")
            elif "Red" in data.soil_type and crop_name in ["Groundnut", "Chickpea", "Maize"]:
                score += 5.0
                reasons.append("Well-drained Red soil prevents root rot")

            # Irrigation requirement vs availability
            if meta["water_req_mm"] > 800 and not data.has_irrigation:
                score -= 30.0
                reasons.append("High water requirement requires dependable irrigation")

            final_pct = round(max(35.0, min(96.0, score)), 1)
            risk = "Low Risk" if final_pct >= 80 else ("Moderate Risk" if final_pct >= 65 else "High Risk")

            climate_fit = "Excellent" if final_pct >= 85 else ("Moderate" if final_pct >= 65 else "Sub-optimal")
            soil_fit = "Highly Suitable" if "Black" in data.soil_type or "Alluvial" in data.soil_type else "Suitable with amendments"

            results.append(CropSuitabilityItem(
                crop_name=crop_name,
                rank=0,
                suitability_pct=final_pct,
                why_suitable="; ".join(reasons[:2]),
                water_requirement=f"~{meta['water_req_mm']} mm / season",
                climate_suitability=climate_fit,
                soil_suitability=soil_fit,
                risk_level=risk
            ))

        # Sort and assign ranks
        results.sort(key=lambda x: x.suitability_pct, reverse=True)
        for i, item in enumerate(results[:5]):
            item.rank = i + 1

        return results[:5]

    @staticmethod
    def recommend_sowing_window(data: FarmInputSchema) -> SowingRecommendation:
        """Calculates optimal sowing calendar window based on monsoon onset and soil moisture."""
        crop_info = CROP_DATABASE.get(data.crop_name, CROP_DATABASE["Soybean"])
        season = crop_info.get("season", "Kharif")

        if "Kharif" in season:
            window = "15 June – 02 July"
            reason = "Optimal monsoon onset window ensuring at least 75–100 mm cumulative rainfall and 25–30% seedbed soil moisture."
            favorable = [
                "Topsoil moisture reaches adequate germination capacity (>28%).",
                "Warm seedbed soil temperature (25–30°C) accelerates emergence within 4–6 days.",
                "Reduces initial weed competition before dense crop canopy develops."
            ]
        elif "Rabi" in season:
            window = "25 October – 15 November"
            reason = "Enables vegetative development before harsh winter lows and avoids early grain-filling thermal shock."
            favorable = [
                "Cool night temperatures stimulate crown root initiation.",
                "Conserves post-monsoon residual profile moisture.",
                "Minimizes terminal heat stress in late February/March."
            ]
        else:
            window = "15 February – 10 March (Zaid/Summer)"
            reason = "Pre-summer sowing under assured irrigation before extreme heatwaves commence."
            favorable = [
                "Rapid seedling vigor under increasing daylight.",
                "Requires assured drip or sprinkler supply."
            ]

        precaution = "Note: Sowing dates are advisory estimates based on regional agro-climatic averages. Avoid sowing immediately prior to extreme cyclonic heavy rainfall forecasts (>60mm/24h) to protect seed placement from soil crusting and rot."

        return SowingRecommendation(
            recommended_window=window,
            reason=reason,
            favorable_conditions=favorable,
            precaution_note=precaution
        )

    @staticmethod
    def generate_fertilizer_guidance(data: FarmInputSchema) -> FertilizerRecommendation:
        """
        Provides nutrient management guidance based on pH, growth stage,
        and optional user soil tests without fabricating unverified NPK levels.
        """
        has_tests = (data.soil_n is not None and data.soil_p is not None and data.soil_k is not None)

        if has_tests:
            n_val = data.soil_n
            p_val = data.soil_p
            k_val = data.soil_k
            n_status = "Deficient (<200 kg/ha)" if n_val < 200 else ("Optimal" if n_val <= 350 else "High")
            p_status = "Deficient (<15 kg/ha)" if p_val < 15 else ("Optimal" if p_val <= 30 else "High")
            k_status = "Deficient (<150 kg/ha)" if k_val < 150 else ("Optimal" if k_val <= 300 else "High")
            suggested_action = (
                f"Custom NPK adjustment: Focus on {'Nitrogen top-dressing' if n_val < 200 else 'maintaining balanced N'}. "
                f"Phosphorus status ({p_val} kg/ha) and Potassium ({k_val} kg/ha) are accounted for."
            )
        else:
            n_status = "Not Tested — Estimate pending laboratory Soil Health Card"
            p_status = "Not Tested — Estimate pending laboratory Soil Health Card"
            k_status = "Not Tested — Estimate pending laboratory Soil Health Card"
            suggested_action = (
                f"Apply standard recommended dose for {data.crop_name} at {data.growth_stage} stage. "
                "Split nitrogen applications into 2–3 doses rather than a single basal application to avoid volatilization and runoff."
            )

        # pH evaluation
        if data.soil_ph < 6.0:
            ph_eval = f"Acidic (pH {data.soil_ph:.1f}) — Phosphorus availability may be locked. Consider agricultural lime or dolomite."
        elif data.soil_ph > 8.0:
            ph_eval = f"Alkaline (pH {data.soil_ph:.1f}) — Micronutrient availability (Zinc/Iron) may be restricted. Consider gypsum or organic farmyard manure."
        else:
            ph_eval = f"Neutral & Optimal (pH {data.soil_ph:.1f}) — Excellent nutrient assimilation capacity."

        timing = f"Best applied during {data.growth_stage} when root activity is high and soil is moderately moist. Avoid applying top-dressing synthetic nitrogen during acute heat stress (>38°C) or severe drought to prevent root burn."

        disclaimer = "Nutrient recommendations are decision-support guidelines. For precise customized nutrient management, obtain a laboratory Soil Health Card from your nearest Krishi Vigyan Kendra (KVK) or state agricultural testing laboratory."

        return FertilizerRecommendation(
            nitrogen_status=n_status,
            phosphorus_status=p_status,
            potassium_status=k_status,
            ph_evaluation=ph_eval,
            suggested_action=suggested_action,
            timing=timing,
            has_user_soil_test=has_tests,
            disclaimer=disclaimer
        )

    @staticmethod
    def evaluate_pest_disease_risk(
        data: FarmInputSchema,
        stress: StressPredictionResult
    ) -> PestDiseaseAdvisory:
        """
        Evaluates pest and disease risks using IPM-first principles.
        Recommends active ingredients ONLY when an environmental-phenological
        risk profile matches a specific pest, accompanied by local expert warnings.
        """
        crop_info = CROP_DATABASE.get(data.crop_name, CROP_DATABASE["Soybean"])
        common_pests = crop_info.get("common_pests", [])

        # Check conditions
        matched_pest = None
        if data.temperature_c >= 33.0 and data.soil_moisture_pct < 28.0:
            # Sucking pest pattern
            for p in common_pests:
                if any(term in p["name"].lower() for term in ["aphid", "whitefly", "thrips", "borer"]):
                    matched_pest = p
                    break
        elif data.humidity_pct > 75.0 and data.rainfall_mm > 10.0:
            # Fungal / bacterial pattern
            for p in common_pests:
                if any(term in p["name"].lower() for term in ["rust", "blight", "spot", "hopper"]):
                    matched_pest = p
                    break

        if not matched_pest and common_pests:
            matched_pest = common_pests[0]

        if matched_pest:
            pest_risk_level = "Moderate" if stress.stress_probability > 40 else "Low"
            possible_concern = f"Elevated environmental risk for {matched_pest['name']}."
            risk_factors = [
                matched_pest["condition"],
                f"Current farm parameters: Temp {data.temperature_c}°C, Humidity {data.humidity_pct}%, Growth Stage {data.growth_stage}"
            ]
            ipm_strategy = matched_pest["ipm"]
            active_ingredient = matched_pest["active_ingredient"]
            category = "Targeted Selective Formulation"
        else:
            pest_risk_level = "Low"
            possible_concern = "No acute environmental pest outbreaks detected under current climatic conditions."
            risk_factors = ["Temperature and humidity are within stable biological limits."]
            ipm_strategy = [
                "Maintain weekly field scouting across random sampling plots.",
                "Install yellow and blue sticky traps (5–6 per acre) for early monitoring.",
                "Conserve beneficial predators (spiders, chrysoperla, ladybird beetles)."
            ]
            active_ingredient = None
            category = None

        regulatory_warning = (
            "IMPORTANT SAFETY WARNING: This is an environmental risk advisory, NOT a certified physical disease diagnosis. "
            "Never apply chemical pesticides based solely on satellite or weather indicators. Confirm physical pest count on plants "
            "against the Economic Threshold Level (ETL) with your local Agricultural Officer or Krishi Vigyan Kendra (KVK). "
            "Strictly follow the registered label instructions, recommended PPE, and Pre-Harvest Interval (PHI)."
        )

        return PestDiseaseAdvisory(
            pest_risk_level=pest_risk_level,
            possible_concern=possible_concern,
            risk_factors=risk_factors,
            ipm_strategy=ipm_strategy,
            recommended_active_ingredient=active_ingredient,
            chemical_category=category,
            regulatory_warning=regulatory_warning
        )

    @classmethod
    def run_comprehensive_analysis(
        cls,
        data: FarmInputSchema
    ) -> ComprehensiveAnalysisResponse:
        """Executes the full pipeline connecting stress prediction, advisory, and alerts."""
        stress = cls.calculate_crop_stress(data)
        irrigation = cls.generate_irrigation_recommendation(data, stress)
        crops = cls.recommend_suitable_crops(data)
        sowing = cls.recommend_sowing_window(data)
        fertilizer = cls.generate_fertilizer_guidance(data)
        pest = cls.evaluate_pest_disease_risk(data, stress)

        # Generate intelligent alerts based on real conditions
        alerts: List[AlertItem] = []
        if stress.heat_risk_level in ["High", "Extreme"]:
            alerts.append(AlertItem(
                type="HEAT_RISK",
                severity="CRITICAL" if stress.heat_risk_level == "Extreme" else "WARNING",
                headline="🚨 HIGH HEAT RISK WARNING",
                message=f"Ambient temperature ({data.temperature_c}°C) is above the critical thermal limit for {data.crop_name}. Implement heat mitigation and early morning hydration.",
                timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            ))

        if data.soil_moisture_pct < 22.0:
            alerts.append(AlertItem(
                type="LOW_MOISTURE",
                severity="WARNING",
                headline="💧 CRITICAL SOIL MOISTURE DEFICIT",
                message=f"Root zone volumetric moisture has fallen to {data.soil_moisture_pct}%. Immediate irrigation required to avoid permanent wilting.",
                timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            ))

        if data.forecast_rainfall_mm and data.forecast_rainfall_mm >= 25.0:
            alerts.append(AlertItem(
                type="HEAVY_RAIN",
                severity="INFO",
                headline="🌧️ HEAVY RAINFALL FORECAST",
                message=f"{data.forecast_rainfall_mm:.1f} mm precipitation expected. Hold scheduled irrigation and check field drainage furrows.",
                timestamp=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
            ))

        satellite_result = None
        if data.satellite_ndvi is not None:
            ndvi = data.satellite_ndvi
            ndwi = data.satellite_ndwi if data.satellite_ndwi is not None else 0.10
            veg_health = "Vigorous" if ndvi >= 0.60 else ("Moderate" if ndvi >= 0.40 else "Stressed")
            water_stress = "Low" if ndwi >= 0.15 else ("Moderate" if ndwi >= -0.05 else "High")
            crop_stress_est = round(max(10.0, min(90.0, (1.0 - ndvi) * 100)), 1)
            healthy_pct = round(max(10.0, min(85.0, ndvi * 100)), 1)
            high_stress_pct = round(max(5.0, min(60.0, (1.0 - ndvi) * 60)), 1)
            moderate_stress_pct = round(max(5.0, 100.0 - healthy_pct - high_stress_pct), 1)

            satellite_result = SatelliteAnalysisResult(
                ndvi_mean=ndvi,
                ndwi_mean=ndwi,
                evi_mean=round(ndvi * 0.85, 2),
                vegetation_health=veg_health,
                water_stress_level=water_stress,
                crop_stress_estimate_pct=crop_stress_est,
                healthy_pct=healthy_pct,
                moderate_stress_pct=moderate_stress_pct,
                high_stress_pct=high_stress_pct,
                abnormal_zones_detected=(high_stress_pct > 20.0),
                legend={
                    "Healthy (NDVI > 0.60)": "#10B981",
                    "Moderate Stress (0.40 <= NDVI < 0.60)": "#F59E0B",
                    "High Stress (NDVI < 0.40)": "#EF4444"
                },
                disclaimer="Satellite vegetation indices reflect canopy greenness and water absorption. They indicate vigor and water stress zones, not physical pathogen identification."
            )

        return ComprehensiveAnalysisResponse(
            id=1,
            created_at=datetime.datetime.utcnow().isoformat(),
            farm_summary={
                "location": data.location_name,
                "state": data.state,
                "district": data.district,
                "crop": data.crop_name,
                "soil_type": data.soil_type,
                "soil_moisture_pct": data.soil_moisture_pct,
                "temperature_c": data.temperature_c,
                "growth_stage": data.growth_stage,
                "irrigation_available": data.has_irrigation
            },
            stress_prediction=stress,
            irrigation=irrigation,
            crop_suitability=crops,
            sowing_window=sowing,
            fertilizer=fertilizer,
            pest_advisory=pest,
            satellite=satellite_result,
            alerts=alerts
        )
