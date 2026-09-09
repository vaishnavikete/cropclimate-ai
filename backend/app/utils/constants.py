INDIAN_STATES_DISTRICTS = {
    "Maharashtra": ["Pune", "Nashik", "Nagpur", "Aurangabad", "Solapur", "Amravati", "Kolhapur"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda", "Sangrur"],
    "Madhya Pradesh": ["Indore", "Ujjain", "Bhopal", "Jabalpur", "Hoshangabad", "Dewas"],
    "Karnataka": ["Dharwad", "Belagavi", "Vijayapura", "Raichur", "Shivamogga", "Mysuru"],
    "Uttar Pradesh": ["Varanasi", "Meerut", "Prayagraj", "Agra", "Bareilly", "Gorakhpur"],
    "Tamil Nadu": ["Thanjavur", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
    "Gujarat": ["Rajkot", "Junagadh", "Surat", "Vadodara", "Ahmedabad", "Mehsana"],
    "Haryana": ["Karnal", "Hisar", "Ambala", "Rohtak", "Sirsa"],
    "Rajasthan": ["Kota", "Jaipur", "Jodhpur", "Ganganagar", "Bikaner"],
    "Andhra Pradesh": ["Guntur", "Krishna", "Kurnool", "West Godavari", "Anantapur"]
}

INDIAN_SOIL_TYPES = [
    "Black Soil (Regur)",
    "Alluvial Soil",
    "Red and Yellow Soil",
    "Laterite Soil",
    "Sandy Loam",
    "Clay Loam",
    "Saline/Alkaline Soil"
]

CROP_DATABASE = {
    "Soybean": {
        "season": "Kharif",
        "optimal_temp_range": (22.0, 32.0),
        "critical_heat_temp": 36.0,
        "optimal_moisture_range": (30.0, 60.0),
        "critical_low_moisture": 25.0,
        "optimal_ph_range": (6.0, 7.5),
        "water_req_mm": 500,
        "growth_stages": ["Germination", "Vegetative", "Flowering", "Pod Formation", "Maturity"],
        "critical_growth_stages": ["Flowering", "Pod Formation"],
        "common_pests": [
            {
                "name": "Stem Fly / Girdle Beetle",
                "condition": "Warm humid conditions during early vegetative stage",
                "ipm": ["Deep summer plowing", "Seed treatment with Trichoderma", "Pheromone traps"],
                "active_ingredient": "Chlorantraniliprole 18.5% SC (Apply strictly if pest incidence exceeds ETL)"
            },
            {
                "name": "Aphids / Whitefly",
                "condition": "Dry spell accompanied by high temperature above 34°C",
                "ipm": ["Yellow sticky traps", "Neem oil spray (5ml/L)", "Conserve ladybird beetles"],
                "active_ingredient": "Thiamethoxam 25% WG (Use only on confirmed infestation; follow label PHI)"
            }
        ]
    },
    "Wheat": {
        "season": "Rabi",
        "optimal_temp_range": (15.0, 25.0),
        "critical_heat_temp": 30.0,
        "optimal_moisture_range": (35.0, 65.0),
        "critical_low_moisture": 28.0,
        "optimal_ph_range": (6.0, 7.5),
        "water_req_mm": 450,
        "growth_stages": ["Crown Root Initiation (CRI)", "Tillering", "Jointing", "Heading/Flowering", "Milking/Dough"],
        "critical_growth_stages": ["Crown Root Initiation (CRI)", "Heading/Flowering"],
        "common_pests": [
            {
                "name": "Yellow/Brown Rust (Puccinia spp.)",
                "condition": "Cool humid weather with morning dew (12-20°C, >80% RH)",
                "ipm": ["Resistant cultivars (HD-2967, DBW-187)", "Avoid excessive nitrogen application", "Field sanitation"],
                "active_ingredient": "Propiconazole 25% EC (Use only on confirmed rust pustules; consult local KVK)"
            },
            {
                "name": "Wheat Aphid",
                "condition": "Cloudy warm weather during earhead emergence",
                "ipm": ["Biological control via Chrysoperla", "Light traps", "Balanced fertilization"],
                "active_ingredient": "Dimethoate 30% EC (Targeted spray only when >5 aphids/tiller are observed)"
            }
        ]
    },
    "Rice": {
        "season": "Kharif",
        "optimal_temp_range": (22.0, 34.0),
        "critical_heat_temp": 37.0,
        "optimal_moisture_range": (50.0, 90.0),
        "critical_low_moisture": 40.0,
        "optimal_ph_range": (5.5, 7.0),
        "water_req_mm": 1200,
        "growth_stages": ["Nursery", "Tillering", "Panicle Initiation", "Flowering", "Grain Filling"],
        "critical_growth_stages": ["Tillering", "Flowering"],
        "common_pests": [
            {
                "name": "Brown Plant Hopper (BPH)",
                "condition": "High humidity (>85%), dense canopy, and stagnant standing water",
                "ipm": ["Alternate wetting and drying (AWD)", "Create alleyways every 2m", "Conserve spider predators"],
                "active_ingredient": "Pymetrozine 50% WDG (Apply at base of plants upon confirmed hopper burn risk)"
            },
            {
                "name": "Bacterial Leaf Blight (BLB)",
                "condition": "Continuous rainfall, strong winds, and high nitrogen doses",
                "ipm": ["Balanced NPK with additional potassium", "Drain excess water", "Copper hydroxide spray"],
                "active_ingredient": "Streptocycline + Copper Oxychloride (Confirm disease lesions before field spray)"
            }
        ]
    },
    "Cotton": {
        "season": "Kharif",
        "optimal_temp_range": (24.0, 35.0),
        "critical_heat_temp": 39.0,
        "optimal_moisture_range": (30.0, 55.0),
        "critical_low_moisture": 22.0,
        "optimal_ph_range": (6.5, 8.0),
        "water_req_mm": 700,
        "growth_stages": ["Seedling", "Square Formation", "Flowering", "Boll Development", "Boll Bursting"],
        "critical_growth_stages": ["Square Formation", "Boll Development"],
        "common_pests": [
            {
                "name": "Pink Bollworm",
                "condition": "High temperature with intermittent cloudy days during squaring",
                "ipm": ["Pheromone delta traps (5/acre)", "Trichogramma egg parasitoids release", "Clean cultivation"],
                "active_ingredient": "Emamectin Benzoate 5% SG (Verify rosette flowers before application)"
            }
        ]
    },
    "Maize": {
        "season": "Kharif/Rabi",
        "optimal_temp_range": (20.0, 32.0),
        "critical_heat_temp": 37.0,
        "optimal_moisture_range": (35.0, 65.0),
        "critical_low_moisture": 25.0,
        "optimal_ph_range": (5.8, 7.5),
        "water_req_mm": 550,
        "growth_stages": ["Seedling", "Knee-high", "Tasseling", "Silking", "Maturity"],
        "critical_growth_stages": ["Tasseling", "Silking"],
        "common_pests": [
            {
                "name": "Fall Armyworm (Spodoptera frugiperda)",
                "condition": "Dry warm periods with high night temperatures during early whorl stage",
                "ipm": ["Pheromone traps", "Hand picking of egg masses", "Intercropping with pulses"],
                "active_ingredient": "Spinetoram 11.7% SC (Whorl application on confirmed larvae presence)"
            }
        ]
    },
    "Groundnut": {
        "season": "Kharif/Zaid",
        "optimal_temp_range": (22.0, 30.0),
        "critical_heat_temp": 35.0,
        "optimal_moisture_range": (25.0, 50.0),
        "critical_low_moisture": 20.0,
        "optimal_ph_range": (6.0, 7.0),
        "water_req_mm": 450,
        "growth_stages": ["Emergence", "Vegetative", "Flowering", "Pegging", "Pod Development"],
        "critical_growth_stages": ["Flowering", "Pegging"],
        "common_pests": [
            {
                "name": "Tikka Leaf Spot (Cercospora)",
                "condition": "Prolonged leaf wetness with moderate temperatures (25-28°C)",
                "ipm": ["Crop rotation with cereals", "Remove plant residues", "Tolerant varieties"],
                "active_ingredient": "Mancozeb 75% WP (Use upon onset of dark brown circular spots)"
            }
        ]
    },
    "Chickpea": {
        "season": "Rabi",
        "optimal_temp_range": (15.0, 26.0),
        "critical_heat_temp": 32.0,
        "optimal_moisture_range": (20.0, 45.0),
        "critical_low_moisture": 18.0,
        "optimal_ph_range": (6.0, 7.5),
        "water_req_mm": 300,
        "growth_stages": ["Vegetative", "Branching", "Flowering", "Podding", "Maturity"],
        "critical_growth_stages": ["Flowering", "Podding"],
        "common_pests": [
            {
                "name": "Gram Pod Borer (Helicoverpa armigera)",
                "condition": "Warm sunny days after flowering",
                "ipm": ["Bird perches (15-20/acre)", "NPV virus spray", "Pheromone traps"],
                "active_ingredient": "Indoxacarb 14.5% SC (Apply when larval count exceeds economic threshold)"
            }
        ]
    },
    "Sugarcane": {
        "season": "Perennial",
        "optimal_temp_range": (24.0, 35.0),
        "critical_heat_temp": 40.0,
        "optimal_moisture_range": (40.0, 75.0),
        "critical_low_moisture": 30.0,
        "optimal_ph_range": (6.5, 8.0),
        "water_req_mm": 1800,
        "growth_stages": ["Germination", "Tillering", "Grand Growth", "Ripening"],
        "critical_growth_stages": ["Tillering", "Grand Growth"],
        "common_pests": [
            {
                "name": "Early Shoot Borer",
                "condition": "Dry weather with low humidity and high temperatures",
                "ipm": ["Earthing up", "Trash mulching", "Trichogramma chilonis release"],
                "active_ingredient": "Fipronil 0.3% G (Granular soil application on confirmed infestation)"
            }
        ]
    },
    "Tomato": {
        "season": "Year-round",
        "optimal_temp_range": (18.0, 28.0),
        "critical_heat_temp": 34.0,
        "optimal_moisture_range": (35.0, 65.0),
        "critical_low_moisture": 25.0,
        "optimal_ph_range": (6.0, 7.0),
        "water_req_mm": 600,
        "growth_stages": ["Seedling", "Vegetative", "Flowering", "Fruit Set", "Harvest"],
        "critical_growth_stages": ["Flowering", "Fruit Set"],
        "common_pests": [
            {
                "name": "Early/Late Blight & Whitefly",
                "condition": "Cloudy humid days (>80% RH) or dry warm winds harboring whiteflies",
                "ipm": ["Mulching", "Yellow sticky cards", "Avoid overhead sprinkler irrigation"],
                "active_ingredient": "Azoxystrobin 23% SC (For confirmed fungal blight symptoms)"
            }
        ]
    },
    "Onion": {
        "season": "Kharif/Rabi",
        "optimal_temp_range": (15.0, 28.0),
        "critical_heat_temp": 35.0,
        "optimal_moisture_range": (30.0, 60.0),
        "critical_low_moisture": 25.0,
        "optimal_ph_range": (6.2, 7.2),
        "water_req_mm": 400,
        "growth_stages": ["Seedling", "Vegetative", "Bulb Initiation", "Bulb Development", "Harvest"],
        "critical_growth_stages": ["Bulb Initiation", "Bulb Development"],
        "common_pests": [
            {
                "name": "Onion Thrips (Thrips tabaci)",
                "condition": "Dry, hot weather with low humidity",
                "ipm": ["Blue sticky traps", "Sprinkler irrigation to wash off thrips", "Neem extract 1%"],
                "active_ingredient": "Spinosad 45% SC (Apply strictly upon silvery leaf patch confirmation)"
            }
        ]
    }
}

DEMO_FARMS = {
    "farm-1": {
        "id": "farm-1",
        "name": "Demo Farm 1 — Pune Soybean Cluster",
        "crop_name": "Soybean",
        "location_name": "Baramati, Pune",
        "state": "Maharashtra",
        "district": "Pune",
        "latitude": 18.1524,
        "longitude": 74.5772,
        "soil_type": "Black Soil (Regur)",
        "soil_moisture_pct": 21.0,
        "soil_ph": 7.1,
        "soil_n": 185.0,
        "soil_p": 16.0,
        "soil_k": 220.0,
        "temperature_c": 38.0,
        "humidity_pct": 32.0,
        "rainfall_mm": 0.0,
        "forecast_rainfall_mm": 1.2,
        "growth_stage": "Flowering",
        "sowing_date": "2026-06-25",
        "has_irrigation": True,
        "satellite_ndvi": 0.42,
        "satellite_ndwi": -0.15,
        "expected_stress_prob": 78.0,
        "stress_level": "High",
        "description": "Simulated acute heat & soil moisture deficit scenario for Kharif Soybean."
    },
    "farm-2": {
        "id": "farm-2",
        "name": "Demo Farm 2 — Ludhiana Wheat Agro-Zone",
        "crop_name": "Wheat",
        "location_name": "Khanna, Ludhiana",
        "state": "Punjab",
        "district": "Ludhiana",
        "latitude": 30.7046,
        "longitude": 76.2217,
        "soil_type": "Alluvial Soil",
        "soil_moisture_pct": 48.0,
        "soil_ph": 6.8,
        "soil_n": 240.0,
        "soil_p": 22.0,
        "soil_k": 280.0,
        "temperature_c": 31.0,
        "humidity_pct": 58.0,
        "rainfall_mm": 12.0,
        "forecast_rainfall_mm": 18.5,
        "growth_stage": "Heading/Flowering",
        "sowing_date": "2025-11-15",
        "has_irrigation": True,
        "satellite_ndvi": 0.68,
        "satellite_ndwi": 0.22,
        "expected_stress_prob": 29.0,
        "stress_level": "Low",
        "description": "Favorable moisture with moderate thermal conditions for Rabi Wheat."
    },
    "farm-3": {
        "id": "farm-3",
        "name": "Demo Farm 3 — Thanjavur Cauvery Delta Rice",
        "crop_name": "Rice",
        "location_name": "Kumbakonam, Thanjavur",
        "state": "Tamil Nadu",
        "district": "Thanjavur",
        "latitude": 10.9601,
        "longitude": 79.3845,
        "soil_type": "Clay Loam",
        "soil_moisture_pct": 65.0,
        "soil_ph": 6.4,
        "soil_n": 210.0,
        "soil_p": 19.0,
        "soil_k": 260.0,
        "temperature_c": 34.0,
        "humidity_pct": 76.0,
        "rainfall_mm": 45.0,
        "forecast_rainfall_mm": 35.0,
        "growth_stage": "Tillering",
        "sowing_date": "2026-07-10",
        "has_irrigation": True,
        "satellite_ndvi": 0.76,
        "satellite_ndwi": 0.45,
        "expected_stress_prob": 18.0,
        "stress_level": "Low",
        "description": "Abundant water availability and vigorous canopy development in deltaic conditions."
    }
}
