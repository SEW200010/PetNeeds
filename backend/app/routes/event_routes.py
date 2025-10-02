from flask import Blueprint, request, jsonify,current_app
from bson import ObjectId
from bson.errors import InvalidId
from app import mongo
import csv
import os
import json
from werkzeug.utils import secure_filename
from flask import send_from_directory

event_bp = Blueprint('event_bp', __name__)

# Upload folder and allowed file types
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'event_media')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'mkv' , 'ppt' , 'pptx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_next_event_id():
    counter = mongo.db.counters.find_one_and_update(
        {'_id': 'event_id'},
        {'$inc': {'sequence_value': 1}},
        upsert=True,
        return_document=True
    )
    return counter['sequence_value']


@event_bp.route('/upload_media', methods=['POST'])
def upload_media():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    file = request.files['file']
    event_id = request.form.get('eventId')  # event MongoDB _id as string

    if not event_id:
        return jsonify({"error": "Missing eventId"}), 400
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": f"File type not allowed. Allowed types: {ALLOWED_EXTENSIONS}"}), 400

    try:
        # Verify event exists
        event_obj = mongo.db.events.find_one({"_id": ObjectId(event_id)})
        if not event_obj:
            return jsonify({"error": "Event not found"}), 404

        filename = secure_filename(file.filename)
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        # Save the file
        file.save(save_path)

        # Determine file type by extension
        ext = filename.rsplit('.', 1)[1].lower()
        if ext in ALLOWED_EXTENSIONS:
            file_type = ext
        else:
            file_type = "other"

        # Create a URL path accessible from frontend
        # (Adjust this according to your static file serving setup)
        file_url = f"/static/event_media/{filename}"

        # Append new media info to eventMedia array
        new_media = {
            "fileName": filename,
            "fileType": file_type,
            "url": file_url
        }

        # Update eventMedia list in DB (append new media)
        mongo.db.events.update_one(
            {"_id": ObjectId(event_id)},
            {"$push": {"eventMedia": new_media}}
        )

        return jsonify({"message": "File uploaded successfully", "media": new_media}), 200

    except Exception as e:
        import traceback
        with open("upload_media_error.log", "a") as f:
            f.write("Exception in upload_media:\n")
            f.write(traceback.format_exc())
            f.write("\n\n")
        return jsonify({"error": str(e)}), 500
@event_bp.route('/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        return send_from_directory(
            directory=UPLOAD_FOLDER,
            path=filename,
            as_attachment=True  # forces download
        )
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
# Create Event
@event_bp.route('/events', methods=['POST'])
def create_event():
    content_type = request.headers.get('Content-Type', '')
    if not content_type.lower().startswith('application/json'):
        return jsonify({"error": "Did not attempt to load JSON data because the request Content-Type was not 'application/json'."}), 415

    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # Auto-increment event_id
    event_id = get_next_event_id()

    try:
        schedule = data.get("schedule", [])
        if isinstance(schedule, str):
            schedule = json.loads(schedule)
        speakers = data.get("speakers", [])
        if isinstance(speakers, str):
            speakers = json.loads(speakers)
        participants = data.get("participants", {})
        if isinstance(participants, str):
            participants = json.loads(participants)
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format in schedule, speakers, or participants"}), 400

    required_fields = ["name", "date", "time", "description", "venue", "status"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    if not isinstance(schedule, list) or not isinstance(speakers, list):
        return jsonify({"error": "'schedule' and 'speakers' must be arrays"}), 400
    if not all(isinstance(s, str) for s in speakers):
        return jsonify({"error": "Speakers must be strings"}), 400

    registered = int(participants.get("registered", 0))
    confirmed = int(participants.get("confirmed", 0))
    try:
        numberOfSlots = int(data.get("numberOfSlots", 0))
    except ValueError:
        numberOfSlots = 0

    mongo.db.events.insert_one({
        "event_id": event_id,
        "name": data["name"],
        "date": data["date"],
        "time": data["time"],
        "description": data["description"],
        "status": data["status"],
        "venue": data["venue"],
        "schedule": schedule,
        "speakers": speakers,
        "participants": {
            "registered": registered,
            "confirmed": confirmed
        },
        "numberOfSlots": numberOfSlots,
        "eventMedia": []
    })

    return jsonify({"message": "Event created successfully", "event_id": event_id}), 201


# Get all events
from flask import make_response

from flask import make_response

@event_bp.route('/events', methods=['GET', 'OPTIONS'])
def get_all_events():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    try:
        events = []
        for e in mongo.db.events.find():
            e['_id'] = str(e['_id'])
            e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
            e['numberOfSlots'] = e.get('numberOfSlots', 0)
            e['eventMedia'] = e.get('eventMedia', [])
            events.append(e)
        response = make_response(jsonify(events), 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get event by ObjectId
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
        e['numberOfSlots'] = e.get('numberOfSlots', 0)
        e['eventMedia'] = e.get('eventMedia', [])
        for key in ["name", "date", "time", "description", "venue", "status", "schedule", "speakers"]:
            e.setdefault(key, '' if key not in ["schedule", "speakers"] else [])
        return jsonify(e), 200
    except InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@event_bp.route('/all_feedback', methods=['GET'])
def get_all_feedback():
    participants = list(mongo.db.participants.find())
    for p in participants:
        p['_id'] = str(p['_id'])  # convert ObjectId to string
    return jsonify(participants)

# Update event
@event_bp.route('/events/<event_id>', methods=['PUT'])
def update_event(event_id):
    content_type = request.headers.get('Content-Type', '')
    if not content_type.lower().startswith('application/json'):
        return jsonify({"error": "Did not attempt to load JSON data because the request Content-Type was not 'application/json'."}), 415

    try:
        # Parse JSON request body
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        # Validate and parse ObjectId
        try:
            obj_id = ObjectId(event_id)
        except InvalidId:
            return jsonify({"error": "Invalid event ID format"}), 400

        # Validate eventMedia if present
        if "eventMedia" in data:
            event_media = data["eventMedia"]
            if not isinstance(event_media, list):
                return jsonify({"error": "'eventMedia' must be an array"}), 400

            for media in event_media:
                if not all(k in media for k in ("fileName", "fileType", "url")):
                    return jsonify({"error": "Each media item must include fileName, fileType, and url"}), 400
                if media["fileType"] not in ALLOWED_MEDIA_TYPES:
                    return jsonify({"error": f"Invalid media fileType: {media['fileType']}"}), 400
                if not isinstance(media["url"], str) or not media["url"]:
                    return jsonify({"error": "Media url must be a non-empty string"}), 400

        # Optionally parse schedule, speakers, participants if they come as strings
        for key in ["schedule", "speakers", "participants"]:
            if key in data and isinstance(data[key], str):
                try:
                    data[key] = json.loads(data[key])
                except json.JSONDecodeError:
                    return jsonify({"error": f"Invalid JSON format for {key}"}), 400

        # Convert participants fields to int if present
        if "participants" in data:
            p = data["participants"]
            if isinstance(p, dict):
                p["registered"] = int(p.get("registered", 0))
                p["confirmed"] = int(p.get("confirmed", 0))

        # Convert numberOfSlots to int if present
        if "numberOfSlots" in data:
            try:
                data["numberOfSlots"] = int(data["numberOfSlots"])
            except ValueError:
                return jsonify({"error": "numberOfSlots must be an integer"}), 400

        # Find existing event
        existing_event = mongo.db.events.find_one({"_id": obj_id})
        if not existing_event:
            return jsonify({"error": "Event not found"}), 404

        # Update the event document with new data
        mongo.db.events.update_one({"_id": obj_id}, {"$set": data})

        return jsonify({"message": "Event updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get event by event_id
@event_bp.route('/events/by_event_id/<int:event_id>', methods=['GET'])
def get_event_by_event_id(event_id):
    try:
        e = mongo.db.events.find_one({"event_id": event_id})
        if not e:
            return jsonify({"error": "Not found"}), 404
        e['_id'] = str(e['_id'])
        e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
        e['numberOfSlots'] = e.get('numberOfSlots', 0)
        e['eventMedia'] = e.get('eventMedia', [])
        return jsonify(e), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete event
@event_bp.route('/events/<id>', methods=['DELETE'])
def delete_event(id):
    try:
        res = mongo.db.events.delete_one({"_id": ObjectId(id)})
        if res.deleted_count:
            return jsonify({"message": "Deleted"}), 200
        return jsonify({"error": "Not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid ObjectId format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get participants for event
@event_bp.route('/participants', methods=['GET'])
def get_participants_by_event():
    try:
        event_mongo_id = request.args.get("event_id")
        if not event_mongo_id:
            return jsonify({"error": "Missing event_id parameter"}), 400

        event = mongo.db.events.find_one({"_id": ObjectId(event_mongo_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        numeric_event_id_str = str(event.get("event_id"))
        participants = []
        csv_path = os.path.join(os.path.dirname(__file__), "data", "participants.csv")

        with open(csv_path, mode='r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row.get("event_id") == numeric_event_id_str:
                    participants.append(row)

        return jsonify(participants), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete media file from event
@event_bp.route('/events/<event_id>/media/<filename>', methods=['DELETE'])
def delete_event_media(event_id, filename):
    try:
        obj_id = ObjectId(event_id)
    except Exception:
        return jsonify({"error": "Invalid event ID format"}), 400

    try:
        # Pull the media item with fileName=filename from eventMedia array
        result = mongo.db.events.update_one(
            {"_id": obj_id},
            {"$pull": {"eventMedia": {"fileName": filename}}}
        )
        if result.modified_count == 0:
            return jsonify({"error": "Media file not found"}), 404

        return jsonify({"message": "Media file deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all districts, optionally filtered by province
@event_bp.route('/districts', methods=['GET'])
def get_districts():
    try:
        province = request.args.get('province')  # optional query param

        query = {}
        if province:
            query['province'] = province

        districts_cursor = mongo.db.districts.find(query)
        districts = []
        for d in districts_cursor:
            districts.append({
                "_id": str(d.get("_id")),
                "name": d.get("name"),
                "province": d.get("province")
            })

        response = jsonify(districts)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all zones, optionally filtered by district
@event_bp.route('/zones', methods=['GET'])
def get_zones():
    try:
        district_id = request.args.get('district_id')  # optional query param

        query = {}
        if district_id:
            from bson import ObjectId
            try:
                query['district_id'] = ObjectId(district_id)
            except Exception:
                return jsonify({"error": "Invalid district_id"}), 400

        zones_cursor = mongo.db.zones.find(query)
        zones = []
        for z in zones_cursor:
            zones.append({
                "_id": str(z.get("_id")),
                "name": z.get("name"),
                "district_id": str(z.get("district_id")),
                "district_name": z.get("district_name")
            })

        response = jsonify(zones)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
