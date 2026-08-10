from pathlib import Path

import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import client, crime_reports
from model import predict_risk
from auth import register_user, login_user


BASE_DIR = Path(__file__).resolve().parent

STATE_DATA_PATH = BASE_DIR / "crime_state_data.csv"

state_data = pd.read_csv(STATE_DATA_PATH)


app = FastAPI(
    title="AI Crime Intelligence API",
    version="1.0.0"
)


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://ai-crime-intelligence-488l.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "AI Crime Intelligence API is running",
        "status": "online"
    }


@app.get("/health")
def health():
    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }


@app.get("/reports")
def get_reports():

    reports = list(
        crime_reports.find(
            {},
            {"_id": 0}
        )
    )

    return {
        "count": len(reports),
        "reports": reports
    }


@app.get("/dashboard-stats")
def dashboard_stats():

    reports = list(
        crime_reports.find(
            {},
            {"_id": 0}
        )
    )

    total_reports = len(reports)

    high_risk = len([
        report
        for report in reports
        if str(report.get("risk", "")).lower() == "high"
    ])

    investigating = len([
        report
        for report in reports
        if str(report.get("status", "")).lower()
        == "investigating"
    ])

    resolved = len([
        report
        for report in reports
        if str(report.get("status", "")).lower()
        == "resolved"
    ])

    return {
        "total_reports": total_reports,
        "high_risk": high_risk,
        "investigating": investigating,
        "resolved": resolved
    }


@app.get("/crime-analysis")
def crime_analysis():

    data = state_data.copy()

    data = data.fillna(0)

    states = []

    for _, row in data.iterrows():

        states.append({
            "state": str(row["State/UT"]),
            "2017": int(row["2017"]),
            "2018": int(row["2018"]),
            "2019": int(row["2019"]),
            "crime_rate": round(
                float(
                    row[
                        "Rate of Total Cognizable Crime (IPC) (2019)+"
                    ]
                ),
                2
            )
        })

    average_rate = data[
        "Rate of Total Cognizable Crime (IPC) (2019)+"
    ].mean()

    return {
        "total_cases": int(data["2019"].sum()),
        "states_count": len(states),
        "average_rate": round(float(average_rate), 2),
        "states": states
    }


@app.post("/predict")
def predict(data: dict):

    location = data.get("location", "")

    if not location:
        return {
            "success": False,
            "message": "Location is required"
        }

    return predict_risk(location)


@app.post("/register")
def register(data: dict):

    name = data.get("name", "")
    email = data.get("email", "")
    password = data.get("password", "")

    if not name or not email or not password:
        return {
            "success": False,
            "message": "Name, email and password are required"
        }

    if len(password) < 6:
        return {
            "success": False,
            "message": "Password must be at least 6 characters"
        }

    return register_user(
        name,
        email,
        password
    )


@app.post("/login")
def login(data: dict):

    email = data.get("email", "")
    password = data.get("password", "")

    if not email or not password:
        return {
            "success": False,
            "message": "Email and password are required"
        }

    return login_user(
        email,
        password
    )