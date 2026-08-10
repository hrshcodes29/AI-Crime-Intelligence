from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["ai_crime_intelligence"]

crime_reports = db["crime_reports"]
users = db["users"]
predictions = db["predictions"]