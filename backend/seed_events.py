from app import create_app, mongo
from datetime import datetime
from bson import ObjectId
import pytz

app = create_app()
SL_TZ = pytz.timezone("Asia/Colombo")

with app.app_context():
    sample_events = [
        {
    "_id": ObjectId(),
    "name": "Quick Test Event",
    "description": "This event ends in 5 minutes",
    "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 15)),
    "end_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 20)),
    "venue": "Test Room",
    "participants": {"registered_users": [], "confirmed_users": []},
    "speakers": ["Test Speaker"]
},

        {
            "_id": ObjectId(),
            "name": "Counseling Intro",
            "description": "Introduction to counseling services",
            "start_time": SL_TZ.localize(datetime(2025, 8, 22, 8, 18)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 22, 10, 18)),
            "venue": "Conference Room A",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Dr. Smith"]
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 15, 0)),
            "venue": "Room 201",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"]
        },
    ]

    mongo.db.events.delete_many({})
    mongo.db.events.insert_many(sample_events)
    print("✅ Sample events inserted with ObjectId.")