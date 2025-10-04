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
            "date": "2025-08-21",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 15)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 20)),
            "venue": "Test Room",
            "status": "Drafted",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Test Speaker"],
            "province": "Northern",
            "district": "Jaffna",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1d"),
            "numberOfSlots": 20,
            "eventMedia": []
        },
        {
            "_id": ObjectId(),
            "name": "Counseling Intro",
            "description": "Introduction to counseling services",
            "date": "2025-08-22",
            "start_time": SL_TZ.localize(datetime(2025, 8, 22, 8, 18)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 22, 10, 18)),
            "venue": "Conference Room A",
            "status": "Published",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Dr. Smith"],
            "province": "Northern",
            "district": "Jaffna",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1e"),
            "numberOfSlots": 50,
            "eventMedia": [{"type": "image", "url": "https://example.com/counseling.jpg"}]
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "date": "2025-08-21",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 15, 0)),
            "venue": "Room 201",
            "status": "Drafted",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Kilinochchi",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1f"),
            "numberOfSlots": 30,
            "eventMedia": []
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "date": "2025-10-2",
            "start_time": SL_TZ.localize(datetime(2025, 10, 2, 17, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 10, 2, 19, 0)),
            "venue": "Room 201",
            "status": "Drafted",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Kilinochchi",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1f"),
            "numberOfSlots": 30,
            "eventMedia": []
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "date": "2025-10-21",
            "start_time": SL_TZ.localize(datetime(2025, 10, 21, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 10, 21, 15, 0)),
            "venue": "Room 201",
            "status": "Drafted",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Kilinochchi",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1f"),
            "numberOfSlots": 30,
            "eventMedia": []
        },
        # ... continue the same for all events ...
    ]

    mongo.db.events.delete_many({})
    mongo.db.events.insert_many(sample_events)
    print("✅ Sample events inserted with full schema (status, slots, media, date as string).")
