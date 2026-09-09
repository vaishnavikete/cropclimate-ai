import React, { useState } from 'react';
import {
  FlaskConical,
  Droplets,
  Thermometer,
  CloudRain,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export default function FarmAnalysisPage({
  analysisData,
  onAnalyze,
  isAnalyzing,
  constants
}) {
  const defaultState = {
    location_name: 'Baramati, Pune',
    state: 'Maharashtra',
    district: 'Pune',
    crop_name: 'Soybean',
    soil_type: 'Black Soil (Regur)',
    soil_moisture_pct: 21.0,
    soil_ph: 6.8,
    soil_n: '',
    soil_p: '',
    soil_k: '',
    temperature_c: 38.0,
    humidity_pct: 35.0,
    rainfall_mm: 0.0,
    forecast_rainfall_mm: 1.2,
    growth_stage: 'Flowering',
    sowing_date: '2026-06-25',
    has_irrigation: true,
    satellite_ndvi: 0.42,
    satellite_ndwi: -0.15
  };

  const [formData, setFormData] = useState(defaultState);

  const availableStates = constants?.states ? Object.keys(constants.states) : ['Maharashtra', 'Punjab', 'Tamil Nadu', 'Karnataka', 'Madhya Pradesh'];
  const availableDistricts = (constants?.states && constants.states[formData.state]) ? constants.states[formData.state] : ['Pune', 'Nashik', 'Nagpur'];
  const availableCrops = constants?.crops || ['Soybean', 'Wheat', 'Rice', 'Cotton', 'Maize', 'Groundnut', 'Chickpea', 'Sugarcane', 'Tomato', 'Onion'];
  const availableSoils = constants?.soil_types || ['Black Soil (Regur)', 'Alluvial Soil', 'Red and Yellow Soil', 'Laterite Soil', 'Sandy Loam', 'Clay Loam'];

  const growthStages = ['Germination', 'Vegetative', 'Flowering', 'Pod/Grain Filling', 'Maturity'];

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const districts = constants?.states?.[newState] || [];
    setFormData(prev => ({
      ...prev,
      state: newState,
      district: districts[0] || 'District',
      location_name: `${districts[0] || 'District'}, ${newState}`
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      soil_moisture_pct: parseFloat(formData.soil_moisture_pct),
      soil_ph: parseFloat(formData.soil_ph),
      temperature_c: parseFloat(formData.temperature_c),
      humidity_pct: parseFloat(formData.humidity_pct),
      rainfall_mm: parseFloat(formData.rainfall_mm || 0),
      forecast_rainfall_mm: parseFloat(formData.forecast_rainfall_mm || 0),
      soil_n: formData.soil_n ? parseFloat(formData.soil_n) : null,
      soil_p: formData.soil_p ? parseFloat(formData.soil_p) : null,
      soil_k: formData.soil_k ? parseFloat(formData.soil_k) : null,
      satellite_ndvi: formData.satellite_ndvi ? parseFloat(formData.satellite_ndvi) : null,
      satellite_ndwi: formData.satellite_ndwi ? parseFloat(formData.satellite_ndwi) : null,
    };
    onAnalyze(payload);
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <FlaskConical className="w-4 h-4" />
          <span>Farm Decision-Support Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
          Comprehensive Farm Data Input & Analysis
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-3xl">
          Enter field measurements, soil conditions, and micro-climate indicators. Our agronomic ML pipeline will predict physiological crop stress and synthesize explainable climate-smart recommendations.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-6">
        
        {/* Section 1: Location & Crop Identity */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            1. Geographic & Crop Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">State</label>
              <select
                value={formData.state}
                onChange={handleStateChange}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableStates.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">District / Taluka</label>
              <select
                value={formData.district}
                onChange={(e) => setFormData(p => ({ ...p, district: e.target.value, location_name: `${e.target.value}, ${p.state}` }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableDistricts.map(dt => <option key={dt} value={dt}>{dt}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Village / Specific Farm</label>
              <input
                type="text"
                value={formData.location_name}
                onChange={(e) => setFormData(p => ({ ...p, location_name: e.target.value }))}
                placeholder="e.g. Baramati Village"
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Cultivated Crop</label>
              <select
                value={formData.crop_name}
                onChange={(e) => setFormData(p => ({ ...p, crop_name: e.target.value }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-stone-800"
              >
                {availableCrops.map(cr => <option key={cr} value={cr}>{cr}</option>)}
              </select>
            </div>

          </div>
        </div>

        {/* Section 2: Soil Characteristics & Root-Zone Hydration */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            2. Soil Characteristics & Moisture Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Soil Classification</label>
              <select
                value={formData.soil_type}
                onChange={(e) => setFormData(p => ({ ...p, soil_type: e.target.value }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {availableSoils.map(sl => <option key={sl} value={sl}>{sl}</option>)}
              </select>
            </div>

            {/* Soil Moisture Slider with live percentage */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-stone-700">Soil Moisture (%)</label>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  formData.soil_moisture_pct < 25 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {formData.soil_moisture_pct}% (Volumetric)
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="90"
                step="1"
                value={formData.soil_moisture_pct}
                onChange={(e) => setFormData(p => ({ ...p, soil_moisture_pct: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>5% (Dry Wilting)</span>
                <span>35% (Field Cap)</span>
                <span>90% (Saturated)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Soil pH</label>
              <input
                type="number"
                step="0.1"
                min="4.0"
                max="9.5"
                value={formData.soil_ph}
                onChange={(e) => setFormData(p => ({ ...p, soil_ph: parseFloat(e.target.value) }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
              <span className="text-[10px] text-stone-400 mt-1 block">Optimal neutral: 6.5 – 7.5</span>
            </div>

          </div>

          {/* Optional NPK Test Inputs */}
          <div className="mt-4 p-4 rounded-2xl bg-stone-50/60 border border-stone-200/60">
            <span className="text-xs font-bold text-stone-700 block mb-1">
              🧪 Laboratory Soil Test (Optional N/P/K in kg/ha)
            </span>
            <p className="text-[11px] text-stone-500 mb-3">
              Leave blank if a certified laboratory Soil Health Card test is unavailable. The system will not fabricate unverified values.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Nitrogen (N)</label>
                <input
                  type="number"
                  placeholder="e.g. 185"
                  value={formData.soil_n}
                  onChange={(e) => setFormData(p => ({ ...p, soil_n: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-stone-200 p-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Phosphorus (P)</label>
                <input
                  type="number"
                  placeholder="e.g. 16"
                  value={formData.soil_p}
                  onChange={(e) => setFormData(p => ({ ...p, soil_p: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-stone-200 p-2 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Potassium (K)</label>
                <input
                  type="number"
                  placeholder="e.g. 220"
                  value={formData.soil_k}
                  onChange={(e) => setFormData(p => ({ ...p, soil_k: e.target.value }))}
                  className="w-full text-xs rounded-lg border border-stone-200 p-2 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Ambient Weather & Phenology */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4 flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-rose-500" />
            3. Weather Readings & Phenological Stage
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Temperature (°C)</label>
              <input
                type="number"
                step="0.5"
                value={formData.temperature_c}
                onChange={(e) => setFormData(p => ({ ...p, temperature_c: parseFloat(e.target.value) }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Humidity (%)</label>
              <input
                type="number"
                step="1"
                min="5"
                max="100"
                value={formData.humidity_pct}
                onChange={(e) => setFormData(p => ({ ...p, humidity_pct: parseFloat(e.target.value) }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Rainfall Past 24h (mm)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.rainfall_mm}
                onChange={(e) => setFormData(p => ({ ...p, rainfall_mm: parseFloat(e.target.value) }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Forecast Rain 48h (mm)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={formData.forecast_rainfall_mm}
                onChange={(e) => setFormData(p => ({ ...p, forecast_rainfall_mm: parseFloat(e.target.value) }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Growth Stage</label>
              <select
                value={formData.growth_stage}
                onChange={(e) => setFormData(p => ({ ...p, growth_stage: e.target.value }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold text-stone-800"
              >
                {growthStages.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Sowing Date</label>
              <input
                type="date"
                value={formData.sowing_date}
                onChange={(e) => setFormData(p => ({ ...p, sowing_date: e.target.value }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col justify-end">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Irrigation Infrastructure</label>
              <div className="flex items-center space-x-3 h-10">
                <label className="flex items-center space-x-1.5 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="irrigation"
                    checked={formData.has_irrigation === true}
                    onChange={() => setFormData(p => ({ ...p, has_irrigation: true }))}
                    className="accent-emerald-600"
                  />
                  <span>Yes (Canal/Borewell)</span>
                </label>
                <label className="flex items-center space-x-1.5 text-xs font-medium text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="irrigation"
                    checked={formData.has_irrigation === false}
                    onChange={() => setFormData(p => ({ ...p, has_irrigation: false }))}
                    className="accent-emerald-600"
                  />
                  <span>No (Rainfed)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Satellite NDVI (Optional)</label>
              <input
                type="number"
                step="0.01"
                min="0.0"
                max="1.0"
                placeholder="e.g. 0.42"
                value={formData.satellite_ndvi || ''}
                onChange={(e) => setFormData(p => ({ ...p, satellite_ndvi: e.target.value }))}
                className="w-full text-xs sm:text-sm rounded-xl border border-stone-200 p-2.5 bg-stone-50/50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

          </div>
        </div>

        {/* Submit Action Button */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-stone-500">
            Clicking Analyze executes the multi-factor agronomic ML model.
          </span>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-heading font-bold text-sm rounded-2xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center space-x-2"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{isAnalyzing ? 'Evaluating Agronomic Rules...' : 'ANALYZE FARM'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </form>

      {/* Analysis Results View */}
      {analysisData && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Analysis Outcome</span>
              <h2 className="text-xl sm:text-2xl font-heading font-bold text-stone-900">
                Agronomic Evaluation Report
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              Evaluated: {new Date(analysisData.created_at).toLocaleTimeString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Stress Probability Card */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Crop Stress Probability</span>
              <div className="flex items-baseline space-x-2 mt-2">
                <span className="text-3xl font-heading font-extrabold text-stone-900">
                  {analysisData.stress_prediction.stress_probability}%
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  analysisData.stress_prediction.risk_level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {analysisData.stress_prediction.risk_level} Risk
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-2">
                {analysisData.stress_prediction.explainability.what_happened}
              </p>
            </div>

            {/* Smart Irrigation Card */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Irrigation Action</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {analysisData.irrigation.priority}
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-2">
                {analysisData.irrigation.window_hours}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                {analysisData.irrigation.recommendation}
              </p>
            </div>

            {/* Pest & Disease Early Warning */}
            <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pest Risk (IPM First)</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {analysisData.pest_advisory.pest_risk_level} Risk
                </span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-2">
                {analysisData.pest_advisory.possible_concern}
              </h4>
              <p className="text-xs text-stone-600 mt-1">
                Strategy: {analysisData.pest_advisory.ipm_strategy[0]}
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
