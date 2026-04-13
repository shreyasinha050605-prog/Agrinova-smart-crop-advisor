SCHEME_MAP = {
    "rice": ["PM-KISAN"],
    "wheat": ["MSP support"],
}


def get_schemes_for_crop(crop: str) -> list[str]:
    return SCHEME_MAP.get(crop.lower(), ["General agriculture support schemes"])
