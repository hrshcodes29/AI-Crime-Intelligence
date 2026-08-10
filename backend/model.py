from pathlib import Path
import pandas as pd
from joblib import load

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "crime_model.joblib"
DATA_PATH = BASE_DIR / "crime_state_data.csv"

model = load(MODEL_PATH)
state_data = pd.read_csv(DATA_PATH)

rates = state_data[
    "Rate of Total Cognizable Crime (IPC) (2019)+"
].dropna()

LOW_THRESHOLD = float(rates.quantile(0.33))
HIGH_THRESHOLD = float(rates.quantile(0.67))


def find_state(location):
    location = location.strip().lower()

    exact = state_data[
        state_data["State/UT"].str.lower() == location
    ]

    if len(exact) > 0:
        return exact.iloc[0]

    partial = state_data[
        state_data["State/UT"]
        .str.lower()
        .str.contains(location, na=False)
    ]

    if len(partial) > 0:
        return partial.iloc[0]

    return None


def predict_risk(location):
    row = find_state(location)

    if row is None:
        return {
            "success": False,
            "message": "State/UT not found in NCRB dataset"
        }

    features = pd.DataFrame([{
        "2017": float(row["2017"]),
        "2018": float(row["2018"]),
        "Mid-Year Projected Population (in Lakhs) (2019)": float(
            row["Mid-Year Projected Population (in Lakhs) (2019)"]
        )
    }])

    predicted_cases = float(
        model.predict(features)[0]
    )

    population_lakhs = float(
        row["Mid-Year Projected Population (in Lakhs) (2019)"]
    )

    predicted_rate = predicted_cases / population_lakhs

    if predicted_rate < LOW_THRESHOLD:
        level = "LOW"
        score = 30

    elif predicted_rate < HIGH_THRESHOLD:
        level = "MODERATE"
        score = 60

    else:
        level = "HIGH"
        score = 85

    return {
        "success": True,
        "location": row["State/UT"],
        "predicted_cases": round(predicted_cases),
        "predicted_rate": round(predicted_rate, 2),
        "level": level,
        "score": score,
        "historical_2019_cases": int(row["2019"]),
        "historical_2019_rate": round(
            float(
                row[
                    "Rate of Total Cognizable Crime (IPC) (2019)+"
                ]
            ),
            2
        )
    }