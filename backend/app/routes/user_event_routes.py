from flask import Blueprint, jsonify
from datetime import datetime
from app import mongo  

user_event_bp = Blueprint('user_event_bp', __name__)

def serialize_event(e):
    """Convert MongoDB document to JSON-serializable dict."""
    e['_id'] = str(e['_id'])
    e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
    e['numberOfSlots'] = e.get('numberOfSlots', 0)
    e['eventMedia'] = e.get('eventMedia', [])

    # Convert datetime objects to ISO string for JSON
    if isinstance(e.get("start_time"), datetime):
        e['start_time'] = e['start_time'].isoformat()
    if isinstance(e.get("end_time"), datetime):
        e['end_time'] = e['end_time'].isoformat()

    return e

def compute_event_status(event):
    """Determine event status based on current time and start/end times."""
    now = datetime.utcnow()
    start = event.get("start_time")
    end = event.get("end_time")

    if not start or not end:
        return "unknown"

    # Convert strings to datetime if necessary
    if isinstance(start, str):
        start = datetime.fromisoformat(start)
    if isinstance(end, str):
        end = datetime.fromisoformat(end)

    if now < start:
        return "upcoming"
    elif start <= now <= end:
        return "ongoing"
    else:
        return "completed"

@user_event_bp.route('/upcoming-events', methods=['GET'])
def get_upcoming_events():
    try:
        events = list(mongo.db.events.find())
        upcoming = [serialize_event(e) for e in events if compute_event_status(e) == "upcoming"]
        return jsonify(upcoming), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_event_bp.route('/ongoing-events', methods=['GET'])
def get_ongoing_events():
    try:
        events = list(mongo.db.events.find())
        ongoing = [serialize_event(e) for e in events if compute_event_status(e) == "ongoing"]
        return jsonify(ongoing), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_event_bp.route('/completed-events', methods=['GET'])
def get_completed_events():
    try:
        events = list(mongo.db.events.find())
        completed = [serialize_event(e) for e in events if compute_event_status(e) == "completed"]
        return jsonify(completed), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
