from pymongo import MongoClient
from bson import ObjectId

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017")
db = client["lifeskill"]  # Replace with your database name

# Clear existing collection
db.districts.delete_many({})

# Districts data
districts = [
    {"_id": ObjectId(), "name": "Jaffna", "province": "Northern"},
    {"_id": ObjectId(), "name": "Mulativ", "province": "Northern"},
    {"_id": ObjectId(), "name": "Vavuniya", "province": "Northern"},
    {"_id": ObjectId(), "name": "Kilinochchi", "province": "Northern"},
    {"_id": ObjectId(), "name": "Mannar", "province": "Northern"},
    {"_id": ObjectId(), "name": "Colombo", "province": "Western"},
    {"_id": ObjectId(), "name": "Gampaha", "province": "Western"},
]

# Insert districts
db.districts.insert_many(districts)

print("✅ Districts seeded successfully!")
