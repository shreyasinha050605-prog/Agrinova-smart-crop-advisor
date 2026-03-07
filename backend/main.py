from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np

app = FastAPI()

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model
model = joblib.load("backend/crop_model.pkl")

@app.get("/")
def home():
    return {"message": "AgriNova AI API running"}

@app.post("/predict")
def predict(N:int, P:int, K:int, temperature:float, humidity:float, rainfall:float):

    data = np.array([[N, P, K, temperature, humidity, rainfall]])
    prediction = model.predict(data)

    return {"recommended_crop": prediction[0]}