from __future__ import annotations

from typing import Any
import requests

SUPPORTED_LANGUAGES = {"en", "hi", "ta", "te", "kn", "bn", "mr"}

STATIC_TRANSLATIONS: dict[str, dict[str, str]] = {
    "Recommended crop is": {
        "hi": "अनुशंसित फसल है",
        "ta": "பரிந்துரைக்கப்பட்ட பயிர்",
        "te": "సిఫార్సు చేసిన పంట",
        "kn": "ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆ",
        "bn": "প্রস্তাবিত ফসল হলো",
        "mr": "शिफारस केलेले पीक आहे",
    },
    "Low rainfall. Irrigation required.": {
        "hi": "कम वर्षा। सिंचाई आवश्यक है।",
    },
    "Heavy rainfall. Ensure drainage.": {
        "hi": "अधिक वर्षा। जल निकासी सुनिश्चित करें।",
    },
    "Heat stress risk.": {
        "hi": "गर्मी तनाव का जोखिम।",
    },
}


def _translate_via_google(text: str, target_lang: str) -> str:
    response = requests.get(
        "https://translate.googleapis.com/translate_a/single",
        params={
            "client": "gtx",
            "sl": "en",
            "tl": target_lang,
            "dt": "t",
            "q": text,
        },
        timeout=5,
    )
    response.raise_for_status()
    payload = response.json()
    return "".join(part[0] for part in payload[0] if part and part[0])


def translate_text(text: str, lang: str) -> str:
    if not text or lang == "en" or lang not in SUPPORTED_LANGUAGES:
        return text

    static_value = STATIC_TRANSLATIONS.get(text, {}).get(lang)
    if static_value:
        return static_value

    try:
        return _translate_via_google(text, lang)
    except Exception:
        return text


def translate_value(value: Any, lang: str) -> Any:
    if lang == "en" or lang not in SUPPORTED_LANGUAGES:
        return value

    if isinstance(value, str):
        return translate_text(value, lang)
    if isinstance(value, list):
        return [translate_value(item, lang) for item in value]
    if isinstance(value, dict):
        return {key: translate_value(inner, lang) for key, inner in value.items()}
    return value
