# 🌱 AgriNova – AI Powered Smart Crop Advisor

AgriNova is an **AI-powered region-aware crop recommendation system** that helps farmers choose the most suitable crops based on **soil nutrients, weather conditions, and regional agricultural patterns**.

The platform analyzes agricultural data to provide **data-driven farming recommendations**, including crop suggestions, fertilizer advice, seasonal insights, and climate-aware guidance.

This project was developed as part of the **Region-Aware Smart Farming Recommendation System** challenge.

---

# 🚜 Problem Statement

Farmers often struggle to determine **which crops are best suited for their land and climate conditions**.

Traditional farming decisions rely on experience rather than data, which can lead to:

* Low crop yields
* Poor soil nutrient management
* Crop failure due to unsuitable weather conditions

AgriNova solves this problem by using **machine learning and agricultural datasets** to recommend crops that are **best suited for specific environmental and soil conditions**.

---

# 💡 Solution Overview

AgriNova combines **machine learning, weather data, and regional crop datasets** to build a **smart advisory platform for farmers**.

The system provides:

* AI-based crop recommendations
* Fertilizer suggestions
* Seasonal farming guidance
* Region-specific crop insights
* Weather-aware farming advice

---

# ⚙️ Key Features

## 🌾 1. AI Crop Recommendation Engine

The machine learning model analyzes the following inputs:

* Nitrogen (N)
* Phosphorus (P)
* Potassium (K)
* Temperature
* Humidity
* Rainfall
* Region / State

The system then predicts the **top crops suitable for the farmer’s conditions**.

---

## 🧪 2. Fertilizer Recommendation

For each recommended crop, the system provides:

* Suitable fertilizers
* Soil nutrient suggestions
* Farming tips

This helps farmers maintain **healthy soil and better yields**.

---

## 🌦 3. Weather-Aware Farming Insights

AgriNova integrates with the **OpenWeather API** to provide:

* Current weather data
* Climate-based crop insights
* Weather risk alerts (e.g., high temperature or heavy rainfall)

---

## 🌍 4. Region-Specific Crop Data

The platform analyzes regional agricultural datasets to provide:

* Common crops grown in the selected state
* Region-based agricultural insights

This ensures recommendations are **location-aware**.

---

## 🌱 5. Crop Type Classification

Each recommendation identifies the crop category:

* Food Crops
* Fruit Crops
* Cash Crops

This helps farmers understand **economic and agricultural value**.

---

# 🧠 Machine Learning Model

The crop recommendation model uses **supervised learning** trained on agricultural datasets containing:

* Soil nutrients
* Climate conditions
* Crop suitability labels

The model predicts **top 3 crops ranked by probability**.

Example output:

```
Recommended Crop: Rice (Food Crop)

Top AI Suggestions:
1. Rice
2. Maize
3. Chickpea
```

---

# 🏗 System Architecture

```
Farmer Input (Soil + Weather + Region)
            │
            ▼
   React Frontend (UI)
            │
            ▼
      FastAPI Backend
            │
 ┌──────────┼───────────┐
 ▼          ▼           ▼
ML Model   Weather API   Regional Crop Data
            │
            ▼
     Smart Farming Advice
```

---

# 🛠 Tech Stack

## Frontend

* React
* TypeScript
* TailwindCSS
* Framer Motion
* Lucide Icons
* Vite

## Backend

* FastAPI
* Python
* Scikit-Learn
* NumPy
* Joblib

## Data Sources

* Kaggle Agricultural Datasets
* data.gov.in
* NDAP Agricultural Data
* OpenWeather API

---

# 📂 Project Structure

```
agrinova-smart-crop-advisor
│
├── backend
│   ├── main.py
│   ├── fertilizer_advice.py
│   ├── farming_advice.py
│   ├── region_crop_data.py
│   └── crop_model.pkl
│
├── frontend
│   ├── src
│   ├── package.json
│   └── vite.config.ts
│
├── data
│   ├── crop_dataset.csv
│   └── crop_production.csv
│
├── ml
│   └── training notebooks
│
└── README.md
```

---

# 🚀 How to Run the Project

## 1️⃣ Run Backend

```
cd agrinova-smart-crop-advisor
uvicorn backend.main:app --reload
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## 2️⃣ Run Frontend

```
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# 📊 Example Output

The system provides:

✔ Recommended Crop
✔ Crop Category (Food / Fruit / Cash)
✔ Fertilizer Advice
✔ Farming Tips
✔ Best Season
✔ Weather Insights
✔ Top AI Crop Suggestions
✔ Common Crops in Region

---

# 🌍 Impact

AgriNova helps farmers:

* Choose the **best crops for their region**
* Improve **agricultural productivity**
* Reduce **crop failure risks**
* Make **data-driven farming decisions**

---

# 🆕 Latest Upgrades (Production + Voice + Multilingual)

AgriNova has been significantly upgraded beyond the original prototype. The platform now includes:

## 1) Forecast-Based Climate Engine

Instead of relying only on current-weather snapshots, AgriNova now uses forecast data and robust fallback strategies:

* Uses OpenWeather forecast endpoint for climate computation
* Computes average temperature and humidity over forecast windows
* Normalizes rainfall to **mm/month**
* Falls back to state-wise historical rainfall estimates when forecast rainfall is missing/zero
* Returns source metadata (forecast vs fallback) for transparent behavior

## 2) State -> City Guided Climate Autofill

The recommendation form now supports two-level location selection:

* User selects **State**
* User selects **City**
* System auto-fills:
  * Temperature (°C)
  * Humidity (%)
  * Rainfall (mm/month)

This makes climate input easier and more realistic for end users.

## 3) Explainable + Hybrid AI Output

Prediction responses now include richer intelligence:

* Confidence score from model probabilities
* Explainability text for why a crop is recommended
* Rule-based risk alerts (e.g. heat stress / low rainfall)
* Hybrid crop ranking (ML + agronomic filters)
* Estimated yield proxy
* Market suggestion (mock advisory)
* Crop-linked scheme suggestions

## 4) Multilingual Backend Responses

`/predict` supports language-aware output using `lang` input:

* Supported languages: `en`, `hi`, `ta`, `te`, `kn`, `bn`, `mr`
* Key fields are translated in backend response for UI and voice delivery

## 5) Full-Site Frontend Internationalization

Language state is now global and shared across UI:

* Navigation, form labels, action buttons, helper texts, and result sections are localized
* Works for both Normal mode and Voice mode
* Language can be switched dynamically at runtime

## 6) Dedicated Voice Assistant Mode (`/voice`)

AgriNova now has two operational modes:

* `/` → Normal interactive mode
* `/voice` → Voice-first assistant mode

Voice mode supports:

* Prompt + listen workflow
* Language-aware speech prompts
* Step-by-step interview:
  1. preferred language
  2. state
  3. city
  4. nitrogen
  5. phosphorus
  6. potassium
* Climate auto-fill immediately after city capture
* Chat-style transcript of assistant/user utterances
* Read-aloud of full recommendation output

## 7) Robust Voice Handling

Voice flow has been hardened for real-world browser behavior:

* Step-based progression
* Per-step retries for unrecognized input
* Recognition timeout handling
* One-step-at-a-time speech/listen guarding (prevents loop spam)
* Native-script alias mapping for state/city speech normalization

---

# 🔧 API Snapshot (Current)

## `GET /weather/{city}?state={state}`

Returns climate payload used for auto-fill:

* `temperature`
* `humidity`
* `rainfall`
* `rainfall_mm_per_month`
* `source`

## `POST /predict`

Input includes:

* N, P, K
* temperature, humidity, rainfall
* region
* optional `lang`

Output includes:

* recommended crop + crop type
* top AI crops
* confidence
* explanation
* risk alerts
* estimated yield
* market suggestion
* schemes
* fertilizer, tip, season
* weather advice
* top state crops

---

# 🔮 Future Improvements

* Multilingual farmer support (Bhashini API)
* Voice-based farmer interaction
* Satellite-based crop monitoring
* Market price prediction
* Mobile app integration

---

# 👨‍💻 Author

Developed by **Shreya Sinha**

AI / ML | Full Stack Development | AgriTech Innovation

---

# 🌾 AgriNova – Smart Farming Powered by AI

