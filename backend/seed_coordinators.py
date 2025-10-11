from pymongo import MongoClient
from datetime import datetime
import bcrypt

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB URI
db = client["lifeskill"]  # Replace with your DB name
collection = db["users"]  # Use coordinators collection

# Plain password
plain_password = "1234"
# Hash the password
hashed_password = bcrypt.hashpw(plain_password.encode("utf-8"), bcrypt.gensalt())

# Dummy data for coordinators
coordinators = [
    # --- University Coordinators ---
    {
        "fullname": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "password": hashed_password.decode("utf-8") ,
        "role": "coordinator",
        "status": "active",
        "joined_date": datetime(2023, 1, 15),
        "organization_unit": "university",
        "university_name": "University of Colombo",
        "faculty_name": "Engineering",
        "contact": {
            "phone": "0712345678",
            "profile_image": "https://randomuser.me/api/portraits/women/1.jpg"
        }
    },
    {
        "fullname": "Bob Smith",
        "email": "bob.smith@example.com",
        "password":hashed_password.decode("utf-8") ,
        "role": "coordinator",
        "status": "pending",
        "joined_date": datetime(2023, 3, 10),
        "organization_unit": "university",
        "university_name": "University of Peradeniya",
        "faculty_name": "Science",
        "contact": {
            "phone": "0723456789",
            "profile_image": "https://randomuser.me/api/portraits/men/2.jpg"
        }
    },

    # --- School Coordinators ---
    {
        "fullname": "Carol Williams",
        "email": "carol.williams@example.com",
        "password": hashed_password.decode("utf-8") ,
        "role": "coordinator",
        "status": "active",
        "joined_date": datetime(2023, 5, 20),
        "organization_unit": "school",
        "district": "Jaffna",
        "zone": "Nallur Zone",
        "school_name": "Jaffna Central College",
        "contact": {
            "phone": "0771234567",
            "profile_image": "https://randomuser.me/api/portraits/women/3.jpg"
        }
    },
    {
        "fullname": "David Brown",
        "email": "david.brown@example.com",
        "password": hashed_password.decode("utf-8") ,
        "role": "coordinator",
        "status": "pending",
        "joined_date": datetime(2023, 7, 12),
        "organization_unit": "school",
        "district": "Kandy",
        "zone": "Kandy Zone",
        "school_name": "Trinity College",
        "contact": {
            "phone": "0789876543",
            "profile_image": "https://randomuser.me/api/portraits/men/4.jpg"
        }
    }
]

# Insert dummy data into MongoDB
result = collection.insert_many(coordinators)
print(f"Inserted {len(result.inserted_ids)} coordinators into the database.")
