import datetime
import requests
from typing import Dict, Any, List
from app.config import settings
from app.schemas.all_schemas import WeatherAnalysisResponse, DailyWeatherForecast

class WeatherService:
    @staticmethod
    def get_weather(
        latitude: float = 18.5204,
        longitude: float = 73.8567,
        location_name: str = "Pune, Maharashtra"
    ) -> WeatherAnalysisResponse:
        """
        Fetches live 7-day forecast from Open-Meteo API.
        Falls back to resilient agro-meteorological simulation if network fails.
        """
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
                "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
                "timezone": "auto"
            }
            res = requests.get(settings.OPEN_METEO_BASE_URL, params=params, timeout=5)
            if res.status_code == 200:
                data = res.json()
                current = data.get("current", {})
                daily = data.get("daily", {})

                curr_temp = current.get("temperature_2m", 32.0)
                curr_hum = current.get("relative_humidity_2m", 50.0)
                curr_wind = current.get("wind_speed_10m", 12.0)
                curr_rain = current.get("precipitation", 0.0)

                dates = daily.get("time", [])
                max_temps = daily.get("temperature_2m_max", [])
                min_temps = daily.get("temperature_2m_min", [])
                precips = daily.get("precipitation_sum", [])
                rain_probs = daily.get("precipitation_probability_max", [])
                wind_speeds = daily.get("wind_speed_10m_max", [])

                forecast_list: List[DailyWeatherForecast] = []
                for i in range(min(7, len(dates))):
                    d_str = dates[i]
                    dt = datetime.datetime.strptime(d_str, "%Y-%m-%d")
                    t_max = max_temps[i] if i < len(max_temps) else curr_temp + 2
                    t_min = min_temps[i] if i < len(min_temps) else curr_temp - 6
                    pr = precips[i] if i < len(precips) else 0.0
                    pr_prob = rain_probs[i] if i < len(rain_probs) else 10.0
                    ws = wind_speeds[i] if i < len(wind_speeds) else 12.0

                    cond = "Sunny" if pr < 1.0 and t_max > 32 else ("Rainy" if pr >= 5.0 else "Partly Cloudy")

                    forecast_list.append(DailyWeatherForecast(
                        date=d_str,
                        day_name=dt.strftime("%a"),
                        temp_max=round(t_max, 1),
                        temp_min=round(t_min, 1),
                        precipitation_mm=round(pr, 1),
                        rain_probability_pct=round(pr_prob, 1),
                        humidity_pct=round(curr_hum, 1),
                        wind_speed_kmh=round(ws, 1),
                        condition=cond
                    ))

                # Calculate Risk Ratings
                avg_max = sum(f.temp_max for f in forecast_list) / max(1, len(forecast_list))
                total_rain = sum(f.precipitation_mm for f in forecast_list)

                heat_risk = "Extreme" if avg_max >= 40.0 else ("High" if avg_max >= 36.0 else ("Moderate" if avg_max >= 31.0 else "Low"))
                drought_risk = "High" if (total_rain < 5.0 and avg_max > 34.0) else ("Moderate" if total_rain < 15.0 else "Low")
                rain_risk = "High" if total_rain > 70.0 else ("Moderate" if total_rain > 30.0 else "Low")

                heatwave_prob = min(95.0, max(5.0, (avg_max - 30.0) * 8.0)) if avg_max > 30 else 5.0
                risk_score = round(min(100.0, (avg_max / 45.0 * 40.0) + (40.0 if drought_risk == "High" else 15.0) + (15.0 if rain_risk == "High" else 5.0)), 1)

                return WeatherAnalysisResponse(
                    location=location_name,
                    latitude=latitude,
                    longitude=longitude,
                    current_temperature=round(curr_temp, 1),
                    current_humidity=round(curr_hum, 1),
                    current_wind_speed_kmh=round(curr_wind, 1),
                    current_rainfall_mm=round(curr_rain, 1),
                    heat_risk=heat_risk,
                    drought_risk=drought_risk,
                    rainfall_risk=rain_risk,
                    heatwave_probability_pct=round(heatwave_prob, 1),
                    overall_weather_risk_score=risk_score,
                    forecast_7_days=forecast_list,
                    source="Live Open-Meteo Satellite & Meteorological Model"
                )
        except Exception:
            pass

        # Resilient Simulated Agro-Weather Fallback
        today = datetime.date.today()
        fallback_forecast = []
        base_temp = 35.0
        for i in range(7):
            day_dt = today + datetime.timedelta(days=i)
            day_temp_max = base_temp + (i % 3) - 1.0
            day_temp_min = day_temp_max - 12.0
            day_rain = 0.0 if i < 4 else (12.0 if i == 5 else 3.0)
            fallback_forecast.append(DailyWeatherForecast(
                date=day_dt.strftime("%Y-%m-%d"),
                day_name=day_dt.strftime("%a"),
                temp_max=round(day_temp_max, 1),
                temp_min=round(day_temp_min, 1),
                precipitation_mm=day_rain,
                rain_probability_pct=15.0 if day_rain == 0 else 65.0,
                humidity_pct=42.0,
                wind_speed_kmh=14.0,
                condition="Sunny" if day_rain == 0 else "Scattered Showers"
            ))

        return WeatherAnalysisResponse(
            location=location_name,
            latitude=latitude,
            longitude=longitude,
            current_temperature=36.0,
            current_humidity=40.0,
            current_wind_speed_kmh=14.0,
            current_rainfall_mm=0.0,
            heat_risk="High",
            drought_risk="Moderate",
            rainfall_risk="Low",
            heatwave_probability_pct=65.0,
            overall_weather_risk_score=72.0,
            forecast_7_days=fallback_forecast,
            source="CropClimate Weather Engine (Offline Agro-Meteorological Fallback)"
        )
