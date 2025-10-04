from pymongo import MongoClient
from datetime import datetime
import bcrypt

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["lifeskill"]  # Replace with your DB name
students_collection = db["students"]  # Replace with your collection name

# Hash the default password "1234"
plain_password = "1234"
hashed_password = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

# Student seed data
students = [
    {
        "fullName": "Chaya",
        "email": "chaya@a.com",
        "password": hashed_password,
        "role": "student",
        "status": "Pending",
        "joinedDate": "2025-09-28",
        "province": "Northern",
        "district": "Jaffna",
        "zone": "North Zone",
        "location": "Kandy",
        "school": "HFDF",
        "contact": "0114561237",
        "profileImage": "/uploads/default.png",
        "module": []   # Empty list initially
    },
    {
        "fullName": "Sahan",
        "email": "sahan@b.com",
        "password": hashed_password,
        "role": "student",
        "status": "Pending",
        "joinedDate": "2025-09-30",
        "province": "Western",
        "district": "Colombo",
        "zone": "South Zone",
        "location": "Colombo",
        "school": "Royal College",
        "contact": "0771234567",
        "profileImage": "/uploads/default.png",
        "module": []
    }
]

# Insert into DB
result = students_collection.insert_many(students)
print(f"Inserted student IDs: {result.inserted_ids}")
