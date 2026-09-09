import React, { useState } from 'react';
import {
  Satellite,
  Upload,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Eye,
  Sliders,
  Info,
  MapPin,
  RefreshCw
} from 'lucide-react';

export default function SatellitePage({ satelliteData, onRunSatelliteAnalysis }) {
  const [activeTab, setActiveTab] = useState('demo'); // 'upload' | 'demo'
  const [scenario, setScenario] = useState('moderate_stress');
  const [customNdvi, setCustomNdvi] = useState(0.42);
  const [customNdwi, setCustomNdwi] = useState(-0.15);
  const [viewMode, setViewMode] = useState('current'); // 'current' | 'compare'

  // Default values if not provided
  const metrics = satelliteData || {
    ndvi_mean: 0.42,
    ndwi_mean: -0.15,
    evi_mean: 0.35,
    vegetation_health: 'Moderate Health',
    water_stress_level: 'High Water Stress',
    crop_stress_estimate_pct: 71.0,
    healthy_pct: 45.0,
    moderate_stress_pct: 35.0,
    high_stress_pct: 20.0,
    abnormal_zones_detected: true,
    legend: {
      "Healthy (NDVI > 0.60)": "#10B981",
      "Moderate Stress (0.40 <= NDVI < 0.60)": "#F59E0B",
      "High Stress (NDVI < 0.40)": "#EF4444"
    },
    disclaimer: "Satellite vegetation indices reflect canopy vigor and moisture absorption. They indicate vegetation vigor and hydration deficits, not microscopic pathogen diagnosis."
  };

  const handleScenarioChange = (s) => {
    setScenario(s);
    if (s === 'healthy') {
      setCustomNdvi(0.72);
      setCustomNdwi(0.24);
    } else if (s === 'high_stress') {
      setCustomNdvi(0.28);
      setCustomNdwi(-0.35);
    } else {
      setCustomNdvi(0.42);
      setCustomNdwi(-0.15);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
          <Satellite className="w-4 h-4" />
          <span>Multispectral Earth Observation Studio</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
          Satellite Canopy Vigor & Water Stress Detection
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-3xl">
          Processes Sentinel-2 & Landsat spectral bands to compute NDVI (Normalized Difference Vegetation Index), NDWI (Moisture Absorption), and EVI. Pinpoints localized vegetation stress zones across farm parcels.
        </p>
      </div>

      {/* Critical Scientific Disclaimer Alert */}
      <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200 text-stone-700 text-xs flex items-start space-x-3">
        <Info className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Scientific Principle:</strong> Satellite imagery measures spectral reflectance (chlorophyll absorption & cell structure water content). It is highly effective at identifying <em>vegetation vigor anomalies and water stress zones</em>, but cannot alone diagnose specific microscopic plant pathogens or prescribe specific chemical pesticides.
        </div>
      </div>

      {/* Mode Controls & Scenario Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive Control Panel (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Analysis Input Mode
            </h3>

            {/* Input Selection Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                onClick={() => setActiveTab('demo')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'demo' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Sentinel-2 Presets
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'upload' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                }`}
              >
                Custom / Upload
              </button>
            </div>

            {activeTab === 'demo' ? (
              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-stone-700">Simulated Field Scenario</label>
                <div className="space-y-2">
                  <button
                    onClick={() => handleScenarioChange('moderate_stress')}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      scenario === 'moderate_stress'
                        ? 'border-amber-400 bg-amber-50/70 text-amber-900 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Baramati Soybean (Pune)</div>
                    <div className="text-[11px] opacity-80">Moderate canopy stress (NDVI 0.42, Water Deficit)</div>
                  </button>

                  <button
                    onClick={() => handleScenarioChange('healthy')}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      scenario === 'healthy'
                        ? 'border-emerald-400 bg-emerald-50/70 text-emerald-900 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Thanjavur Delta Rice</div>
                    <div className="text-[11px] opacity-80">Vigorous vegetative canopy (NDVI 0.72, Well Hydrated)</div>
                  </button>

                  <button
                    onClick={() => handleScenarioChange('high_stress')}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      scenario === 'high_stress'
                        ? 'border-rose-400 bg-rose-50/70 text-rose-900 font-semibold'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="font-bold">Marathwada Rainfed Parcel</div>
                    <div className="text-[11px] opacity-80">Severe drought wilting (NDVI 0.28, High Water Stress)</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-2xl border-2 border-dashed border-stone-200 text-center cursor-pointer hover:border-emerald-500 transition-all bg-stone-50/50">
                  <Upload className="w-6 h-6 mx-auto text-stone-400 mb-1.5" />
                  <span className="text-xs font-semibold text-stone-700 block">Upload Satellite GeoTIFF / Image</span>
                  <span className="text-[10px] text-stone-400">Supports .tif, .png, .jpg (Max 15MB)</span>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                    <span>Simulate NDVI: {customNdvi}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.02"
                    value={customNdvi}
                    onChange={(e) => setCustomNdvi(parseFloat(e.target.value))}
                    className="w-full accent-emerald-600"
                  />
                </div>
              </div>
            )}

            {/* View Mode Toggle: Single vs Before/After */}
            <div className="pt-3 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Temporal Comparison</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setViewMode('current')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    viewMode === 'current'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Latest Pass
                </button>
                <button
                  onClick={() => setViewMode('compare')}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    viewMode === 'compare'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  Before vs After
                </button>
              </div>
            </div>

          </div>

          {/* Key Spectral Metric Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Mean NDVI</span>
              <span className="text-xl font-heading font-extrabold text-stone-900 mt-1 block">{customNdvi}</span>
              <span className="text-[10px] text-stone-500">Vegetation vigor index</span>
            </div>
            <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Mean NDWI</span>
              <span className="text-xl font-heading font-extrabold text-stone-900 mt-1 block">{customNdwi}</span>
              <span className="text-[10px] text-stone-500">Canopy water absorption</span>
            </div>
          </div>

        </div>

        {/* Right Geospatial Visualizer & Stress Distribution (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Spatial Canopy Distribution</span>
                <h3 className="text-base font-heading font-bold text-stone-900">
                  {viewMode === 'compare' ? 'Temporal Vegetation Comparison (30-Day Shift)' : 'Zonal Health & Water Stress Heatmap'}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Sentinel-2 L2A Resolution: 10m
              </span>
            </div>

            {/* Visual Canvas Representation */}
            {viewMode === 'current' ? (
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 aspect-video flex items-center justify-center p-4">
                {/* Simulated Heatmap Matrix */}
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-950 via-amber-950 to-stone-900 p-6 flex flex-col justify-between relative overflow-hidden">
                  
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                  <div className="relative z-10 flex justify-between items-start">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs">
                      <span className="text-stone-400 block text-[10px]">PARCEL ID:</span>
                      <strong className="font-mono">MH-PUN-BAR-4029</strong>
                    </div>
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-right text-xs">
                      <span className="text-stone-400 block text-[10px]">ESTIMATED CROP STRESS:</span>
                      <strong className={`font-mono text-sm ${customNdvi < 0.4 ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {customNdvi < 0.4 ? '78%' : (customNdvi < 0.6 ? '48%' : '18%')}
                      </strong>
                    </div>
                  </div>

                  {/* Visual Canopy Map Representation with dynamic zones */}
                  <div className="relative z-10 my-auto grid grid-cols-5 gap-2 max-w-lg mx-auto w-full opacity-85">
                    {[...Array(15)].map((_, i) => {
                      const isHighStress = customNdvi < 0.45 && (i % 3 === 0);
                      const isModStress = (i % 2 === 0);
                      const bg = isHighStress ? 'bg-rose-500/80 shadow-rose-500/50' : (isModStress ? 'bg-amber-400/80 shadow-amber-400/50' : 'bg-emerald-500/80 shadow-emerald-500/50');
                      return (
                        <div
                          key={i}
                          className={`h-8 sm:h-12 rounded-lg ${bg} shadow-xs border border-white/20 transition-all duration-500 hover:scale-105 flex items-center justify-center text-[10px] text-white font-mono font-bold`}
                        >
                          {(customNdvi + (i * 0.01 - 0.07)).toFixed(2)}
                        </div>
                      );
                    })}
                  </div>

                  <div className="relative z-10 flex justify-between items-end text-[11px] text-stone-300">
                    <span>Coordinates: 18.1524° N, 74.5772° E</span>
                    <span>Cloud Cover: &lt;2.1%</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Before vs After Temporal View */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 30 Days Ago */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-stone-600">30 Days Ago (Early Vegetative)</span>
                    <span className="text-xs font-mono font-bold text-emerald-600">NDVI: 0.65</span>
                  </div>
                  <div className="aspect-square rounded-xl bg-emerald-900/80 p-3 flex flex-col justify-between border border-emerald-700/50">
                    <span className="text-[10px] text-emerald-200 uppercase font-mono">Status: Robust Canopy</span>
                    <div className="grid grid-cols-3 gap-1.5 opacity-90 my-auto">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className="h-8 rounded bg-emerald-500 border border-emerald-300/40" />
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-300">Water Stress: Low</span>
                  </div>
                </div>

                {/* Current Pass */}
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-stone-600">Current Acquisition (Flowering)</span>
                    <span className={`text-xs font-mono font-bold ${customNdvi < 0.45 ? 'text-rose-600' : 'text-amber-600'}`}>
                      NDVI: {customNdvi}
                    </span>
                  </div>
                  <div className="aspect-square rounded-xl bg-stone-900 p-3 flex flex-col justify-between border border-stone-700">
                    <span className="text-[10px] text-rose-300 uppercase font-mono">Status: Water Loss Detected</span>
                    <div className="grid grid-cols-3 gap-1.5 opacity-90 my-auto">
                      {[...Array(9)].map((_, i) => (
                        <div key={i} className={`h-8 rounded ${i % 2 === 0 ? 'bg-amber-500' : 'bg-rose-500'} border border-white/20`} />
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-300">Water Stress: High Deficit</span>
                  </div>
                </div>

              </div>
            )}

            {/* Zonal Breakdown Statistics Bar */}
            <div className="mt-6 pt-4 border-t border-stone-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Zonal Distribution Legend & Proportions
              </h4>
              
              <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner">
                <div style={{ width: `${metrics.healthy_pct}%` }} className="bg-emerald-500 h-full" title={`Healthy: ${metrics.healthy_pct}%`} />
                <div style={{ width: `${metrics.moderate_stress_pct}%` }} className="bg-amber-400 h-full" title={`Moderate Stress: ${metrics.moderate_stress_pct}%`} />
                <div style={{ width: `${metrics.high_stress_pct}%` }} className="bg-rose-500 h-full" title={`High Stress: ${metrics.high_stress_pct}%`} />
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-stone-600">Healthy (NDVI &gt; 0.60): <strong>{metrics.healthy_pct}%</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-stone-600">Moderate Stress (0.40–0.60): <strong>{metrics.moderate_stress_pct}%</strong></span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0" />
                  <span className="text-stone-600">High Stress (NDVI &lt; 0.40): <strong>{metrics.high_stress_pct}%</strong></span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
