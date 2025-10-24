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
        # Get user_id from query params if provided
        user_id = request.args.get("user_id")
        user_faculty = None

        if user_id:
            try:
                user_obj_id = ObjectId(user_id)
                user = mongo.db.users.find_one({"_id": user_obj_id})

                if user:
                    user_faculty = user.get("faculty_name")
            except Exception:
                pass  # Ignore invalid user_id


        events = list(mongo.db.events.find())
        upcoming = [serialize_event(e) for e in events if compute_event_status(e) == "upcoming"]

        # Filter by faculty if user_faculty is available
        if user_faculty:
            upcoming = [e for e in upcoming if e.get("faculty") == user_faculty]

        return jsonify(upcoming), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@user_event_bp.route("/ongoing-events", methods=["GET"])
def get_ongoing_events():
    try:
        # Get user_id from query params if provided
        user_id = request.args.get("user_id")
        user_faculty = None

        if user_id:
            try:
                user_obj_id = ObjectId(user_id)
                user = mongo.db.users.find_one({"_id": user_obj_id})
                if user:
                    user_faculty = user.get("faculty_name")
            except Exception:
                pass  # Ignore invalid user_id

        events = list(mongo.db.events.find())
        ongoing = [serialize_event(e) for e in events if compute_event_status(e) == "ongoing"]

        # Filter by faculty if user_faculty is available
        if user_faculty:
            ongoing = [e for e in ongoing if e.get("faculty") == user_faculty]

        return jsonify(ongoing), 200
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

        mongo.db.students.update_one(
            {"_id": user_obj_id, "joined_events": {"$ne": event_obj_id}},
            {"$push": {"joined_events": event_obj_id}}
        )

        return jsonify({"message": "Event joined successfully"}), 200

    except Exception as e:
        print("Error in join_event:", e)
        return jsonify({"error": "Something went wrong"}), 500

@user_event_bp.route("/completed-events/<user_id>", methods=["GET"])
def get_completed_events(user_id):
    try:
        # Get user_id from query params if provided
        # user_id = request.args.get("user_id")
        user_faculty = None

        # if user_id:
        try:
            user_obj_id = ObjectId(user_id)
            user = mongo.db.users.find_one({"_id": user_obj_id})

            if user:
                user_faculty = user.get("faculty_name")
        except Exception:
            pass  # Ignore invalid user_id

        events = list(mongo.db.events.find())
        completed = [serialize_event(e) for e in events if compute_event_status(e) == "completed"]

        # Filter by faculty if user_faculty is available
        if user_faculty:
            completed = [e for e in completed if e.get("faculty") == user_faculty]

        return jsonify(completed), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get all events joined by a specific student
@user_event_bp.route("/students/<student_id>/joined-events", methods=["GET"])
def get_student_joined_events(student_id):
    try:
        try:
            student_obj_id = ObjectId(student_id)
        except Exception:
            return jsonify({"error": "Invalid student_id"}), 400

        # Fetch student
        student = mongo.db.users.find_one({"_id": student_obj_id})
        if not student:
            return jsonify({"error": "Student not found"}), 404

        joined_event_ids = student.get("joined_events", [])
        user_faculty = student.get("faculty_name")
        user_university = student.get("university")

        # Convert to ObjectId list
        event_obj_ids = [ObjectId(eid) for eid in joined_event_ids]
        print(f"Student {student_id} has joined event IDs: {joined_event_ids}")

        # Fetch events
        events = list(mongo.db.events.find({"_id": {"$in": event_obj_ids}}))

        # Filter by university and faculty for consistency
        if user_university and user_faculty:
            events = [e for e in events if e.get("University") == user_university and e.get("faculty") == user_faculty]
        elif user_faculty:
            events = [e for e in events if e.get("faculty") == user_faculty]

        # Filter out completed events
        events = [e for e in events if compute_event_status(e) != "completed"]

        serialized_events = [serialize_event(e) for e in events]
        print(f"Student {student_id} joined events (filtered): {serialized_events}")
        return jsonify({"events": serialized_events}), 200

    except Exception as e:
        print("Error in get_student_joined_events:", e)
        return jsonify({"error": "Something went wrong"}), 500
