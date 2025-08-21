from app import create_app, mongo
from bson import ObjectId

app = create_app()

with app.app_context():
    sample_users = [
        {
            "_id": ObjectId(),
            "fullName": "John Doe",
            "email": "johndoe@example.com",
            "role": "teacher-in-charge",
            "status": "Active",
            "joinDate": "2023-01-15",
            "joined_events": []
        },
        {
            "_id": ObjectId(),
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "role": "student",
            "status": "Inactive",
            "joinDate": "2023-02-10",
            "joined_events": []
        },
        {
            "_id": ObjectId(),
            "fullName": "Parent User",
            "email": "parent@example.com",
            "role": "parent",
            "status": "Inactive",
            "joinDate": "2023-03-10",
            "joined_events": []
        },
    ]

    mongo.db.users.delete_many({})
    mongo.db.users.insert_many(sample_users)

    print("✅ Sample users inserted with ObjectId.")
