from flask import Blueprint, jsonify
from datetime import datetime, timezone
import pytz
from app import mongo

user_event_bp = Blueprint("user_event_bp", __name__)

# Sri Lanka timezone
SL_TZ = pytz.timezone("Asia/Colombo")

def serialize_event(e):
    """Convert MongoDB document to JSON-serializable dict."""
    e['_id'] = str(e['_id'])
    e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
    e['numberOfSlots'] = e.get('numberOfSlots', 0)
    e['eventMedia'] = e.get('eventMedia', [])

    start = e.get("start_time")
    end = e.get("end_time")

    # Convert to ISO format in Sri Lanka time
    if isinstance(start, datetime):
        e['start_time'] = start.astimezone(SL_TZ).isoformat()
    if isinstance(end, datetime):
        e['end_time'] = end.astimezone(SL_TZ).isoformat()

    return e

def compute_event_status(event):
    """Determine event status based on current time and start/end times."""
    now = datetime.now(timezone.utc)  # Use UTC-aware current time

    start = event.get("start_time")
    end = event.get("end_time")

    if not start or not end:
        return "unknown"

    # If start/end are strings, parse with fromisoformat
    if isinstance(start, str):
        try:
            start = datetime.fromisoformat(start)
        except ValueError:
            return "unknown"
    if isinstance(end, str):
        try:
            end = datetime.fromisoformat(end)
        except ValueError:
            return "unknown"

    # If start/end are naive, assume UTC
    if start.tzinfo is None:
        start = start.replace(tzinfo=timezone.utc)
    if end.tzinfo is None:
        end = end.replace(tzinfo=timezone.utc)

    if now < start:
        return "upcoming"
    elif start <= now <= end:
        return "ongoing"
    else:
        return "completed"

# Routes
@user_event_bp.route("/upcoming-events", methods=["GET"])
def get_upcoming_events():
    try:
        events = list(mongo.db.events.find())
        upcoming = [serialize_event(e) for e in events if compute_event_status(e) == "upcoming"]
        return jsonify(upcoming), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_event_bp.route("/ongoing-events", methods=["GET"])
def get_ongoing_events():
    try:
        events = list(mongo.db.events.find())
        ongoing = [serialize_event(e) for e in events if compute_event_status(e) == "ongoing"]
        return jsonify(ongoing), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_event_bp.route("/completed-events", methods=["GET"])
def get_completed_events():
    try:
        events = list(mongo.db.events.find())
        completed = [serialize_event(e) for e in events if compute_event_status(e) == "completed"]
        return jsonify(completed), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
