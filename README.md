# 🌾 CropClimate AI — Climate-Smart Farming Advisor
### *"Predict. Protect. Grow."*

CropClimate AI is an AI-powered climate-smart decision-support platform designed to bridge the gap between complex meteorological/satellite data and daily on-the-ground farming operations. 

By analyzing **Crop + Soil + Weather + Satellite Vegetation Indices (NDVI/NDWI/EVI)**, CropClimate AI predicts crop stress probabilities, detects heat & drought risks, and translates these scientific indicators into clear, explainable, and actionable farming recommendations.

---

## 🌍 The Problem

Climate volatility is devastating farming predictability:
* **Erratic Monsoon & Rainfall**: Flash droughts followed by unseasonal deluges.
* **Extreme Heatwaves**: Exceeding crop thermal tolerance thresholds during critical pollination/flowering stages.
* **Rapid Soil Moisture Depletion**: Causing invisible root stress before surface signs emerge.
* **Uncertain Sowing Decisions**: Premature sowing leading to germination failure.
* **Misguided Chemical Application**: Indiscriminate pesticide/fertilizer usage leading to soil toxicity and financial loss.

---

## 🚀 The Solution

CropClimate AI provides smallholder and commercial farmers with a unified, transparent advisor:
1. **Explainable Crop Stress Machine Learning**: Predicts stress risk (0–100%) using real agronomic feature attributions.
2. **Satellite Spectral Monitoring**: Computes NDVI (vigor), NDWI (water content), and EVI from multispectral imagery without misleading claims of microscopic disease diagnosis.
3. **Smart Irrigation Guidance**: Calculates high/moderate/low priority irrigation windows (e.g., irrigate within 12 hours before peak heat, or delay when rainfall is forecasted).
4. **Crop & Sowing Advisor**: Evaluates agro-climatic suitability scores for major crops and pinpoints optimal sowing windows.
5. **Integrated Pest Management (IPM)**: Follows strict safety standards—recommends pest management strategies first, and only suggests chemical active ingredients when specific pests are diagnosed, with explicit warnings to verify with local agricultural extension offices.
6. **AI Farm Assistant**: An interactive agricultural copilot grounded in the farm's live analytical context.

---

## 🏛️ System Architecture

```
                                  ┌────────────────────────────────────────┐
                                  │       CropClimate AI Web Client        │
                                  │   (React 18 + Vite + Tailwind CSS)     │
                                  └──────────────────┬─────────────────────┘
                                                     │ REST API
                                                     ▼
                                  ┌────────────────────────────────────────┐
                                  │           FastAPI Backend              │
                                  │   (Pydantic v2 + SQLite + SQLAlchemy)  │
                                  └──────┬───────────┬───────────┬─────────┘
                                         │           │           │
                 ┌───────────────────────┘           │           └───────────────────────┐
                 ▼                                   ▼                                   ▼
    ┌─────────────────────────┐         ┌─────────────────────────┐         ┌─────────────────────────┐
    │   ML Prediction Engine  │         │   Weather Risk Engine   │         │    Satellite Engine     │
    │  (Random Forest Models  │         │  (Live Open-Meteo API   │         │  (NDVI/NDWI/EVI Spectral│
    │  + Feature Importance)  │         │  + Resilient Fallback)  │         │   Zoning & Overlays)    │
    └─────────────────────────┘         └─────────────────────────┘         └─────────────────────────┘
                 │                                   │                                   │
                 └───────────────────────┬───────────┴───────────────────────────────────┘
                                         ▼
                                  ┌────────────────────────────────────────┐
                                  │   Explainable Advisory Engine          │
                                  │  (Irrigation, Crops, Sowing, IPM, Fert)│
                                  └────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Earthy agricultural theme)
- **Icons**: Lucide React
- **Visualizations**: Recharts
- **GIS Maps**: Leaflet & React-Leaflet
- **HTTP Client**: Axios

### Backend
- **Framework**: Python 3.10+ / FastAPI
- **ORM & DB**: SQLAlchemy with SQLite
- **Validation**: Pydantic v2 & Pydantic-Settings
- **Machine Learning**: Scikit-Learn, NumPy, Pandas, Joblib
- **Testing**: Pytest & HTTPX

---

## 📁 Project Structure

```
cropclimate-ai/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI Application Entry
│   │   ├── config.py                # Environment Settings
│   │   ├── database.py              # SQLite Engine & Sessions
│   │   ├── models/                  # SQLAlchemy Models
│   │   ├── schemas/                 # Pydantic Schemas
│   │   ├── routers/                 # Modular API Endpoints
│   │   ├── services/                # Business Logic & Orchestration
│   │   ├── ml/                      # Machine Learning Models & Training
│   │   ├── satellite/               # Spectral Analysis (NDVI/NDWI)
│   │   ├── weather/                 # Weather Forecast & Climatology
│   │   ├── recommendations/         # Advisory & Rule Engines
│   │   └── utils/                   # Helpers & Agronomic Constants
│   ├── models/                      # Serialized ML Models (.joblib)
│   ├── datasets/                    # Agronomic Training & Benchmark Data
│   ├── tests/                       # Pytest Test Suite
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/              # UI Cards, Gauges, Modals
│   │   ├── pages/                   # Dashboard, Farm Analysis, Satellite, Weather, etc.
│   │   ├── layouts/                 # Header, Sidebar, Navigation
│   │   ├── services/                # API Client Services
│   │   ├── charts/                  # Recharts Visualizations
│   │   ├── maps/                    # Leaflet GIS Mapping
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── README.md
└── .env.example
```

---

## ⚡ Quick Start Installation

### Prerequisites
- Python 3.10+ (Python 3.11–3.13 supported)
- Node.js 18+ and npm

### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```
Backend will be live at: `http://localhost:8000`  
Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```powershell
cd frontend
npm install
npm run dev
```
Frontend will be live at: `http://localhost:5173`

---

## ⚠️ Agricultural & Scientific Disclaimer
*CropClimate AI is an AI-powered agricultural decision-support tool created for advisory purposes. It is not an unconditional guarantee of harvest outcomes. Farmers must verify recommendations with local agricultural extension officers, certified agronomists, regional Krishi Vigyan Kendras (KVK), and chemical product label guidelines.*
