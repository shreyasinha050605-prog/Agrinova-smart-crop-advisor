# 🌱 AgriNova – AI-Powered Region-Aware Smart Crop Advisor

AgriNova is a full-stack, AI-driven decision-support platform that helps farmers choose the most suitable crops based on **soil nutrients, climate intelligence, and regional agricultural patterns**.

Unlike traditional crop recommendation systems, AgriNova combines **machine learning, weather forecasting, explainable AI, and decision intelligence layers** to provide **actionable, real-world farming insights**.

---

## 🚀 Core Features

### 🌾 Crop Recommendation Engine
- Predicts best crop using:
  - Nitrogen (N), Phosphorus (P), Potassium (K)
  - Temperature, Humidity, Rainfall
- Outputs:
  - Recommended crop (+ crop type)
  - Top 3 AI suggestions
  - Region-aware crop insights

---

### 🌦️ Climate Intelligence System
- Uses **OpenWeather 5-day forecast API**
- Computes:
  - Average temperature & humidity
  - Rainfall normalized to **mm/month**
- Smart fallback:
  - Uses state-level rainfall dataset when forecast data is unavailable
- Ensures realistic and stable ML input

---

## 🧠 Decision Intelligence Layer (KEY DIFFERENTIATOR)

AgriNova goes beyond prediction by combining:

- Machine Learning predictions  
- Hybrid rule-based filtering  
- Climate risk analysis  
- Explainable AI reasoning  
- Market awareness  

👉 This transforms the system into a **farmer decision-support system**, not just a prediction tool.

---

### 📊 Advanced Insights (Fully Implemented in UI)

Displayed under **Decision Insights**:

- **Confidence Score**  
  Indicates reliability of prediction

- **Explainable AI (Reasoning Engine)**  
  Human-readable explanation of *why* the crop is recommended

- **Risk Alerts**  
  Identifies:
  - Low rainfall
  - Heat stress
  - Climate imbalance

- **Estimated Yield**  
  Proxy estimate based on environmental conditions

- **Market Suggestions**  
  Recommends crops with higher demand

- **Government Schemes**  
  Suggests applicable agricultural schemes

---

### 🎙️ Voice-Based Assistant

Route: `/voice`

A conversational AI interface designed for farmers:

language → state → city → N → P → K → prediction

Features:
- Multilingual voice prompts
- Chat-style transcript interface
- Automatic climate data filling after city input
- Read Aloud feature for results
- Manual fallback if speech recognition fails

---

### 🌍 Multilingual Support

Supported languages:
- English (en)
- Hindi (hi)
- Tamil (ta)
- Telugu (te)
- Kannada (kn)
- Bengali (bn)
- Marathi (mr)

Capabilities:
- Full UI translation
- Voice interaction in local language
- Backend response translation via `lang` parameter

---

### 🌐 Frontend Experience

Built with:
- React + TypeScript + Vite
- Tailwind CSS + Framer Motion

Features:
- Responsive modern UI
- Animated transitions
- Two-step location selection:
  - State → City
- Autofill climate data
- Validation before prediction
- Rich output card with structured insights

---

### ⚙️ Backend (FastAPI)

#### Endpoints

GET /
- Health check

GET /weather/{city}?state={state}
Returns:
- temperature  
- humidity  
- rainfall  
- rainfall_mm_per_month  
- source (forecast/fallback)

POST /predict

Input:
{
  "N": number,
  "P": number,
  "K": number,
  "temperature": number,
  "humidity": number,
  "rainfall": number,
  "region": string,
  "lang": string (optional)
}

Returns:
- ML predictions
- Decision intelligence insights
- Agronomic recommendations

---

## 🧠 Machine Learning

- Trained on agricultural dataset
- Features:
  - N, P, K
  - temperature, humidity, rainfall
- Outputs:
  - Crop probabilities
  - Top-3 recommendations
  - Confidence scoring

---

## 🏗️ Architecture

Frontend (React + TS)
        ↓
FastAPI Backend
        ↓
ML Model + Service Layer
        ↓
Weather API + Datasets

---

## 🔧 Setup

### Backend

cd backend
pip install -r requirements.txt
uvicorn main:app --reload

---

### Frontend

cd frontend
npm install
npm run dev

---

### Environment Variables

Create `.env`:

OPENWEATHER_API_KEY=your_api_key_here

---

## 🌍 Impact

AgriNova empowers farmers to:

- Make data-driven crop decisions
- Reduce climate-related risks
- Improve yield and profitability
- Access insights in their own language
- Move toward sustainable farming practices

---

## 🚧 Future Scope

- Real-time market API integration
- Satellite/soil sensor integration
- Mobile-first deployment
- Offline/low-network support
- District-level hyperlocal recommendations

---

## 👩‍💻 Authors

- Shreya Sinha   

---

## 📌 License

MIT License
