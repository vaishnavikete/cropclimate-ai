import React, { useState, useEffect } from 'react';
import AppLayout from './layouts/AppLayout';
import DashboardPage from './pages/DashboardPage';
import FarmAnalysisPage from './pages/FarmAnalysisPage';
import SatellitePage from './pages/SatellitePage';
import WeatherPage from './pages/WeatherPage';
import CropAdvisorPage from './pages/CropAdvisorPage';
import RiskAlertsPage from './pages/RiskAlertsPage';
import AIAssistantPage from './pages/AIAssistantPage';

import {
  getHealth,
  getAgriculturalConstants,
  getDemoFarm,
  analyzeFarm
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isApiHealthy, setIsApiHealthy] = useState(false);
  const [selectedDemoId, setSelectedDemoId] = useState('farm-1');
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [constants, setConstants] = useState(null);

  // Initialize: Check backend health, fetch constants, and load initial Demo Farm 1
  useEffect(() => {
    let isMounted = true;

    // Check health
    getHealth()
      .then(() => {
        if (isMounted) setIsApiHealthy(true);
      })
      .catch(() => {
        if (isMounted) setIsApiHealthy(false);
      });

    // Fetch constants
    getAgriculturalConstants()
      .then(res => {
        if (isMounted) setConstants(res);
      })
      .catch(err => console.error("Error loading constants:", err));

    // Load initial demo farm
    loadDemoFarm('farm-1');

    return () => { isMounted = false; };
  }, []);

  const loadDemoFarm = async (farmId) => {
    setIsAnalyzing(true);
    setSelectedDemoId(farmId);
    try {
      const demo = await getDemoFarm(farmId);
      const analyzed = await analyzeFarm(demo);
      setAnalysisData(analyzed);
    } catch (err) {
      console.error("Failed to load demo farm analysis:", err);
      // Resilient fallback client-side demo state
      setAnalysisData({
        farm_summary: {
          location: 'Baramati, Pune',
          state: 'Maharashtra',
          district: 'Pune',
          crop: 'Soybean',
          soil_type: 'Black Soil (Regur)',
          soil_moisture_pct: 21.0,
          temperature_c: 38.0,
          growth_stage: 'Flowering',
          irrigation_available: true
        },
        stress_prediction: {
          stress_probability: 78.0,
          risk_level: 'High',
          heat_risk_level: 'High',
          drought_risk_level: 'High',
          rainfall_risk_level: 'Low',
          pest_risk_level: 'Moderate',
          model_name: 'CropClimate Agronomic ML (RandomForest Ensemble)',
          confidence_pct: 88.5,
          contributing_factors: [
            { factor: 'Extreme Ambient Temperature', impact: 'High', value: '38°C', threshold: 'Optimal: 22–32°C (Critical: 36°C)' },
            { factor: 'Critical Soil Moisture Deficit', impact: 'High', value: '21%', threshold: 'Optimal: 30–60% (Wilting: <25%)' },
            { factor: 'Low Rainfall Forecast', impact: 'Moderate', value: '1.2 mm expected', threshold: 'No replenishment forecasted' }
          ],
          explainability: {
            what_happened: "Crop stress probability is elevated at 78%, indicating acute physiological strain on Soybean.",
            why: ["Extreme Ambient Temperature (38°C)", "Critical Soil Moisture Deficit (21%)", "Low Rainfall Forecast (1.2 mm)"],
            what_to_do: [
              "Prioritize targeted irrigation during cooler morning or night hours to avoid thermal shock.",
              "Suspend foliar chemical sprays during peak temperature hours (11:00 AM - 3:30 PM).",
              "Apply organic mulch to minimize surface moisture evaporation."
            ]
          }
        },
        irrigation: {
          priority: 'High',
          window_hours: 'Next 12 hours (Early Morning 5-8 AM or Evening 6-9 PM)',
          recommendation: 'Immediate irrigation required. Soil moisture is critical (21%) under extreme ambient temperature (38°C).',
          reasons: ['Soil moisture below 25% wilting point', 'Accelerated evapotranspiration', 'Low 48h rain forecast'],
          avoid_if_rain: false,
          estimated_water_liters_per_acre: 24000
        },
        crop_suitability: [
          { crop_name: 'Soybean', rank: 1, suitability_pct: 91.0, why_suitable: 'Black Soil water retention; high Kharif compatibility', water_requirement: '~500 mm / season', climate_suitability: 'High', soil_suitability: 'Highly Suitable', risk_level: 'Low Risk' },
          { crop_name: 'Maize', rank: 2, suitability_pct: 84.0, why_suitable: 'Moderate water requirement and high heat tolerance', water_requirement: '~550 mm / season', climate_suitability: 'High', soil_suitability: 'Suitable', risk_level: 'Moderate Risk' },
          { crop_name: 'Groundnut', rank: 3, suitability_pct: 79.0, why_suitable: 'Drought-hardy legume with atmospheric nitrogen fixation', water_requirement: '~450 mm / season', climate_suitability: 'Moderate', soil_suitability: 'Suitable', risk_level: 'Moderate Risk' }
        ],
        sowing_window: {
          recommended_window: '15 June – 02 July',
          reason: 'Optimal monsoon onset window ensuring at least 75–100 mm cumulative rainfall and 25–30% seedbed soil moisture.',
          favorable_conditions: ['Adequate germination moisture', 'Emergence in 4-6 days', 'Reduces initial weed pressure'],
          precaution_note: 'Avoid sowing immediately before extreme cloudburst forecasts.'
        },
        fertilizer: {
          nitrogen_status: 'Deficient (<200 kg/ha)',
          phosphorus_status: 'Optimal (15-30 kg/ha)',
          potassium_status: 'Optimal (150-300 kg/ha)',
          ph_evaluation: 'Neutral & Optimal (pH 6.8) — Excellent nutrient assimilation capacity.',
          suggested_action: 'Split nitrogen application into multiple doses; postpone application during peak afternoon heat.',
          timing: 'Apply during vegetative/flowering stage during cool hours.',
          has_user_soil_test: true,
          disclaimer: 'Nutrient recommendations are decision-support guidelines. Verify with official Soil Health Card tests.'
        },
        pest_advisory: {
          pest_risk_level: 'Moderate',
          possible_concern: 'Elevated environmental risk for Aphids / Whitefly due to dry heat conditions.',
          risk_factors: ['Dry spell accompanied by temperature > 34°C', 'Relative humidity < 40%'],
          ipm_strategy: ['Yellow sticky cards (5-6 per acre)', 'Neem extract spray (5ml/L)', 'Conserve beneficial ladybird predators'],
          recommended_active_ingredient: 'Thiamethoxam 25% WG (Use strictly upon confirmed infestation; follow label PHI)',
          regulatory_warning: 'IMPORTANT SAFETY WARNING: Environmental risk advisory only. Verify physical pest counts with your local Agricultural Extension Officer or KVK.'
        },
        satellite: {
          ndvi_mean: 0.42,
          ndwi_mean: -0.15,
          evi_mean: 0.35,
          vegetation_health: 'Moderate Health',
          water_stress_level: 'High Water Stress',
          crop_stress_estimate_pct: 71.0,
          healthy_pct: 45.0,
          moderate_stress_pct: 35.0,
          high_stress_pct: 20.0,
          abnormal_zones_detected: true
        },
        alerts: [
          {
            type: 'HEAT_RISK',
            severity: 'CRITICAL',
            headline: '🚨 HIGH HEAT RISK WARNING',
            message: 'Ambient temperature (38.0°C) is above the critical thermal limit for Soybean. Implement heat mitigation and early morning hydration.',
            timestamp: 'Today, 08:30 AM'
          },
          {
            type: 'LOW_MOISTURE',
            severity: 'WARNING',
            headline: '💧 CRITICAL SOIL MOISTURE DEFICIT',
            message: 'Root zone volumetric moisture has fallen to 21.0%. Immediate irrigation required to avoid permanent wilting.',
            timestamp: 'Today, 06:15 AM'
          }
        ]
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCustomAnalyze = async (formData) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeFarm(formData);
      setAnalysisData(result);
      setCurrentTab('dashboard'); // Switch to dashboard to view results
    } catch (err) {
      console.error("Custom analysis failed:", err);
      alert("Analysis failed. Please check backend connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AppLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      isApiHealthy={isApiHealthy}
      selectedDemoId={selectedDemoId}
      onSelectDemoFarm={loadDemoFarm}
      isAnalyzing={isAnalyzing}
    >
      {currentTab === 'dashboard' && (
        <DashboardPage
          analysisData={analysisData}
          onNavigate={setCurrentTab}
        />
      )}

      {currentTab === 'farm_analysis' && (
        <FarmAnalysisPage
          analysisData={analysisData}
          onAnalyze={handleCustomAnalyze}
          isAnalyzing={isAnalyzing}
          constants={constants}
        />
      )}

      {currentTab === 'satellite' && (
        <SatellitePage
          satelliteData={analysisData?.satellite}
          onRunSatelliteAnalysis={() => {}}
        />
      )}

      {currentTab === 'weather' && (
        <WeatherPage
          currentFarm={analysisData?.farm_summary}
        />
      )}

      {currentTab === 'crop_advisor' && (
        <CropAdvisorPage
          analysisData={analysisData}
        />
      )}

      {currentTab === 'risk_alerts' && (
        <RiskAlertsPage
          alerts={analysisData?.alerts}
        />
      )}

      {currentTab === 'ai_assistant' && (
        <AIAssistantPage
          currentAnalysis={analysisData}
        />
      )}
    </AppLayout>
  );
}
