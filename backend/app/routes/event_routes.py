from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
from app import mongo
import csv
import os

event_bp = Blueprint('event_bp', __name__)

# Create Event
@event_bp.route('/events', methods=['POST'])
def create_event():
    try:
        data = request.get_json(force=True)
        last = mongo.db.events.find_one(sort=[("event_id", -1)])
        event_id = (last["event_id"] + 1) if last and isinstance(last["event_id"], int) else 1

        # Extract fields from request
        event_id = data.get("event_id", event_id)
        name = data.get("name")
        date = data.get("date")
        time = data.get("time")
        description = data.get("description")
        status = data.get("status", "Drafted")
        venue = data.get("venue")
        schedule = data.get("schedule", [])
        speakers = data.get("speakers", [])
        participants = data.get("participants", {})
        registered = int(participants.get("registered", 0))
        confirmed = int(participants.get("confirmed", 0))

        # New fields
        numberOfSlots = int(data.get("numberOfSlots", 0))        # ✅
        eventMedia = data.get("eventMedia", "")                  # ✅

        # Validation
        if not all([name, date, time, description, venue, status]):
            return jsonify({"error": "Missing required fields"}), 400
        if not isinstance(schedule, list) or not isinstance(speakers, list):
            return jsonify({"error": "'schedule' & 'speakers' must be arrays"}), 400
        if not all(isinstance(s, str) for s in speakers):
            return jsonify({"error": "Speakers must be strings"}), 400

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
            },
            "numberOfSlots": numberOfSlots,      # ✅
            "eventMedia": eventMedia             # ✅
        })
        return jsonify({"message": "Event created"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get All Events
@event_bp.route('/events', methods=['GET'])
def get_all_events():
    try:
        events = []
        for e in mongo.db.events.find():
            e['_id'] = str(e['_id'])
            e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
            e['numberOfSlots'] = e.get('numberOfSlots', 0)     # ✅
            e['eventMedia'] = e.get('eventMedia', "")          # ✅
            events.append(e)
        return jsonify(events), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get Single Event
@event_bp.route('/events/<id>', methods=['GET'])
def get_event(id):
    try:
        if id == "null":
            return jsonify({"error": "Invalid event ID"}), 400

        e = mongo.db.events.find_one({"_id": ObjectId(id)})
        if not e:
            return jsonify({"error": "Not found"}), 404
        e['_id'] = str(e['_id'])
        e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
        e['numberOfSlots'] = e.get('numberOfSlots', 0)     # ✅
        e['eventMedia'] = e.get('eventMedia', "")          # ✅
        return jsonify(e), 200
    except InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Update Event
@event_bp.route('/events/<id>', methods=['PUT'])
def update_event(id):
    try:
        if id == "null":
            return jsonify({"error": "Invalid event ID"}), 400

        data = request.get_json(force=True)
        e = mongo.db.events.find_one({"_id": ObjectId(id)})
        if not e:
            return jsonify({"error": "Event not found"}), 404

        update = {}
        for field in ("event_id", "name", "date", "time", "description", "venue", "status", "schedule", "speakers", "participants", "numberOfSlots", "eventMedia"):  # ✅ Included new fields
            if field in data:
                update[field] = data[field]

        if "participants" in update:
            p = update["participants"]
            update["participants"] = {
                "registered": int(p.get("registered", 0)),
                "confirmed": int(p.get("confirmed", 0))
            }

        if "numberOfSlots" in update:
            update["numberOfSlots"] = int(update["numberOfSlots"])  # ✅ Ensure int

        res = mongo.db.events.update_one({"_id": ObjectId(id)}, {"$set": update})
        if res.matched_count == 0:
            return jsonify({"error": "Not found"}), 404
        if res.modified_count == 0:
            return jsonify({"message": "No changes made"}), 200
        return jsonify({"message": "Updated successfully"}), 200

    except InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Delete Event
@event_bp.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    try:
        if id == "null":
            return jsonify({"error": "Invalid event ID"}), 400

        res = mongo.db.events.delete_one({"_id": ObjectId(id)})
        if res.deleted_count:
            return jsonify({"message": "Deleted"}), 200
        return jsonify({"error": "Not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Get Participants by Event
@event_bp.route('/participants', methods=['GET'])
def get_participants_by_event():
    try:
        event_mongo_id = request.args.get("event_id")
        if not event_mongo_id:
            return jsonify({"error": "Missing event_id parameter"}), 400

        event = mongo.db.events.find_one({"_id": ObjectId(event_mongo_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        numeric_event_id = event.get("event_id")
        if numeric_event_id is None or numeric_event_id == "":
            return jsonify({"error": "Event numeric ID not found"}), 404

        numeric_event_id_str = str(numeric_event_id)

        participants = []
        csv_path = os.path.join(os.path.dirname(__file__), "data", "participants.csv")
        with open(csv_path, mode='r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row.get("event_id") == numeric_event_id_str:
                    participants.append(row)

        return jsonify(participants), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        print("Error:", e)
