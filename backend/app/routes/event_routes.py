from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo

event_bp = Blueprint('event_bp', __name__)

# Create Event
@event_bp.route('/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json(force=True)
        event_id = data.get("event_id")
        name = data.get("name")
        date = data.get("date")
        time = data.get("time")
        description = data.get("description")
        status = data.get("status", "Drafted")
        venue = data.get("venue")
        schedule = data.get("schedule", [])
        speakers = data.get("speakers", [])

        participants = data.get("participants", {"registered": 0, "confirmed": 0})
        try:
            registered = int(participants.get("registered", 0))
            confirmed = int(participants.get("confirmed", 0))
        except ValueError:
            return jsonify({"error": "'registered' and 'confirmed' must be integers"}), 400

        # Validation
        if not all([event_id, name, date, time, description, venue, status]):
            return jsonify({"error": "All required fields including 'event_id' must be provided"}), 400
        if not isinstance(schedule, list) or not isinstance(speakers, list):
            return jsonify({"error": "'schedule' and 'speakers' must be arrays"}), 400
        if not all(isinstance(s, str) for s in speakers):
            return jsonify({"error": "Speakers must be a list of strings"}), 400

        mongo.db.events.insert_one({
            "event_id": event_id,
            "name": name,
            "date": date,
            "time": time,
            "description": description,
            "status": status,
            "venue": venue,
            "schedule": schedule,
            "speakers": speakers,
            "participants": {
                "registered": registered,
                "confirmed": confirmed
            }
        })

        return jsonify({"message": "Event created successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Events
@event_bp.route('/events', methods=['GET'])
def get_all_events():
    try:
        events = list(mongo.db.events.find())
        for event in events:
            event["_id"] = str(event["_id"])
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get Event by ID
@event_bp.route("/events/<id>", methods=["GET"])
def get_event(id):
    try:
        event = mongo.db.events.find_one({"_id": ObjectId(id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        event["_id"] = str(event["_id"])

        if "participants" not in event:
            event["participants"] = {"registered": 0, "confirmed": 0}

        return jsonify(event), 200

    except Exception as e:
        return jsonify({"error": "Internal Server Error"}), 500


# Update Event
@event_bp.route('/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    try:
        data = request.get_json(force=True)
        name = data.get("name")
        date = data.get("date")
        time = data.get("time")
        description = data.get("description")
        status = data.get("status")
        venue = data.get("venue")
        schedule = data.get("schedule", [])
        speakers = data.get("speakers", [])

        participants = data.get("participants", {"registered": 0, "confirmed": 0})
        try:
            registered = int(participants.get("registered", 0))
            confirmed = int(participants.get("confirmed", 0))
        except ValueError:
            return jsonify({"error": "'registered' and 'confirmed' must be integers"}), 400

        # Validation
        if not all([name, date, time, description, venue, status]):
            return jsonify({"error": "All required fields must be provided"}), 400
        if not isinstance(schedule, list) or not isinstance(speakers, list):
            return jsonify({"error": "'schedule' and 'speakers' must be arrays"}), 400
        if not all(isinstance(s, str) for s in speakers):
            return jsonify({"error": "Speakers must be a list of strings"}), 400

        result = mongo.db.events.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": {
                "name": name,
                "date": date,
                "time": time,
                "description": description,
                "status": status,
                "venue": venue,
                "schedule": schedule,
                "speakers": speakers,
                "participants": {
                    "registered": registered,
                    "confirmed": confirmed
                }
            }}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Event updated successfully"}), 200
        else:
            return jsonify({"message": "No changes made or event not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Search Events
@event_bp.route('/events/search', methods=['GET'])
def search_events():
    try:
        query = request.args.get('q', '').lower()
        events = list(mongo.db.events.find({"name": {"$regex": query, "$options": "i"}}))
        for event in events:
            event["_id"] = str(event["_id"])
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Event
@event_bp.route('/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    try:
        result = mongo.db.events.delete_one({"_id": ObjectId(event_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Event deleted successfully"}), 200
        else:
            return jsonify({"error": "Event not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
