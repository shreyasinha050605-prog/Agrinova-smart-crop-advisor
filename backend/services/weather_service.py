import json
import logging
import os
from functools import lru_cache
from pathlib import Path
from typing import Any

import requests

LOGGER = logging.getLogger(__name__)
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
DEFAULT_TEMPERATURE = 28.0
DEFAULT_HUMIDITY = 65.0
FORECAST_WINDOW_DAYS = 5
MONTH_DAYS = 30

STATE_TO_PRIMARY_CITY = {
    "Andhra Pradesh": "Amaravati",
    "Arunachal Pradesh": "Itanagar",
    "Assam": "Guwahati",
    "Bihar": "Patna",
    "Chhattisgarh": "Raipur",
    "Goa": "Panaji",
    "Gujarat": "Ahmedabad",
    "Haryana": "Chandigarh",
    "Himachal Pradesh": "Shimla",
    "Jharkhand": "Ranchi",
    "Karnataka": "Bengaluru",
    "Kerala": "Thiruvananthapuram",
    "Madhya Pradesh": "Bhopal",
    "Maharashtra": "Mumbai",
    "Manipur": "Imphal",
    "Meghalaya": "Shillong",
    "Mizoram": "Aizawl",
    "Nagaland": "Kohima",
    "Odisha": "Bhubaneswar",
    "Punjab": "Chandigarh",
    "Rajasthan": "Jaipur",
    "Sikkim": "Gangtok",
    "Tamil Nadu": "Chennai",
    "Telangana": "Hyderabad",
    "Tripura": "Agartala",
    "Uttar Pradesh": "Lucknow",
    "Uttarakhand": "Dehradun",
    "West Bengal": "Kolkata",
    "Andaman and Nicobar Islands": "Port Blair",
    "Chandigarh": "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu": "Daman",
    "Delhi": "New Delhi",
    "Jammu and Kashmir": "Srinagar",
    "Ladakh": "Leh",
    "Lakshadweep": "Kavaratti",
    "Puducherry": "Puducherry",
}


def _load_env_file() -> None:
    """Load .env values in local/dev runs without extra dependency."""
    env_path = Path(__file__).resolve().parents[2] / ".env"
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


@lru_cache(maxsize=1)
def _rainfall_dataset() -> dict[str, float]:
    data_path = Path(__file__).resolve().parents[1] / "data" / "rainfall_by_state.json"
    with data_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def get_fallback_rainfall(state: str | None) -> float:
    if not state:
        return 0.0

    annual_rainfall = _rainfall_dataset().get(state, 0.0)
    # Convert annual mm to a monthly estimate.
    return round(float(annual_rainfall) / 12.0, 2)


def _to_monthly_rainfall(total_rainfall_for_forecast_window: float) -> float:
    """Normalize 5-day forecast rainfall to monthly mm."""
    return round(float(total_rainfall_for_forecast_window) * (MONTH_DAYS / FORECAST_WINDOW_DAYS), 2)


def compute_avg_weather(data: dict[str, Any]) -> tuple[float, float, float]:
    forecast_items = data.get("list", [])
    if not forecast_items:
        raise ValueError("Forecast payload is missing list entries.")

    total_temp = 0.0
    total_humidity = 0.0
    total_rainfall = 0.0

    for item in forecast_items:
        main = item.get("main", {})
        total_temp += float(main.get("temp", 0.0))
        total_humidity += float(main.get("humidity", 0.0))
        total_rainfall += float(item.get("rain", {}).get("3h", 0.0))

    points = len(forecast_items)
    avg_temp = round(total_temp / points, 2)
    avg_humidity = round(total_humidity / points, 2)
    total_rainfall = round(total_rainfall, 2)
    return avg_temp, avg_humidity, total_rainfall


def get_forecast_weather(city: str, state: str | None = None) -> dict[str, Any]:
    _load_env_file()
    api_key = os.getenv("OPENWEATHER_API_KEY")
    resolved_city = city or STATE_TO_PRIMARY_CITY.get(state or "", "")

    if not resolved_city:
        fallback_rainfall = get_fallback_rainfall(state)
        return {
            "temperature": DEFAULT_TEMPERATURE,
            "humidity": DEFAULT_HUMIDITY,
            "rainfall": fallback_rainfall,
            "rainfall_mm_per_month": fallback_rainfall,
            "source": "fallback",
        }

    try:
        if not api_key:
            raise RuntimeError("OPENWEATHER_API_KEY is missing")

        response = requests.get(
            FORECAST_URL,
            params={"q": resolved_city, "appid": api_key, "units": "metric"},
            timeout=10,
        )
        response.raise_for_status()
        payload = response.json()

        avg_temp, avg_humidity, total_rainfall = compute_avg_weather(payload)
        monthly_rainfall = _to_monthly_rainfall(total_rainfall)
        source = "forecast"

        if monthly_rainfall == 0:
            monthly_rainfall = get_fallback_rainfall(state)
            source = "fallback"
            LOGGER.info("Using fallback rainfall for state=%s city=%s", state, resolved_city)
            print("Using fallback rainfall")
        else:
            LOGGER.info("Using forecast rainfall for city=%s", resolved_city)
            print("Using forecast rainfall")

        return {
            "temperature": avg_temp,
            "humidity": avg_humidity,
            "rainfall": monthly_rainfall,
            "rainfall_mm_per_month": monthly_rainfall,
            "source": source,
        }
    except Exception:
        LOGGER.exception("Failed to fetch forecast weather for city=%s state=%s", resolved_city, state)
        fallback_rainfall = get_fallback_rainfall(state)
        return {
            "temperature": DEFAULT_TEMPERATURE,
            "humidity": DEFAULT_HUMIDITY,
            "rainfall": fallback_rainfall,
            "rainfall_mm_per_month": fallback_rainfall,
            "source": "fallback",
        }
