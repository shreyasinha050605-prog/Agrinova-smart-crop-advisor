import logging

from fastapi import FastAPI, Query
from backend.farming_advice import get_farming_advice
from backend.region_crop_data import get_top_crops
from fastapi.middleware.cors import CORSMiddleware
from backend.fertilizer_advice import get_fertilizer_advice
from backend.services.weather_service import get_forecast_weather
from backend.services.explanation_engine import build_explanation
from backend.services.risk_service import build_risk_alerts
from backend.services.hybrid_decision_service import apply_crop_rules
from backend.services.yield_service import estimate_yield
from backend.services.market_service import get_market_recommendation
from backend.services.scheme_service import get_schemes_for_crop
from backend.services.translation_service import translate_value
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

model = joblib.load("backend/crop_model.pkl")


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    rainfall: float
    region: str
    lang: str = "en"


# ---------------- WEATHER FUNCTION ----------------
def get_weather(city: str, state: str | None = None):
    # Delegates API + fallback logic to service layer.
    weather = get_forecast_weather(city=city, state=state)
    return {
        "temperature": weather["temperature"],
        "humidity": weather["humidity"],
        "rainfall": weather["rainfall"],
        "rainfall_mm_per_month": weather["rainfall_mm_per_month"],
        "source": weather["source"],
    }

def get_weather_advice(temp, rainfall):

    if rainfall < 50:
        return "Low rainfall expected. Consider irrigation support."

    if rainfall > 200:
        return "Heavy rainfall expected. Ensure proper drainage."

    if temp > 35:
        return "High temperature risk. Use mulching and irrigation."

    return "Weather conditions look suitable for farming."

# ---------------- WEATHER ENDPOINT ----------------
@app.get("/weather/{city}")
def weather(city: str, state: str | None = Query(default=None)):
    return get_weather(city=city, state=state)


@app.get("/")
def home():
    return {"message": "AgriNova AI API running"}

# ---------------- CROP TYPE ----------------
crop_types = {
    "rice": "Food Crop",
    "maize": "Food Crop",
    "chickpea": "Pulse Crop",
    "kidneybeans": "Pulse Crop",
    "pigeonpeas": "Pulse Crop",
    "mothbeans": "Pulse Crop",
    "mungbean": "Pulse Crop",
    "blackgram": "Pulse Crop",
    "lentil": "Pulse Crop",

    "pomegranate": "Fruit Crop",
    "banana": "Fruit Crop",
    "mango": "Fruit Crop",
    "grapes": "Fruit Crop",
    "watermelon": "Fruit Crop",
    "muskmelon": "Fruit Crop",
    "apple": "Fruit Crop",
    "orange": "Fruit Crop",
    "papaya": "Fruit Crop",

    "coconut": "Commercial Crop",
    "cotton": "Cash Crop",
    "jute": "Cash Crop",
    "coffee": "Commercial Crop"
}


def get_crop_type(crop):
    return crop_types.get(crop.lower(), "Crop")


# ---------------- PREDICTION ----------------
@app.post("/predict")
def predict(input: CropInput):

    data = np.array([[
        input.N,
        input.P,
        input.K,
        input.temperature,
        input.humidity,
        input.rainfall
    ]])

    probs = model.predict_proba(data)[0]

    top3_indices = np.argsort(probs)[-3:][::-1]
    top3_crops = [str(model.classes_[i]) for i in top3_indices]
    class_prob_map = {str(model.classes_[idx]): float(probs[idx]) for idx in range(len(model.classes_))}

    filtered_top_crops = apply_crop_rules(
        crops=top3_crops,
        rainfall=input.rainfall,
        temperature=input.temperature,
    )
    prediction = filtered_top_crops[0]
    confidence = round(class_prob_map.get(prediction, 0.0) * 100, 2)

    top_crops = get_top_crops(input.region)

    farming_tip = get_farming_advice(prediction)

    advice = get_fertilizer_advice(prediction)

    weather_advice = get_weather_advice(input.temperature, input.rainfall)
    explanation = build_explanation(input.temperature, input.rainfall, prediction)
    risk_alerts = build_risk_alerts(input.temperature, input.rainfall)
    estimated_yield = estimate_yield(input.rainfall, input.N, input.P, input.K)
    market_suggestion = get_market_recommendation()
    schemes = get_schemes_for_crop(prediction)

    crop_type = get_crop_type(prediction)

    translated_prediction = translate_value(prediction, input.lang)
    translated_crop_type = translate_value(crop_type, input.lang)
    translated_top_ai_crops = translate_value(filtered_top_crops, input.lang)
    translated_top_state_crops = translate_value(top_crops, input.lang)
    translated_tip = translate_value(advice["tip"], input.lang)
    translated_fertilizer = translate_value(advice["fertilizer"], input.lang)
    translated_season = translate_value(advice["season"], input.lang)
    translated_weather_advice = translate_value(weather_advice, input.lang)
    translated_explanation = translate_value(explanation, input.lang)
    translated_risk_alerts = translate_value(risk_alerts, input.lang)
    translated_market_suggestion = translate_value(market_suggestion, input.lang)
    translated_schemes = translate_value(schemes, input.lang)

    return {
        "recommended_crop": translated_prediction,
        "crop_type": translated_crop_type,
        "top_ai_crops": translated_top_ai_crops,
        "confidence": confidence,
        "explanation": translated_explanation,
        "risk_alerts": translated_risk_alerts,
        "estimated_yield": estimated_yield,
        "market_suggestion": translated_market_suggestion,
        "schemes": translated_schemes,
        "top_state_crops": translated_top_state_crops,
        "farming_tip": translated_tip,
        "tip": translated_tip,
        "fertilizer": translated_fertilizer,
        "season": translated_season,
        "weather_advice": translated_weather_advice,
        "legacy_farming_note": translate_value(farming_tip, input.lang),
    }