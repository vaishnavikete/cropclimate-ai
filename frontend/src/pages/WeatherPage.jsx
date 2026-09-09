import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Flame,
  Sun,
  AlertTriangle,
  Compass,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { getWeather } from '../services/api';

export default function WeatherPage({ currentFarm }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const lat = currentFarm?.latitude || 18.5204;
  const lon = currentFarm?.longitude || 73.8567;
  const loc = currentFarm?.location_name || 'Pune, Maharashtra';

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getWeather(lat, lon, loc)
      .then(data => {
        if (isMounted) {
          setWeather(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load weather:", err);
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, [lat, lon, loc]);

  if (loading || !weather) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
        <CloudSun className="w-12 h-12 mx-auto text-emerald-600 animate-bounce mb-3" />
        <h3 className="text-lg font-heading font-bold text-stone-900">Gathering Agro-Meteorological Data...</h3>
        <p className="text-xs text-stone-500 mt-1">Connecting to Open-Meteo satellite & numerical weather models.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4" />
            <span>Agro-Meteorological Risk Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-stone-900">
            Weather Intelligence & 7-Day Forecast
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Location: <strong className="text-stone-700">{weather.location}</strong> ({lat.toFixed(2)}°N, {lon.toFixed(2)}°E) • Source: {weather.source}
          </p>
        </div>
        <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          Live Sync Active
        </span>
      </div>

      {/* Top Cards: Current Metrics & Heat/Drought Risk Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Current Temperature Card */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
            <span>Current Temperature</span>
            <Thermometer className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-extrabold text-stone-900">{weather.current_temperature}°C</span>
            <span className="text-xs text-stone-400 font-medium">Ambient</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Peak expected: {weather.forecast_7_days[0]?.temp_max}°C
          </span>
        </div>

        {/* Humidity & Evapotranspiration */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
            <span>Relative Humidity</span>
            <Droplets className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-extrabold text-stone-900">{weather.current_humidity}%</span>
            <span className="text-xs text-stone-400 font-medium">RH</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Wind: {weather.current_wind_speed_kmh} km/h
          </span>
        </div>

        {/* Heatwave Probability Indicator */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
            <span>Heatwave Risk</span>
            <Flame className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-extrabold text-rose-600">{weather.heat_risk}</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Heatwave Index: {weather.heatwave_probability_pct}%
          </span>
        </div>

        {/* Drought & Rainfall Risk */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold mb-2">
            <span>Drought Stress Risk</span>
            <CloudRain className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-heading font-extrabold text-amber-600">{weather.drought_risk}</span>
          </div>
          <span className="text-[11px] text-stone-500 mt-1 block">
            Weather Risk Score: {weather.overall_weather_risk_score} / 100
          </span>
        </div>

      </div>

      {/* 7-Day Weather Forecast Timeline */}
      <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-4">
          7-Day Agro-Meteorological Outlook
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {weather.forecast_7_days.map((day, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                idx === 0
                  ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                  : 'bg-stone-50/60 border-stone-200/70 hover:bg-white'
              }`}
            >
              <span className="text-xs font-bold text-stone-700 block mb-0.5">
                {idx === 0 ? 'Today' : day.day_name}
              </span>
              <span className="text-[10px] text-stone-400 block mb-2">{day.date.slice(5)}</span>

              <div className="my-2">
                {day.precipitation_mm > 5 ? (
                  <CloudRain className="w-6 h-6 mx-auto text-sky-600" />
                ) : (
                  <Sun className="w-6 h-6 mx-auto text-amber-500" />
                )}
              </div>

              <div className="text-xs font-bold text-stone-800 mt-1">
                {day.temp_max}° <span className="text-stone-400 font-normal">{day.temp_min}°</span>
              </div>

              <div className="text-[10px] text-sky-700 font-medium mt-1">
                {day.precipitation_mm > 0 ? `${day.precipitation_mm} mm` : '0 mm'}
              </div>

              <div className="text-[9px] text-stone-400 mt-0.5">
                {day.rain_probability_pct}% rain
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
