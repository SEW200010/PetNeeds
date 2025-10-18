from flask import Blueprint, request, jsonify,current_app
from bson import ObjectId
from bson.errors import InvalidId
from app import mongo
import csv
import os
import json
from werkzeug.utils import secure_filename
from flask import send_from_directory
from datetime import datetime
from pytz import timezone
from functools import wraps
from flask import make_response, request

def cors_headers(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Handle preflight OPTIONS request
        if request.method == "OPTIONS":
            response = make_response()
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
            return response

        # Call the actual route function
        response = f(*args, **kwargs)
        if isinstance(response, tuple):
            # If route returns (response, status), extract them
            resp, status = response
            resp.headers["Access-Control-Allow-Origin"] = "*"
            resp.headers["Access-Control-Allow-Headers"] = "Authorization"
            return resp, status
        else:
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Headers"] = "Authorization"
            return response

    return decorated_function


event_bp = Blueprint('event_bp', __name__)

# Upload folder and allowed file types
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'event_media')
ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi', 'mkv' , 'ppt' , 'pptx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Backwards-compatible alias used in validation
ALLOWED_MEDIA_TYPES = ALLOWED_EXTENSIONS

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
@cors_headers
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
@cors_headers
def download_file(filename):
    try:
        return send_from_directory(
            directory=UPLOAD_FOLDER,
            path=filename,
            as_attachment=True  # forces download
        )
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

@event_bp.route('/events/university', methods=['POST'])
@cors_headers
def create_university_event():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # Required fields for university events
    required_fields = ["name", "date", "start_time", "end_time", "description", "venue", 
                       "status", "University", "faculty", "facilitator"]
    
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

   

    # Get next auto-increment event_id
    event_id = get_next_event_id()

    # Ensure facilitator is a list
    facilitators = data.get("facilitator", [])
    if not isinstance(facilitators, list):
        return jsonify({"error": "Facilitator must be a list"}), 400

    # Participants default
    participants = data.get("participants", {"registered": 0})

    # Modules validation
    modules = data.get("modules", [])
    if not isinstance(modules, list):
        return jsonify({"error": "'modules' must be a list of objects with moduleName and enrollmentKey"}), 400
    for mod in modules:
        if not isinstance(mod, dict) or "moduleName" not in mod or "enrollmentKey" not in mod:
            return jsonify({"error": "Each module must include 'moduleName' and 'enrollmentKey'"}), 400

    mongo.db.events.insert_one({
        "event_id": event_id,
        "type": "university",
        "name": data["name"],
        "date": data["date"],
        "start_time": data["start_time"],
        "end_time": data["end_time"],
        "description": data["description"],
        "status": data["status"],
        "venue": data["venue"],
        "University": data["University"],
        "faculty": data["faculty"],
        "facilitator": facilitators,
        "participants": participants,
        "modules": modules,  # store modules with enrollment keys
        "eventMedia": []
    })

    return jsonify({"message": "University event created successfully", "event_id": event_id}), 201

@event_bp.route('/events/school', methods=['POST'])
@cors_headers
def create_school_event():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing JSON data"}), 400

    # Required fields for school events
    required_fields = ["name", "date", "start_time", "end_time", "description", "venue", 
                       "status", "district", "zone", "school", "facilitator"]
    
    for field in required_fields:
        if not data.get(field):
            return jsonify({"error": f"Missing required field: {field}"}), 400

    event_id = get_next_event_id()

    facilitators = data.get("facilitator", [])
    if not isinstance(facilitators, list):
        return jsonify({"error": "Facilitator must be a list"}), 400

# Modules validation
    modules = data.get("modules", [])
    if not isinstance(modules, list):
        return jsonify({"error": "'modules' must be a list of objects with moduleName and enrollmentKey"}), 400
    for mod in modules:
        if not isinstance(mod, dict) or "moduleName" not in mod or "enrollmentKey" not in mod:
            return jsonify({"error": "Each module must include 'moduleName' and 'enrollmentKey'"}), 400
        
    participants = data.get("participants", {"registered": 0, })

    mongo.db.events.insert_one({
        "event_id": event_id,
        "type": "school",
        "name": data["name"],
        "date": data["date"],
        "start_time": data["start_time"],
        "end_time": data["end_time"],
        "description": data["description"],
        "status": data["status"],
        "venue": data["venue"],
        "district": data["district"],
        "zone": data["zone"],
        "school": data["school"],
        "facilitator": facilitators,
        "participants": participants,
        "modules": modules, 
        "eventMedia": []
    })

    return jsonify({"message": "School event created successfully", "event_id": event_id}), 201


# Get all events
from flask import make_response

from flask import make_response

@event_bp.route('/events', methods=['GET', 'OPTIONS'])
@cors_headers
def get_all_events():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        return response

    try:
        user_id = request.args.get("user_id")  # optional: frontend can send ?user_id=<id>
        joined_events = []

        # If user_id is provided, fetch joined_events list
        if user_id:
            try:
                user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
                if user and "joined_events" in user:
                    joined_events = user["joined_events"]
            except Exception:
                pass  # ignore invalid ObjectId or missing user

        events = []
        for e in mongo.db.events.find():
            e['_id'] = str(e['_id'])
            e['participants'] = e.get('participants', {"registered": 0, "confirmed": 0})
            e['numberOfSlots'] = e.get('numberOfSlots', 0)
            e['eventMedia'] = e.get('eventMedia', [])
            
            # ✅ Add joined flag
            e['joined'] = str(e['_id']) in joined_events

            events.append(e)

        response = make_response(jsonify(events), 200)
        response.headers.add("Access-Control-Allow-Origin", "*")
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get event by ObjectId

@event_bp.route('/events/<id>', methods=['GET'])
@cors_headers
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
@cors_headers
def get_all_feedback():
    participants = list(mongo.db.participants.find())
    for p in participants:
        p['_id'] = str(p['_id'])  # convert ObjectId to string
    return jsonify(participants)

# Update event (also accept university-specific path and preflight OPTIONS)
@event_bp.route('/events/university/<event_id>', methods=['PUT', 'OPTIONS'])
@event_bp.route('/events/<event_id>', methods=['PUT', 'OPTIONS'])
@cors_headers
def update_event(event_id):
    # If this was an OPTIONS preflight, cors_headers already handled it but
    # keep a defensive early return if needed
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "*")
        response.headers.add("Access-Control-Allow-Methods", "PUT, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        return response

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
@cors_headers
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
@cors_headers
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
@cors_headers
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
@cors_headers
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
@cors_headers
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
@cors_headers
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


@event_bp.route('/facilitators', methods=['GET'])
@cors_headers
def get_facilitators():
    try:
        facilitators = list(mongo.db.facilitators.find({"role": "facilitator"}))
        for f in facilitators:
            f["_id"] = str(f["_id"])
        return jsonify(facilitators), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@event_bp.route('/join-event', methods=['POST'])
@cors_headers
def join_event():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        user_id = data.get("user_id")
        event_id = data.get("event_id")

        if not user_id or not event_id:
            return jsonify({"error": "Missing user_id or event_id"}), 400

        # Validate event exists
        event = mongo.db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Validate user exists
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Initialize joined_events if missing
        if "joined_events" not in user:
            user["joined_events"] = []

        # Prevent duplicate join
        if event_id in user["joined_events"]:
            return jsonify({"message": "Already joined"}), 200

        # Add event to user's joined list
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"joined_events": event_id}}
        )

        # Increment event participant count
        mongo.db.events.update_one(
            {"_id": ObjectId(event_id)},
            {"$inc": {"participants.registered": 1}}
        )

        return jsonify({"message": "Event joined successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@event_bp.route('/enroll-module', methods=['POST'])
@cors_headers
def enroll_module():
    """
    Enroll a user in a module of an event using the enrollment key.
    Expects JSON body:
    {
        "user_id": "<user ObjectId>",
        "event_id": "<event ObjectId>",
        "moduleName": "<module name>",
        "enrollmentKey": "<key>"
    }
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Missing JSON body"}), 400

        user_id = data.get("user_id")
        event_id = data.get("event_id")
        module_name = data.get("moduleName")
        key_entered = data.get("enrollmentKey")

        if not all([user_id, event_id, module_name, key_entered]):
            return jsonify({"error": "Missing required fields"}), 400

        # Get event
        event = mongo.db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            return jsonify({"error": "Event not found"}), 404

        # Find the module
        module = next((m for m in event.get("modules", []) if m["moduleName"] == module_name), None)
        if not module:
            return jsonify({"error": "Module not found"}), 404

        # Validate enrollment key
        if module.get("enrollmentKey") != key_entered:
            return jsonify({"error": "Invalid enrollment key"}), 400

        # Add module to user's enrolledModules if not already enrolled
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404

        if "enrolledModules" not in user:
            user["enrolledModules"] = []

        # Check if already enrolled in this event module
        already_enrolled = any(
            em.get("event_id") == event_id and em.get("moduleName") == module_name
            for em in user["enrolledModules"]
        )

        if already_enrolled:
            return jsonify({"message": "Already enrolled"}), 200

        # Append enrolled module
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$push": {"enrolledModules": {"event_id": event_id, "moduleName": module_name}}}
        )

        return jsonify({"message": "Enrolled successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@event_bp.route('/get-modules/<event_id>', methods=['GET'])
@cors_headers
def get_modules_for_event(event_id):
    user_id = request.args.get("user_id")  # optional
    modules_list = []

    # Fetch modules for the event
    try:
        event = mongo.db.events.find_one({"_id": ObjectId(event_id)})
        if not event:
            return jsonify({"message": "Event not found", "modules": []}), 404
        modules_list = event.get("modules", [])
    except InvalidId:
        return jsonify({"message": "Invalid event ID", "modules": []}), 400
    except Exception as e:
        return jsonify({"message": f"Server error: {str(e)}", "modules": []}), 500

    # Fetch enrolled modules for user if user_id provided
    enrolled_module_names = set()
    if user_id:
        try:
            user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
            if user and "enrolledModules" in user:
                # Only include modules for this event
                enrolled_module_names = set(
                    m["moduleName"] for m in user["enrolledModules"] if m.get("event_id") == event_id
                )
        except InvalidId:
            pass
        except Exception as e:
            print("Error fetching user:", e)

    # Mark which modules are enrolled
    for module in modules_list:
        module["enrolled"] = module.get("moduleName") in enrolled_module_names

    return jsonify({"modules": modules_list}), 200
