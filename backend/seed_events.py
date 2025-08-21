from app import create_app, mongo
from datetime import datetime, timedelta

app = create_app()

with app.app_context():
    now = datetime.utcnow()

    sample_events = [
        # === UPCOMING EVENTS ===
        {
            "name": "Counseling Intro",
            "description": "Introduction to counseling services",
            "start_time": now + timedelta(days=1),
            "end_time": now + timedelta(days=1, hours=2),
            "venue": "Conference Room A",
            "schedule": [],
            "speakers": ["Dr. Smith"],
            "participants": {"registered": 0, "confirmed": 0}
        },
        {
            "name": "Career Guidance Workshop",
            "description": "Helping students plan their career paths",
            "start_time": now + timedelta(days=2),
            "end_time": now + timedelta(days=2, hours=3),
            "venue": "Auditorium",
            "schedule": [],
            "speakers": ["Prof. Adams", "Ms. Lee"],
            "participants": {"registered": 10, "confirmed": 5}
        },
        {
            "name": "Time Management Seminar",
            "description": "Techniques to manage your time efficiently",
            "start_time": now + timedelta(days=3, hours=2),
            "end_time": now + timedelta(days=3, hours=4),
            "venue": "Room 101",
            "schedule": [],
            "speakers": ["Mr. John"],
            "participants": {"registered": 5, "confirmed": 2}
        },

        # === ONGOING EVENTS ===
        {
            "name": "Mindfulness Session",
            "description": "Live mindfulness and stress relief session",
            "start_time": now - timedelta(hours=1),
            "end_time": now + timedelta(hours=1),
            "venue": "Room 201",
            "schedule": [],
            "speakers": ["Coach Michael"],
            "participants": {"registered": 20, "confirmed": 15}
        },
        {
            "name": "Team Building Workshop",
            "description": "Interactive session to improve collaboration",
            "start_time": now - timedelta(minutes=30),
            "end_time": now + timedelta(hours=2),
            "venue": "Hall B",
            "schedule": [],
            "speakers": ["Ms. Laura"],
            "participants": {"registered": 30, "confirmed": 18}
        },
        {
            "name": "AI & Machine Learning Intro",
            "description": "Basics of AI and ML for beginners",
            "start_time": now - timedelta(hours=2),
            "end_time": now + timedelta(hours=2),
            "venue": "Computer Lab",
            "schedule": [],
            "speakers": ["Dr. Alan"],
            "participants": {"registered": 15, "confirmed": 10}
        },

        # === COMPLETED EVENTS ===
        {
            "name": "Stress Management Seminar",
            "description": "Techniques for managing stress effectively",
            "start_time": now - timedelta(days=2, hours=3),
            "end_time": now - timedelta(days=2, hours=1),
            "venue": "Conference Room C",
            "schedule": [],
            "speakers": ["Dr. Green"],
            "participants": {"registered": 50, "confirmed": 40}
        },
        {
            "name": "Parent Counseling Session",
            "description": "Guidance session for parents",
            "start_time": now - timedelta(days=5, hours=2),
            "end_time": now - timedelta(days=5),
            "venue": "Online (Zoom)",
            "schedule": [],
            "speakers": ["Ms. Rose"],
            "participants": {"registered": 25, "confirmed": 20}
        }
    ]

    # Clear old events and insert new ones
    mongo.db.events.delete_many({})
    mongo.db.events.insert_many(sample_events)

    print("✅ Sample events inserted with proper datetime objects.")
