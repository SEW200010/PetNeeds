
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
            "speakers": ["Test Speaker"],
            "province": "Northern",
            "district": "Jaffna",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1d")  # Jaffna Zone 1
        },
        {
            "_id": ObjectId(),
            "name": "Counseling Intro",
            "description": "Introduction to counseling services",
            "start_time": SL_TZ.localize(datetime(2025, 8, 22, 8, 18)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 22, 10, 18)),
            "venue": "Conference Room A",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Dr. Smith"],
            "province": "Northern",
            "district": "Jaffna",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1e")  # Jaffna Zone 2
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 15, 0)),
            "venue": "Room 201",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Kilinochchi",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd1f")  # Kilinochchi Zone 1
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": SL_TZ.localize(datetime(2025, 9, 20, 23, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 20, 23, 30)),
            "venue": "Room 201",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Mannar",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd20")  # Mannar Zone 1
        },
        {
            "_id": ObjectId(),
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": SL_TZ.localize(datetime(2025, 9, 29, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 29, 15, 0)),
            "venue": "Room 201",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Michael"],
            "province": "Northern",
            "district": "Vavuniya",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd21")  # Vavuniya Zone 2
        },
        {
            "_id": ObjectId(),
            "name": "Ongoing Research Workshop",
            "description": "Hands-on workshop on AI and Data Science",
            "start_time": SL_TZ.localize(datetime(2025, 9, 21, 17, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 21, 22, 0)),
            "venue": "Main Auditorium",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Prof. M. Siyamalan"],
            "province": "Western",
            "district": "Colombo",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd22")  # Colombo Zone 1
        },
        {
            "_id": ObjectId(),
            "name": "Career Guidance Talk",
            "description": "Session on taking ideas from lab to market",
            "start_time": SL_TZ.localize(datetime(2025, 9, 21, 19, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 21, 23, 0)),
            "venue": "Conference Room B",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Dr. Sabesan Sithamparanathan"],
            "province": "Western",
            "district": "Gampaha",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd23")  # Gampaha Zone 1
        },
        {
            "_id": ObjectId(),
            "name": "Team Building Session",
            "description": "Interactive session to improve teamwork skills",
            "start_time": SL_TZ.localize(datetime(2025, 9, 28, 14, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 28, 17, 0)),
            "venue": "Sports Complex",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Coach Anura"],
            "province": "Northern",
            "district": "Mullaitivu",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd24")  # Mullaitivu Zone 2
        },
        {
            "_id": ObjectId(),
            "name": "Innovation Pitch Competition",
            "description": "Students present their startup ideas",
            "start_time": SL_TZ.localize(datetime(2025, 9, 25, 9, 30)),
            "end_time": SL_TZ.localize(datetime(2025, 9, 25, 12, 30)),
            "venue": "Innovation Hub",
            "participants": {"registered_users": [], "confirmed_users": []},
            "speakers": ["Industry Experts"],
            "province": "Northern",
            "district": "Jaffna",
            "zone_id": ObjectId("68d8f86ce69824652f3ccd25")  # Jaffna Zone 3
        },
    ]

    mongo.db.events.delete_many({})
    mongo.db.events.insert_many(sample_events)
    print("✅ Sample events inserted with province, district, and zone_id.")
