def apply_crop_rules(crops: list[str], rainfall: float, temperature: float) -> list[str]:
    filtered = list(crops)

    if rainfall < 50:
        filtered = [crop for crop in filtered if crop.lower() != "rice"]

    if temperature > 35:
        filtered = [crop for crop in filtered if crop.lower() != "wheat"]

    # Ensure at least one crop remains.
    if not filtered:
        return [crops[0]] if crops else []

    return filtered
