from flask import Blueprint, request, jsonify
from datetime import datetime, timezone
import pytz
from bson import ObjectId
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
    

@user_event_bp.route("/join-event", methods=["POST"])
def join_event():
    try:
        data = request.json
        user_id = data.get("user_id")
        event_id = data.get("event_id")

        if not user_id or not event_id:
            return jsonify({"error": "User ID and Event ID are required"}), 400

        # Convert IDs to ObjectId
        try:
            user_obj_id = ObjectId(user_id)
            event_obj_id = ObjectId(event_id)
        except Exception as e:
            return jsonify({"error": "Invalid user_id or event_id"}), 400

        # Check if event exists
        event = mongo.db.events.find_one({"_id": event_obj_id})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Add user to event's registered_users array (avoid duplicates)
        mongo.db.events.update_one(
            {"_id": event_obj_id, "participants.registered_users": {"$ne": user_obj_id}},
            {"$push": {"participants.registered_users": user_obj_id}}
        )

        # Add event to user's joined_events array (avoid duplicates)
        mongo.db.users.update_one(
            {"_id": user_obj_id, "joined_events": {"$ne": event_obj_id}},
            {"$push": {"joined_events": event_obj_id}}
        )

        return jsonify({"message": "Event joined successfully"}), 200

    except Exception as e:
        print("Error in join_event:", e)
        return jsonify({"error": "Something went wrong"}), 500