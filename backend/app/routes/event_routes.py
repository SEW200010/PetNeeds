from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Enable CORS to allow frontend requests

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["lifeskill"]  # Your database name
collection = db["participants"]  # Your collection name

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Enable cross-origin access from React

client = MongoClient("mongodb://localhost:27017/")
db = client["lifeskill"]
collection = db["participants"]

@app.route("/participants", methods=["GET"])
def get_participants():
    event_id = request.args.get("event_id")
    if event_id:
        try:
            event_id = int(event_id)
        except ValueError:
            return jsonify({"error": "event_id must be an integer"}), 400
        data = list(collection.find({"event_id": event_id}, {"_id": 0}))
    else:
        data = list(collection.find({}, {"_id": 0}))
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)


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
        schedule = data.get("schedule", [])
        speakers = data.get("speakers", [])
        registered = data.get("registered", 0)
        confirmed = data.get("confirmed", 0)

        # Basic validation
        if not all([name, date, time, description, venue, status]):
            return jsonify({"error": "All required fields must be provided"}), 400
        if not isinstance(schedule, list) or not isinstance(speakers, list):
            return jsonify({"error": "'schedule' and 'speakers' must be arrays"}), 400
        if not all(isinstance(s, str) for s in speakers):
            return jsonify({"error": "Speakers must be a list of strings"}), 400
        if not isinstance(registered, int) or not isinstance(confirmed, int):
            return jsonify({"error": "'registered' and 'confirmed' must be integer values"}), 400

        mongo.db.events.insert_one({
            "name": name,
            "date": date,
            "time": time,
            "description": description,
            "status": status,
            "venue": venue,
            "schedule": schedule,
            "speakers": speakers,
            "registered": registered,
            "confirmed": confirmed
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

        # Ensure 'participants' field exists
        if "participants" not in event:
            event["participants"] = { "registered": 0, "confirmed": 0 }

        return jsonify(event)

    except Exception as e:
        print(f"Error fetching event: {e}")
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
        registered = data.get("registered", 0)
        confirmed = data.get("confirmed", 0)

        # Basic validation
        if not all([name, date, time, description, venue, status]):
            return jsonify({"error": "All required fields must be provided"}), 400
        if not isinstance(schedule, list) or not isinstance(speakers, list):
            return jsonify({"error": "'schedule' and 'speakers' must be arrays"}), 400
        if not all(isinstance(s, str) for s in speakers):
            return jsonify({"error": "Speakers must be a list of strings"}), 400
        if not isinstance(registered, int) or not isinstance(confirmed, int):
            return jsonify({"error": "'registered' and 'confirmed' must be integer values"}), 400

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
                "registered": registered,
                "confirmed": confirmed
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