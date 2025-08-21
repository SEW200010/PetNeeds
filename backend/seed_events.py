from app import create_app, mongo
from datetime import datetime
import pytz

app = create_app()

SL_TZ = pytz.timezone("Asia/Colombo")

with app.app_context():
    sample_events = [
        # UPCOMING
        {
            "name": "Counseling Intro",
            "description": "Introduction to counseling services",
            "start_time": SL_TZ.localize(datetime(2025, 8, 22, 8, 18)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 22, 10, 18)),
            "venue": "Conference Room A",
            "schedule": [],
            "speakers": ["Dr. Smith"],
            "participants": {"registered": 0, "confirmed": 0}
        },
        {
            "name": "Career Guidance Workshop",
            "description": "Helping students plan their career paths",
            "start_time": SL_TZ.localize(datetime(2025, 8, 23, 14, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 23, 17, 0)),
            "venue": "Auditorium",
            "schedule": [],
            "speakers": ["Prof. Adams", "Ms. Lee"],
            "participants": {"registered": 10, "confirmed": 5}
        },

        # ONGOING
        {
    "name": "Quick Mindfulness Break",
    "description": "Short session to relax and refocus",
    "start_time": SL_TZ.localize(datetime(2025, 8, 21, 11, 0)),  # started at 11:00
    "end_time": SL_TZ.localize(datetime(2025, 8, 21, 12, 0)),    # ends at 12:00
    "venue": "Room 105",
    "schedule": [],
    "speakers": ["Coach Anna"],
    "participants": {"registered": 15, "confirmed": 10}
},

        {
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 13, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 15, 0)),
            "venue": "Room 201",
            "schedule": [],
            "speakers": ["Coach Michael"],
            "participants": {"registered": 20, "confirmed": 15}
        },
        {
            "name": "Team Building Workshop",
            "description": "Interactive session to improve collaboration",
            "start_time": SL_TZ.localize(datetime(2025, 8, 21, 14, 0)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 21, 16, 30)),
            "venue": "Hall B",
            "schedule": [],
            "speakers": ["Ms. Laura"],
            "participants": {"registered": 30, "confirmed": 18}
        },

        # COMPLETED
        {
            "name": "Stress Management Seminar",
            "description": "Techniques for managing stress effectively",
            "start_time": SL_TZ.localize(datetime(2025, 8, 19, 11, 30)),
            "end_time": SL_TZ.localize(datetime(2025, 8, 19, 13, 30)),
            "venue": "Conference Room C",
            "schedule": [],
            "speakers": ["Dr. Green"],
            "participants": {"registered": 50, "confirmed": 40}
        }
    ]

    mongo.db.events.delete_many({})
    mongo.db.events.insert_many(sample_events)
    print("✅ Sample events inserted with Sri Lanka timezone datetime objects.")
