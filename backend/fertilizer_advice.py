fertilizer_data = {

    "rice": {
        "fertilizer": "Urea + NPK (20-20-0)",
        "tip": "Maintain shallow standing water and transplant seedlings properly.",
        "season": "Kharif (June–October)"
    },

    "maize": {
        "fertilizer": "NPK 20-20-20",
        "tip": "Grow in well-drained loamy soil with good sunlight.",
        "season": "Kharif / Rabi"
    },

    "chickpea": {
        "fertilizer": "DAP + Rhizobium culture",
        "tip": "Avoid over-irrigation and grow in well-drained soil.",
        "season": "Rabi"
    },

    "kidneybeans": {
        "fertilizer": "NPK 10-20-20",
        "tip": "Requires moderate rainfall and well-drained soil.",
        "season": "Rabi / Summer"
    },

    "pigeonpeas": {
        "fertilizer": "Single Super Phosphate (SSP)",
        "tip": "Deep-rooted crop, needs well-drained soil and warm climate.",
        "season": "Kharif"
    },

    "mothbeans": {
        "fertilizer": "Low nitrogen fertilizer + organic compost",
        "tip": "Suitable for dry regions with minimal irrigation.",
        "season": "Kharif"
    },

    "mungbean": {
        "fertilizer": "DAP + Biofertilizers",
        "tip": "Short-duration crop, good for crop rotation.",
        "season": "Kharif / Summer"
    },

    "blackgram": {
        "fertilizer": "NPK 20-40-20",
        "tip": "Grow in well-drained soil with moderate rainfall.",
        "season": "Kharif / Rabi"
    },

    "lentil": {
        "fertilizer": "Phosphorus-rich fertilizer (DAP)",
        "tip": "Requires cool climate and well-drained soil.",
        "season": "Rabi"
    },

    "pomegranate": {
        "fertilizer": "Organic manure + NPK 10-10-10",
        "tip": "Needs warm climate and controlled irrigation.",
        "season": "Perennial"
    },

    "banana": {
        "fertilizer": "NPK 10-10-20 + organic compost",
        "tip": "Requires high moisture and fertile soil.",
        "season": "Year-round (Tropical)"
    },

    "mango": {
        "fertilizer": "Organic manure + NPK 10-20-20",
        "tip": "Requires warm climate and good sunlight.",
        "season": "Perennial"
    },

    "grapes": {
        "fertilizer": "NPK 10-10-20 + potash",
        "tip": "Requires dry climate during fruiting.",
        "season": "Perennial"
    },

    "watermelon": {
        "fertilizer": "NPK 20-20-20",
        "tip": "Needs sandy loam soil and full sunlight.",
        "season": "Summer"
    },

    "muskmelon": {
        "fertilizer": "NPK 20-20-20 + organic compost",
        "tip": "Requires warm climate and well-drained soil.",
        "season": "Summer"
    },

    "apple": {
        "fertilizer": "Organic compost + NPK 12-12-12",
        "tip": "Needs cool climate and good drainage.",
        "season": "Perennial"
    },

    "orange": {
        "fertilizer": "NPK 10-10-10 + micronutrients",
        "tip": "Requires moderate irrigation and sunny climate.",
        "season": "Perennial"
    },

    "papaya": {
        "fertilizer": "NPK 14-14-14 + organic manure",
        "tip": "Fast-growing crop requiring warm tropical climate.",
        "season": "Year-round"
    },

    "coconut": {
        "fertilizer": "NPK 8-10-8 + organic manure",
        "tip": "Requires coastal humid climate and sandy soil.",
        "season": "Perennial"
    },

    "cotton": {
        "fertilizer": "NPK 30-10-10",
        "tip": "Requires warm climate and moderate rainfall.",
        "season": "Kharif"
    },

    "jute": {
        "fertilizer": "Nitrogen-rich fertilizer (Urea)",
        "tip": "Requires warm humid climate and alluvial soil.",
        "season": "Kharif"
    },

    "coffee": {
        "fertilizer": "Organic compost + NPK",
        "tip": "Grow under shade trees and maintain soil moisture.",
        "season": "Perennial"
    }
}


def get_fertilizer_advice(crop):

    crop = crop.lower()

    if crop in fertilizer_data:
        return fertilizer_data[crop]

    return {
        "fertilizer": "General NPK fertilizer",
        "tip": "Follow balanced irrigation and soil nutrient management.",
        "season": "Depends on crop variety"
    }