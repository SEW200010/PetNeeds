from app import mongo, create_app
from werkzeug.security import generate_password_hash

app = create_app()

with app.app_context():
    # Clear existing users (optional)
    mongo.db.users.delete_many({})

    # Seed users
    users = [
        {
            "fullName": "John Doe",
            "email": "john@example.com",
            "password": generate_password_hash("user123"),
            "role": "user",
            "status": "Active",
            "joinedDate": "2025-01-01",
            "location": "Jaffna",
            "school": "University of Jaffna",
            "contact": "0712345678",
            "profileImage": "/uploads/default.png"
        },
        {
            "fullName": "Jane Admin",
            "email": "admin@admin.com",
            "password": generate_password_hash("admin123"),
            "role": "admin",
            "status": "Active",
            "joinedDate": "2025-01-01",
            "location": "Colombo",
            "school": "Admin School",
            "contact": "0771234567",
            "profileImage": "/uploads/default.png"
        }
    ]

    result = mongo.db.users.insert_many(users)
    print(f"Inserted {len(result.inserted_ids)} users.")
