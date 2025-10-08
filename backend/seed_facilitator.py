
from pymongo import MongoClient
from datetime import datetime
import random

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB URI
db = client["lifeskill"]  # Replace with your DB name
collection = db["facilitators"]

# Dummy data for facilitators
facilitators = [
    {
        "fullname": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "password": "password123",
        "role": "facilitator",
        "status": "pending",
        "joined_date": datetime(2023, 1, 15),
        "district": "Colombo",
        "organization_unit": "University",
        "faculty": "Engineering",
        "contact": {
            "phone": "0712345678",
            "profile_image": "https://randomuser.me/api/portraits/women/1.jpg"
        }
    },
    {
        "fullname": "Bob Smith",
        "email": "bob.smith@example.com",
        "password": "password123",
        "role": "facilitator",
        "status": "pending",
        "joined_date": datetime(2023, 3, 10),
        "district": "Kandy",
        "organization_unit": "University",
        "faculty": "Science",
        "contact": {
            "phone": "0723456789",
            "profile_image": "https://randomuser.me/api/portraits/men/2.jpg"
        }
    },
    {
        "fullname": "Carol Williams",
        "email": "carol.williams@example.com",
        "password": "password123",
        "role": "facilitator",
        "status": "pending",
        "joined_date": datetime(2023, 5, 20),
        "district": "Galle",
        "organization_unit": "University",
        "faculty": "Arts",
        "contact": {
            "phone": "0771234567",
            "profile_image": "https://randomuser.me/api/portraits/women/3.jpg"
        }
    }
]

# Insert dummy data into MongoDB
result = collection.insert_many(facilitators)
print(f"Inserted {len(result.inserted_ids)} facilitators into the database.")
