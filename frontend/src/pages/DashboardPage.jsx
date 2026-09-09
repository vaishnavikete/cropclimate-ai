import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Satellite,
  AlertTriangle,
  Flame,
  Bug,
  Compass,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export default function DashboardPage({ analysisData, onNavigate }) {
  if (!analysisData) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
        <div className="w-16 h-16 mx-auto mb-4 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center text-3xl">
          🌾
        </div>
        <h2 className="text-xl font-heading font-bold text-stone-900">Loading Agricultural Intelligence...</h2>
        <p className="text-sm text-stone-500 mt-2 max-w-md mx-auto">
          Please select a demo farm scenario from the top bar or launch a custom farm analysis.
        </p>
      </div>
    );
  }

  const {
    farm_summary = {},
    stress_prediction = {},
    irrigation = {},
    crop_suitability = [],
    sowing_window = {},
    fertilizer = {},
    pest_advisory = {},
    satellite = null,
    alerts = []
  } = analysisData;

  const stressPct = stress_prediction.stress_probability || 0;
  const isHighRisk = stressPct >= 70;
  const isModRisk = stressPct >= 45 && stressPct < 70;

  // Color mapping based on stress
  const stressColor = isHighRisk ? 'text-rose-600' : (isModRisk ? 'text-amber-500' : 'text-emerald-600');
  const stressBg = isHighRisk ? 'bg-rose-50 border-rose-200' : (isModRisk ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200');

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Farm Context & Quick Status */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
              {farm_summary.crop || 'Crop'} Advisory
            </span>
            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-stone-400" />
              {farm_summary.location || 'Pune, Maharashtra'} ({farm_summary.state || 'India'})
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900 mt-2">
            Field Condition & Climate Risk Overview
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Growth Stage: <strong className="text-stone-700">{farm_summary.growth_stage || 'Flowering'}</strong> • Soil: <strong className="text-stone-700">{farm_summary.soil_type || 'Black Soil'}</strong> • Irrigation: <strong className="text-stone-700">{farm_summary.irrigation_available ? 'Available' : 'Rainfed'}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('farm_analysis')}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>Modify Field Data</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Critical Early Warning Alerts Banner */}
      {alerts && alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-50/90 border-rose-200 text-rose-900'
                  : 'bg-amber-50/90 border-amber-200 text-amber-900'
              }`}
            >
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${alert.severity === 'CRITICAL' ? 'text-rose-600' : 'text-amber-600'}`} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider">{alert.headline}</h4>
                  <span className="text-[10px] opacity-75">{alert.timestamp}</span>
                </div>
                <p className="text-xs sm:text-sm mt-0.5 leading-relaxed">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Stress Visual Gauge & 4 Risk Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Crop Stress Probability Gauge & Factor Attribution (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Predictive ML Model</span>
                <h2 className="text-lg font-heading font-bold text-stone-900">Crop Stress Probability</h2>
              </div>
              <span className={`px-3 py-1 text-xs font-bold rounded-full border ${stressBg} ${stressColor}`}>
                {stress_prediction.risk_level?.toUpperCase() || 'MODERATE'} RISK
              </span>
            </div>

            {/* Circular / Large Metric Display */}
            <div className="my-6 flex flex-col sm:flex-row items-center justify-around gap-6 p-6 rounded-2xl bg-stone-50 border border-stone-100">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Circular Ring */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-stone-200 stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className={`${isHighRisk ? 'text-rose-500' : (isModRisk ? 'text-amber-500' : 'text-emerald-500')} stroke-current transition-all duration-1000 ease-out`}
                    strokeWidth="10"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * stressPct) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className={`text-3xl font-heading font-extrabold tracking-tight ${stressColor}`}>
                    {stressPct}%
                  </span>
                  <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Probability</span>
                </div>
              </div>

              <div className="space-y-2 max-w-xs text-center sm:text-left">
                <h3 className="text-sm font-bold text-stone-800">
                  {isHighRisk ? '⚠️ High Physiological Stress Detected' : (isModRisk ? '⚡ Moderate Stress Conditions' : '🌿 Safe Comfort Zone')}
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Evaluated via agronomic feature models across ambient heat, moisture deficit, phenological stage, and canopy spectral reflectance.
                </p>
                <div className="text-[11px] text-stone-400">
                  Confidence: <strong>{stress_prediction.confidence_pct || 88.5}%</strong> • {stress_prediction.model_name}
                </div>
              </div>
            </div>

            {/* Contributing Factor Ranking */}
            <div>
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2.5">
                Top Contributing Stress Factors
              </h3>
              <div className="space-y-2">
                {stress_prediction.contributing_factors && stress_prediction.contributing_factors.map((factor, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-stone-50/80 border border-stone-200/60 text-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold flex items-center justify-center text-[10px]">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-stone-800">{factor.factor}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-stone-700 mr-2">{factor.value}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                        factor.impact === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {factor.impact} Impact
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Explainable AI Box */}
          {stress_prediction.explainability && (
            <div className="mt-6 pt-4 border-t border-stone-100">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Explainable AI Diagnosis</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mb-2 font-medium">
                "{stress_prediction.explainability.what_happened}"
              </p>
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-emerald-900 block text-[11px] uppercase">Recommended Action:</span>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  {stress_prediction.explainability.what_to_do?.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: 4 Dimension Risk Cards & Key Sensors (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 4 Risk Dimension Matrix */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* Heat Risk */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                  stress_prediction.heat_risk_level === 'Extreme' || stress_prediction.heat_risk_level === 'High'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {stress_prediction.heat_risk_level}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 block">Heat Risk</span>
              <span className="text-lg font-heading font-bold text-stone-900">{farm_summary.temperature_c}°C</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">High thermal ceiling</span>
            </div>

            {/* Drought Risk */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Droplets className="w-5 h-5 text-amber-500" />
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                  stress_prediction.drought_risk_level === 'High'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {stress_prediction.drought_risk_level}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 block">Drought Risk</span>
              <span className="text-lg font-heading font-bold text-stone-900">{farm_summary.soil_moisture_pct}%</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Soil root-zone moisture</span>
            </div>

            {/* Rainfall Risk */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <CloudRain className="w-5 h-5 text-sky-500" />
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-700">
                  {stress_prediction.rainfall_risk_level}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 block">Rainfall Deficit</span>
              <span className="text-lg font-heading font-bold text-stone-900">Low Forecast</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">No cloudburst alert</span>
            </div>

            {/* Pest Risk */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <Bug className="w-5 h-5 text-amber-600" />
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-700">
                  {stress_prediction.pest_risk_level}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-stone-500 block">Pest Threat</span>
              <span className="text-lg font-heading font-bold text-stone-900">IPM Watch</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">Scouting recommended</span>
            </div>

          </div>

          {/* Smart Irrigation Advisory Card */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-900 to-emerald-950 text-white shadow-md">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-800 flex items-center justify-center">
                  <Droplets className="w-4 h-4 text-emerald-300" />
                </div>
                <h3 className="text-sm font-heading font-bold tracking-tight">Smart Irrigation Advisor</h3>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                irrigation.priority === 'High' ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {irrigation.priority?.toUpperCase()} PRIORITY
              </span>
            </div>

            <p className="text-xs text-emerald-100 font-medium leading-relaxed mb-3">
              {irrigation.recommendation}
            </p>

            <div className="bg-emerald-800/60 p-3 rounded-xl text-xs space-y-1 border border-emerald-700/50">
              <div className="flex justify-between text-[11px]">
                <span className="text-emerald-300">Optimal Window:</span>
                <span className="font-bold text-white">{irrigation.window_hours}</span>
              </div>
              {irrigation.estimated_water_liters_per_acre > 0 && (
                <div className="flex justify-between text-[11px]">
                  <span className="text-emerald-300">Estimated Water:</span>
                  <span className="font-bold text-white">~{irrigation.estimated_water_liters_per_acre?.toLocaleString()} L / acre</span>
                </div>
              )}
            </div>
          </div>

          {/* Satellite Vegetation Health Mini-Card */}
          {satellite && (
            <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Satellite className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">Satellite Health</h3>
                </div>
                <button
                  onClick={() => onNavigate('satellite')}
                  className="text-xs text-emerald-600 font-semibold hover:underline"
                >
                  View Map →
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-2">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block font-semibold">NDVI</span>
                  <span className="text-sm font-bold text-stone-800">{satellite.ndvi_mean}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block font-semibold">NDWI</span>
                  <span className="text-sm font-bold text-stone-800">{satellite.ndwi_mean}</span>
                </div>
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-400 block font-semibold">Canopy</span>
                  <span className="text-sm font-bold text-emerald-600">{satellite.vegetation_health}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Bottom Row: Suitable Crops & Sowing Window Previews */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Crop Suitability Summary */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Crop Suitability Model</span>
              <h3 className="text-base font-heading font-bold text-stone-900">Top Recommended Crops</h3>
            </div>
            <button
              onClick={() => onNavigate('crop_advisor')}
              className="text-xs font-semibold text-emerald-600 hover:underline"
            >
              Full Analysis →
            </button>
          </div>

          <div className="space-y-3">
            {crop_suitability.slice(0, 3).map((c, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50/70 border border-stone-200/50">
                <div className="flex items-center space-x-3">
                  <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                    #{c.rank}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{c.crop_name}</h4>
                    <span className="text-[11px] text-stone-500">{c.why_suitable}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-600 font-heading">{c.suitability_pct}%</span>
                  <span className="block text-[10px] font-medium text-stone-400">{c.risk_level}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sowing & Fertilizer Guidance Summary */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Agronomic Calendar</span>
                <h3 className="text-base font-heading font-bold text-stone-900">Sowing & Nutrient Windows</h3>
              </div>
              <button
                onClick={() => onNavigate('crop_advisor')}
                className="text-xs font-semibold text-emerald-600 hover:underline"
              >
                Details →
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-amber-900 mb-1">
                  <Calendar className="w-4 h-4 text-amber-700" />
                  <span>Sowing Window: {sowing_window.recommended_window}</span>
                </div>
                <p className="text-xs text-amber-800/90 leading-relaxed">
                  {sowing_window.reason}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Nutrient Guidance ({farm_summary.crop})</span>
                </div>
                <p className="text-xs text-emerald-800/90 leading-relaxed">
                  {fertilizer.suggested_action}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>Soil pH: {farm_summary.soil_ph || 6.8}</span>
            <span>Soil Testing: {fertilizer.has_user_soil_test ? 'Laboratory Card Active' : 'Regional Baseline Used'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
