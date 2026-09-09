import React from 'react';
import {
  Sprout,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Bug,
  Droplets,
  ShieldCheck,
  Compass,
  Info
} from 'lucide-react';

export default function CropAdvisorPage({ analysisData }) {
  if (!analysisData) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
        <Sprout className="w-12 h-12 mx-auto text-emerald-600 mb-3" />
        <h3 className="text-lg font-heading font-bold text-stone-900">Crop Intelligence Pending</h3>
        <p className="text-xs text-stone-500 mt-1">Please analyze your farm data to generate custom crop rankings.</p>
      </div>
    );
  }

  const {
    crop_suitability = [],
    sowing_window = {},
    fertilizer = {},
    pest_advisory = {},
    farm_summary = {}
  } = analysisData;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Sprout className="w-4 h-4" />
          <span>Agronomic Planning & Decision Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
          Crop Suitability, Sowing & Nutrient Advisory
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-3xl">
          Multi-criteria optimization matching soil classification, temperature ranges, moisture retention, and seasonal windows to maximize climate resilience.
        </p>
      </div>

      {/* Top 3 Crop Suitability Cards */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
          Top Ranked Suitable Crops for {farm_summary.soil_type}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {crop_suitability.slice(0, 3).map((crop, idx) => {
            const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : '🥉');
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl bg-white border transition-all ${
                  idx === 0
                    ? 'border-emerald-300 shadow-sm bg-gradient-to-b from-emerald-50/30 to-white'
                    : 'border-stone-200/80 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{medal}</span>
                    <div>
                      <h3 className="text-lg font-heading font-bold text-stone-900">{crop.crop_name}</h3>
                      <span className="text-xs font-semibold text-emerald-600">{crop.suitability_pct}% Match</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                    crop.risk_level.includes('Low') ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {crop.risk_level}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {crop.why_suitable}
                </p>

                <div className="space-y-1.5 text-xs pt-3 border-t border-stone-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-400">Water Demand:</span>
                    <strong className="text-stone-700">{crop.water_requirement}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-400">Climate Fit:</span>
                    <strong className="text-stone-700">{crop.climate_suitability}</strong>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-stone-400">Soil Fit:</span>
                    <strong className="text-stone-700">{crop.soil_suitability}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sowing Calendar Window Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Sowing Recommendation</span>
              <h3 className="text-lg font-heading font-bold text-stone-900">
                Recommended Window: {sowing_window.recommended_window}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            Favorable Agro-Window
          </span>
        </div>

        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-4">
          {sowing_window.reason}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-stone-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
              Favorable Emergence Indicators
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-600">
              {sowing_window.favorable_conditions?.map((fc, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{fc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-start space-x-2.5">
            <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Precautionary Guidance:</strong> {sowing_window.precaution_note}
            </div>
          </div>
        </div>
      </div>

      {/* Fertilizer Decision-Support Module */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Nutrient Stewardship</span>
              <h3 className="text-lg font-heading font-bold text-stone-900">
                Fertilizer & Soil pH Decision Support
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700">
            {fertilizer.has_user_soil_test ? 'Laboratory Soil Card Attached' : 'Standard Agro-Stage Practice'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Nitrogen (N)</span>
            <strong className="text-xs text-stone-800 block mt-1">{fertilizer.nitrogen_status}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Phosphorus (P)</span>
            <strong className="text-xs text-stone-800 block mt-1">{fertilizer.phosphorus_status}</strong>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Potassium (K)</span>
            <strong className="text-xs text-stone-800 block mt-1">{fertilizer.potassium_status}</strong>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 space-y-2 text-xs text-emerald-950">
          <div>
            <strong>pH Diagnostic:</strong> {fertilizer.ph_evaluation}
          </div>
          <div>
            <strong>Application Strategy:</strong> {fertilizer.suggested_action}
          </div>
          <div>
            <strong>Application Timing:</strong> {fertilizer.timing}
          </div>
        </div>

        <p className="text-[11px] text-stone-400 italic">
          {fertilizer.disclaimer}
        </p>
      </div>

      {/* Pest and Disease Risk Early-Warning Module */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Early Warning Surveillance</span>
              <h3 className="text-lg font-heading font-bold text-stone-900">
                Pest & Pathogen Environmental Vulnerability
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
            Risk: {pest_advisory.pest_risk_level}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
          <h4 className="font-bold text-stone-800 text-sm">{pest_advisory.possible_concern}</h4>
          
          <div className="text-stone-600">
            <strong>Contributing Weather Trigger:</strong>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              {pest_advisory.risk_factors?.map((rf, i) => <li key={i}>{rf}</li>)}
            </ul>
          </div>
        </div>

        {/* IPM First Principles */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
            Priority 1: Integrated Pest Management (IPM) & Biological Controls
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {pest_advisory.ipm_strategy?.map((strat, i) => (
              <div key={i} className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{strat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Regulated Active Ingredient & Warning */}
        {pest_advisory.recommended_active_ingredient && (
          <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-rose-900 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Targeted Active Ingredient Guidance (Only if threshold is breached)</span>
            </div>
            <p className="text-stone-800 font-medium">
              Registered Formulation: <strong>{pest_advisory.recommended_active_ingredient}</strong>
            </p>
            <div className="p-3 rounded-xl bg-white/80 border border-rose-200 text-[11px] text-rose-800 leading-relaxed">
              {pest_advisory.regulatory_warning}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
