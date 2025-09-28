from pymongo import MongoClient
from bson import ObjectId
from districts_seed import districts  # Import the same district objects

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["lifeskill"]  # Replace with your database name

# Clear existing collection
db.zones.delete_many({})

# Zones data with district_name added
zones = [
    {"_id": ObjectId(), "name": "Jaffna Zone 1", "district_id": districts[0]["_id"], "district_name": districts[0]["name"]},
    {"_id": ObjectId(), "name": "Jaffna Zone 2", "district_id": districts[0]["_id"], "district_name": districts[0]["name"]},
    {"_id": ObjectId(), "name": "Jaffna Zone 3", "district_id": districts[0]["_id"], "district_name": districts[0]["name"]},
    {"_id": ObjectId(), "name": "Jaffna Zone 4", "district_id": districts[0]["_id"], "district_name": districts[0]["name"]},
    {"_id": ObjectId(), "name": "Jaffna Zone 5", "district_id": districts[0]["_id"], "district_name": districts[0]["name"]},
    {"_id": ObjectId(), "name": "Kilinochchi Zone 1", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Kilinochchi Zone 2", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Kilinochchi Zone 3", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Mannar Zone 1", "district_id": districts[4]["_id"], "district_name": districts[4]["name"]},
    {"_id": ObjectId(), "name": "Mannar Zone 2", "district_id": districts[4]["_id"], "district_name": districts[4]["name"]},
    {"_id": ObjectId(), "name": "Mannar Zone 3", "district_id": districts[4]["_id"], "district_name": districts[4]["name"]},
    {"_id": ObjectId(), "name": "Vavuniya Zone 1", "district_id": districts[2]["_id"], "district_name": districts[2]["name"]},
    {"_id": ObjectId(), "name": "Vavuniya Zone 2", "district_id": districts[2]["_id"], "district_name": districts[2]["name"]},
    {"_id": ObjectId(), "name": "Vavuniya Zone 3", "district_id": districts[2]["_id"], "district_name": districts[2]["name"]},
    {"_id": ObjectId(), "name": "Mulativ Zone 1", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Mulativ Zone 2", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Mulativ Zone 3", "district_id": districts[1]["_id"], "district_name": districts[1]["name"]},
    {"_id": ObjectId(), "name": "Colombo Zone 1", "district_id": districts[2]["_id"], "district_name": districts[2]["name"]},
    {"_id": ObjectId(), "name": "Gampaha Zone 1", "district_id": districts[3]["_id"], "district_name": districts[3]["name"]},
]

# Insert zones
db.zones.insert_many(zones)

print("✅ Zones seeded successfully with district_name!")
