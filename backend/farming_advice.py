def get_farming_advice(crop):

    advice = {
        "Rice": "Maintain standing water during early growth and transplant seedlings properly.",
        "Wheat": "Ensure proper irrigation and well-drained soil during germination.",
        "Jute": "Grow in warm humid climate with well-drained fertile soil.",
        "Watermelon": "Use sandy loam soil with good drainage and full sunlight."
    }

    return advice.get(crop, "Follow balanced irrigation and soil management practices.")