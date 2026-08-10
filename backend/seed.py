from database import crime_reports

reports = [
    {
        "report_id": "CR-10482",
        "city": "Delhi",
        "type": "Theft",
        "risk": "High",
        "status": "Open",
        "date": "09 Aug 2026"
    },
    {
        "report_id": "CR-10481",
        "city": "Mumbai",
        "type": "Fraud",
        "risk": "Medium",
        "status": "Investigating",
        "date": "09 Aug 2026"
    },
    {
        "report_id": "CR-10480",
        "city": "Bengaluru",
        "type": "Cyber Crime",
        "risk": "High",
        "status": "Open",
        "date": "08 Aug 2026"
    },
    {
        "report_id": "CR-10479",
        "city": "Chandigarh",
        "type": "Robbery",
        "risk": "Low",
        "status": "Resolved",
        "date": "08 Aug 2026"
    },
    {
        "report_id": "CR-10478",
        "city": "Kolkata",
        "type": "Assault",
        "risk": "Medium",
        "status": "Investigating",
        "date": "07 Aug 2026"
    }
]

crime_reports.delete_many({})
crime_reports.insert_many(reports)

print("Crime reports inserted successfully!")