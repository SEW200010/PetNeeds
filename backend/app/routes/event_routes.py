from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo

event_bp = Blueprint('event_bp', __name__)

# Create Event
@event_bp.route('/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json(force=True)
        name = data.get("name")
        date = data.get("date")
        time = data.get("time")
        description = data.get("description")
        status = data.get("status", "Drafted")
        venue = data.get("venue")
        schedule = data.get("schedule","Not Schedule")
        if not all([name, date, time, description,venue,schedule,status]):
            return jsonify({"error": "All fields are required"}), 400

        mongo.db.events.insert_one({
            "name": name,
            "date": date,
            "time": time,
            "description": description,
            "status": status,
            "venue": venue,
            "schedule":schedule
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
@event_bp.route('/events/<event_id>', methods=['GET'])
def get_event_by_id(event_id):
    try:
        event = mongo.db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404
        event["_id"] = str(event["_id"])
        return jsonify(event), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


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
        schedule = data.get("schedule","Not Schedule")

        if not all([name, date, time, description , venue,schedule,status]):
            return jsonify({"error": "All fields are required"}), 400

        result = mongo.db.events.update_one(
            {"_id": ObjectId(event_id)},
            {"$set": {
                "name": name,
                "date": date,
                "time": time,
                "description": description,
                "status": status,
                "venue": venue,
                "schedule":schedule
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
