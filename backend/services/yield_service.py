def estimate_yield(rainfall_mm_per_month: float, n: float, p: float, k: float) -> float:
    """
    Lightweight yield proxy:
    yield = rainfall * soil_quality_factor
    """
    nutrient_mean = (n + p + k) / 3.0
    soil_quality_factor = max(0.5, min(1.5, nutrient_mean / 100.0))
    return round(rainfall_mm_per_month * soil_quality_factor, 2)
