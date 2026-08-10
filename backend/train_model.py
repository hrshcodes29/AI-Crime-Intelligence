from pathlib import Path
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from joblib import dump


BASE_DIR = Path(__file__).resolve().parent

CSV_PATH = BASE_DIR / "NCRB_CII-2019_Table_1A.1.csv"

df = pd.read_csv(CSV_PATH)


numeric = [
    "2017",
    "2018",
    "2019",
    "Percentage Share of State/UT (2019)",
    "Mid-Year Projected Population (in Lakhs) (2019)",
    "Rate of Total Cognizable Crime (IPC) (2019)+"
]


for column in numeric:
    df[column] = pd.to_numeric(
        df[column],
        errors="coerce"
    )


df = df[
    df["Category"]
    .astype(str)
    .str.lower()
    .eq("state")
].copy()


features = [
    "2017",
    "2018",
    "Mid-Year Projected Population (in Lakhs) (2019)"
]


df = df.dropna(
    subset=features + ["2019"]
)


X = df[features]
y = df["2019"]


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


models = {
    "Linear Regression": LinearRegression(),

    "Random Forest": RandomForestRegressor(
        n_estimators=300,
        random_state=42,
        min_samples_leaf=2
    ),

    "Gradient Boosting": GradientBoostingRegressor(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=2,
        random_state=42
    )
}


results = {}


print("\nMODEL EVALUATION")
print("=" * 50)


for name, model in models.items():

    model.fit(X_train, y_train)

    predictions = model.predict(X_test)

    mae = mean_absolute_error(
        y_test,
        predictions
    )

    rmse = np.sqrt(
        mean_squared_error(
            y_test,
            predictions
        )
    )

    r2 = r2_score(
        y_test,
        predictions
    )

    results[name] = {
        "model": model,
        "mae": mae,
        "rmse": rmse,
        "r2": r2
    }

    print(f"\n{name}")
    print(f"MAE  : {mae:.2f}")
    print(f"RMSE : {rmse:.2f}")
    print(f"R2   : {r2:.4f}")


best_name = max(
    results,
    key=lambda name: results[name]["r2"]
)


best_model = results[best_name]["model"]


print("\n" + "=" * 50)
print("BEST MODEL:", best_name)
print("=" * 50)


dump(
    best_model,
    BASE_DIR / "crime_model.joblib"
)


state_data = df[
    [
        "State/UT",
        "2017",
        "2018",
        "2019",
        "Mid-Year Projected Population (in Lakhs) (2019)",
        "Rate of Total Cognizable Crime (IPC) (2019)+"
    ]
]


state_data.to_csv(
    BASE_DIR / "crime_state_data.csv",
    index=False
)


print("\nModel saved as crime_model.joblib")
print("State data saved as crime_state_data.csv")