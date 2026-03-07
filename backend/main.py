from fastapi import FastAPI
from backend.farming_advice import get_farming_advice
from backend.region_crop_data import get_top_crops
from fastapi.middleware.cors import CORSMiddleware
from backend.fertilizer_advice import get_fertilizer_advice
from pydantic import BaseModel
import joblib
import requests
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("backend/crop_model.pkl")


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    rainfall: float
    region: str


# ---------------- WEATHER FUNCTION ----------------
def get_weather(region):

    API_KEY = "7ab3d31b1a9b7e7d012088c266d02e47"

    state_to_city = {
        "Andhra Pradesh": "Amaravati",
        "Assam": "Guwahati",
        "Bihar": "Patna",
        "Chhattisgarh": "Raipur",
        "Gujarat": "Ahmedabad",
        "Haryana": "Chandigarh",
        "Jharkhand": "Ranchi",
        "Karnataka": "Bangalore",
        "Kerala": "Thiruvananthapuram",
        "Madhya Pradesh": "Bhopal",
        "Maharashtra": "Mumbai",
        "Odisha": "Bhubaneswar",
        "Punjab": "Chandigarh",
        "Rajasthan": "Jaipur",
        "Tamil Nadu": "Chennai",
        "Telangana": "Hyderabad",
        "Uttar Pradesh": "Lucknow",
        "Uttarakhand": "Dehradun",
        "West Bengal": "Kolkata"
    }

    city = state_to_city.get(region, region)

    url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={API_KEY}&units=metric"

    response = requests.get(url).json()

    if "main" not in response:
        return {
            "temperature": None,
            "humidity": None,
            "rainfall": None
        }

    rainfall = 0
    if "rain" in response and "1h" in response["rain"]:
        rainfall = response["rain"]["1h"]

    return {
        "temperature": response["main"]["temp"],
        "humidity": response["main"]["humidity"],
        "rainfall": rainfall
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
@app.get("/weather/{region}")
def weather(region: str):
    return get_weather(region)


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
    top3_crops = [model.classes_[i] for i in top3_indices]

    prediction = top3_crops[0]

    top_crops = get_top_crops(input.region)

    farming_tip = get_farming_advice(prediction)

    weather = get_weather(input.region)

    advice = get_fertilizer_advice(prediction)

    weather_advice = get_weather_advice(input.temperature, input.rainfall)

    crop_type = get_crop_type(prediction)

    return {
        "recommended_crop": str(prediction),
        "crop_type": crop_type,
        "top_ai_crops": top3_crops,
        "top_state_crops": top_crops,
        "farming_tip": advice["tip"],
        "fertilizer": advice["fertilizer"],
        "season": advice["season"],
        "weather_advice": weather_advice
    }