def build_risk_alerts(temperature: float, rainfall: float) -> list[str]:
    alerts: list[str] = []

    if rainfall < 50:
        alerts.append("Low rainfall. Irrigation required.")
    if rainfall > 200:
        alerts.append("Heavy rainfall. Ensure drainage.")
    if temperature > 35:
        alerts.append("Heat stress risk.")

    return alerts
