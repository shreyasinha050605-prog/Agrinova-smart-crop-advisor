import pandas as pd

# load dataset
data = pd.read_csv("data/crop_production.csv")

def get_top_crops(state):

    # filter by state
    state_data = data[data["State_Name"] == state]

    # group crops by production
    crop_stats = (
        state_data.groupby("Crop")["Production"]
        .sum()
        .sort_values(ascending=False)
        .head(3)
    )

    return list(crop_stats.index)