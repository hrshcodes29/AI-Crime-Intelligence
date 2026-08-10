from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from joblib import dump

BASE_DIR = Path(__file__).resolve().parent
CSV_PATH = BASE_DIR / "NCRB_CII-2019_Table_1A.1.csv"

df = pd.read_csv(CSV_PATH)

numeric = [
    "2017", "2018", "2019",
    "Percentage Share of State/UT (2019)",
    "Mid-Year Projected Population (in Lakhs) (2019)",
    "Rate of Total Cognizable Crime (IPC) (2019)+"
]
for c in numeric:
    df[c] = pd.to_numeric(df[c], errors="coerce")

df = df[df["Category"].astype(str).str.lower().eq("state")].copy()
df = df.dropna(subset=["2017", "2018", "2019",
                       "Mid-Year Projected Population (in Lakhs) (2019)"])

features = [
    "2017",
    "2018",
    "Mid-Year Projected Population (in Lakhs) (2019)"
]
X = df[features]
y = df["2019"]

rng = np.random.RandomState(42)
idx = rng.permutation(len(df))
split = int(len(df) * 0.8)

model = RandomForestRegressor(
    n_estimators=300,
    random_state=42,
    min_samples_leaf=2
)
model.fit(X.iloc[idx[:split]], y.iloc[idx[:split]])

pred = model.predict(X.iloc[idx[split:]])

print("MAE :", round(mean_absolute_error(y.iloc[idx[split:]], pred), 2))
print("RMSE:", round(mean_squared_error(y.iloc[idx[split:]], pred) ** 0.5, 2))
print("R2  :", round(r2_score(y.iloc[idx[split:]], pred), 4))

dump(model, BASE_DIR / "crime_model.joblib")

df[[
    "State/UT", "2017", "2018", "2019",
    "Mid-Year Projected Population (in Lakhs) (2019)",
    "Rate of Total Cognizable Crime (IPC) (2019)+"
]].to_csv(BASE_DIR / "crime_state_data.csv", index=False)

print("Model saved as crime_model.joblib")
print("State data saved as crime_state_data.csv")
