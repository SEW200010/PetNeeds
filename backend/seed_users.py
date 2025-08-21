from app import create_app, mongo
from bson import ObjectId

app = create_app()

with app.app_context():
    sample_users = [
        {
            "id": 1,
            "fullName": "John Doe",
            "email": "johndoe@example.com",
            "role": "teacher-in-charge",
            "status": "Active",
            "joinDate": "2023-01-15",
            "joined_event_ids": [ObjectId("6870cfc2620a87c7f5024569")]
        },
        {
            "id": 2,
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "role": "student",
            "status": "Inactive",
            "joinDate": "2023-02-10",
            "joined_event_ids": []
        },
        {
            "id": 3,
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "role": "parent",
            "status": "Inactive",
            "joinDate": "2023-03-10",
            "joined_event_ids": []
        },
        {
            "id": 4,
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "role": "student",
            "status": "Active",
            "joinDate": "2023-04-05",
            "joined_event_ids": []
        },
        {
            "id": 5,
            "fullName": "TeacherJane Smith",
            "email": "janesmith@example.com",
            "role": "student",
            "status": "Pending",
            "joinDate": "2023-05-12",
            "joined_event_ids": []
        },
        {
            "id": 6,
            "fullName": "Jane Smith",
            "email": "janesmith@example.com",
            "role": "student",
            "status": "Active",
            "joinDate": "2023-06-18",
            "joined_event_ids": []
        },
    ]

    mongo.db.users.delete_many({})
    mongo.db.users.insert_many(sample_users)

    print("✅ Sample users inserted.")
