def build_explanation(temperature: float, rainfall: float, recommended_crop: str) -> str:
    reasons: list[str] = []

    if rainfall > 200:
        reasons.append("High rainfall conditions are favorable for water-loving crops such as rice")
    elif rainfall < 50:
        reasons.append("Low rainfall suggests drought-prone conditions and requires careful crop selection")
    else:
        reasons.append("Rainfall is in a moderate range for diversified crop planning")

    if 20 <= temperature <= 30:
        reasons.append("Temperature is moderate (20-30 deg C), which supports healthy growth for many crops")
    elif temperature > 35:
        reasons.append("High temperature can stress crops and may reduce yield without mitigation")
    else:
        reasons.append("Cooler temperature profile may suit select crop varieties")

    reasons.append(f"Based on these conditions, {recommended_crop} is selected as the best-fit recommendation")
    return ". ".join(reasons) + "."
