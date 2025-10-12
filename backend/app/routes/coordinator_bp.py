from flask import Blueprint, jsonify ,request
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt
from app import mongo
from bson import ObjectId
from datetime import datetime


coordinator_bp = Blueprint("coordinator_bp", __name__)

# -------------------------
# ✅ Get Zones by District Name for Coordinator (directly using district_name)
# -------------------------
@coordinator_bp.route("/coordinator/zones/<district_name>", methods=["GET"])
@jwt_required()
def get_zones_by_district_name(district_name):
    claims = get_jwt()
    role = claims.get("role", "")

    # Ensure only coordinators can access
    if role != "coordination":
        return jsonify({"error": "Access denied"}), 403

    # Fetch all zones with the given district_name
    zones = list(
        mongo.db.zones.find({"district_name": district_name}, {"_id": 1, "name": 1, "district_name": 1})
    )

    if not zones:
        return jsonify({"error": "No zones found for this district"}), 404

    zones_list = [{"id": str(z["_id"]), "name": z["name"]} for z in zones]

    return jsonify({
        "coordinator": {
            
            "district": district_name
        },
        "zones": zones_list
    }), 200


# -------------------------
# ✅ Get Events by Zone ID
# -------------------------
@coordinator_bp.route("/zone/<zone_id>/events", methods=["GET"])
@jwt_required()
def get_events_by_zone(zone_id):
    claims = get_jwt()
    role = claims.get("role", "")

    # Ensure only coordinators can access
    if role != "coordination":
        return jsonify({"error": "Access denied"}), 403

    try:
        from bson import ObjectId
        zone_obj_id = ObjectId(zone_id)
    except Exception:
        return jsonify({"error": "Invalid zone ID"}), 400

    # Fetch events for this zone
    events = list(
        mongo.db.events.find({"zone_id": zone_obj_id}, {"_id": 1, "name": 1, "date": 1, "description": 1})
    )

    if not events:
        return jsonify({"error": "No events found for this zone"}), 404

    events_list = [
        {
            "id": str(e["_id"]),
            "name": e["name"],
            "date": e.get("date"),
            "description": e.get("description", "")
        }
        for e in events
    ]

    return jsonify({"zone_id": zone_id, "events": events_list}), 200



@coordinator_bp.route("/zone/<zone_name>/events", methods=["GET"])
@jwt_required()
def get_events_by_zone_name(zone_name):
    claims = get_jwt()
    role = claims.get("role", "")

    # ✅ Only coordinators can access
    if role != "coordination":
        return jsonify({"error": "Access denied"}), 403

    # ✅ Find the zone by its name
    zone = mongo.db.zones.find_one({"name": zone_name})
    if not zone:
        return jsonify({"error": f"No zone found with name '{zone_name}'"}), 404

    # ✅ Fetch events for this zone
    events = list(
        mongo.db.events.find(
            {"zone_name": zone_name},   # assuming events collection stores zone_name
            {"_id": 1, "title": 1, "date": 1, "location": 1}
        )
    )

    events_list = [
        {
            "id": str(event["_id"]),
            "title": event["title"],
            "date": event.get("date"),
            "location": event.get("location"),
        }
        for event in events
    ]

    return jsonify({
        "zone": zone_name,
        "events": events_list
    }), 200


from bson import ObjectId
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from bson import ObjectId
from app import mongo

coordinator_bp = Blueprint("coordinator_bp", __name__)

# -------------------------
# ✅ Get Faculties by University Name
# -------------------------
@coordinator_bp.route("/faculties/<university_name>", methods=["GET"])
@jwt_required()
def get_faculties_by_university(university_name):
    claims = get_jwt()
    role = claims.get("role", "")

    # ✅ Only coordinators can access
   # if role != "coordination":
    #    return jsonify({"error": "Access denied"}), 403

    faculties = list(
        mongo.db.faculties.find(
            {"university_name": university_name},
            {"_id": 1, "faculty_name": 1, "university_name": 1}
        )
    )

    if not faculties:
        return jsonify({"error": f"No faculties found for {university_name}"}), 404

    faculties_list = [
        {"id": str(f["_id"]), "faculty_name": f["faculty_name"]}
        for f in faculties
    ]

    return jsonify({
        "university": university_name,
        "items": faculties_list
    }), 200


# -------------------------
# ✅ Get Schools by Zone
# -------------------------
@coordinator_bp.route("/schools/<zone_name>", methods=["GET"])
@jwt_required()
def get_schools_by_zone(zone_name):
    claims = get_jwt()
    role = claims.get("role", "")

    # ✅ Only coordinators can access
    #if role != "coordination":
    #    return jsonify({"error": "Access denied"}), 403

# Normalize input (case-insensitive, trim spaces)
    zone_name = zone_name.strip()

    schools = list(
        mongo.db.schools.find(
            {"zone_name": {"$regex": f"^{zone_name}$", "$options": "i"}},  # case-insensitive exact match
            {"_id": 1, "name": 1, "zone_name": 1}
        )
    )
    
    schools = list(
        mongo.db.schools.find(
            {"zone": zone_name},
            {"_id": 1, "school_name": 1, "zone": 1, "district": 1}
        )
    )

    if not schools:
        return jsonify({"error": f"No schools found in zone '{zone_name}'"}), 404

    schools_list = [
        {"id": str(s["_id"]), "school_name": s["school_name"]}
        for s in schools
    ]

    return jsonify({
        "zone": zone_name,
        "items": schools_list
    }), 200

@coordinator_bp.route("/faculty/<university_name>/<faculty_name>/events", methods=["GET"])
@jwt_required()
def get_faculty_events(university_name, faculty_name):
    """Get events under a specific faculty of a university."""
    faculty = mongo.db.faculties.find_one({
        "university_name": {"$regex": f"^{university_name}$", "$options": "i"},
        "faculty_name": {"$regex": f"^{faculty_name}$", "$options": "i"},
    })

    print({"university_name": university_name, "faculty_name": faculty_name})

    if not faculty:
        return jsonify({"error": "Faculty not found"}), 404

    # ✅ Fetch events properly (indented inside function)
    events = list(mongo.db.events.find(
        {
            "University": faculty["university_name"],
            "faculty": faculty["faculty_name"]
        },
        {
            "_id": 1,
            "name": 1,
            "date": 1,
            "description": 1,
            "venue": 1,
            "start_time": 1,
            "end_time": 1,
            "facilitator": 1,
            "modules": 1  # ✅ correct key name
        }
    ))

    # ✅ Format data for JSON response
    formatted_events = []
    for e in events:
        formatted_events.append({
            "id": str(e["_id"]),
            "title": e.get("name", ""),
            "location": e.get("venue", ""),
            "date": e.get("date", ""),
            "description": e.get("description", ""),
            "start_time": e.get("start_time", ""),
            "end_time": e.get("end_time", ""),
            "facilitator": [str(f) for f in e.get("facilitator", [])],
            "modules": e.get("modules", [])
        })

    print({"events": formatted_events})
    return jsonify({
        "university": university_name,
        "faculty": faculty_name,
        "events": formatted_events
    }), 200





@coordinator_bp.route("/faculty/<university_name>/<faculty_name>/users", methods=["GET"])
@jwt_required()
def get_faculty_users(university_name, faculty_name):
    """Get users under a specific faculty of a university."""
    claims = get_jwt()
    role = claims.get("role", "")

    # Only coordinators can access
    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    users = list(mongo.db.users.find({
        "university_name": {"$regex": f"^{university_name}$", "$options": "i"},
        "faculty_name": {"$regex": f"^{faculty_name}$", "$options": "i"}
    }, {"_id": 1, "fullname": 1, "email": 1 ,"role":1}))

    print({"users":users})
    if not users:
        return jsonify({"error": f"No users found for {faculty_name} in {university_name}"}), 404


    users_list = [
        {"id": str(u["_id"]), "name": u["fullname"], "email": u.get("email", "") , "role": u.get("role", "")}
        for u in users
    ]

    return jsonify({
        "university": university_name,
        "faculty": faculty_name,
        "users": users_list
    }), 200


@coordinator_bp.route("/school/<zone>/<school_name>/events", methods=["GET"])
@jwt_required()
def get_school_events(zone, school_name):
    """Get events under a specific school within a zone."""
    school = mongo.db.schools.find_one({
        "zone": {"$regex": f"^{zone}$", "$options": "i"},
        "school_name": {"$regex": f"^{school_name}$", "$options": "i"}
    })

    if not school:
        return jsonify({"error": "School not found"}), 404

    events = list(mongo.db.events.find({
        "zone": school["zone"],
        "school_name": school["school_name"]
    }, {"_id": 1, "title": 1, "date": 1, "location": 1}))

    return jsonify({
        "zone": zone,
        "school": school_name,
        "events": [
            {"id": str(e["_id"]), "title": e["title"], "date": e.get("date"), "location": e.get("location", "")}
            for e in events
        ]
    }), 200


@coordinator_bp.route("/school/<zone>/<school_name>/users", methods=["GET"])
@jwt_required()
def get_school_users(zone, school_name):
    """Get users under a specific school within a zone."""
    users = list(mongo.db.users.find({
        "zone": {"$regex": f"^{zone}$", "$options": "i"},
        "school_name": {"$regex": f"^{school_name}$", "$options": "i"}
    }, {"_id": 1, "name": 1, "email": 1}))

    return jsonify({
        "zone": zone,
        "school": school_name,
        "users": [
            {"id": str(u["_id"]), "name": u["name"], "email": u.get("email", "")}
            for u in users
        ]
    }), 200

# -------------------------
# ✅ Add New User (Faculty or School)
# -------------------------
@coordinator_bp.route("/users/add", methods=["POST"])
@jwt_required()
def add_user():
    """Add a new user under a faculty or school."""
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()

    required_fields = ["fullname", "email", "password", "role"]
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    # Check duplicate email
    if mongo.db.users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already exists"}), 400

    user_data = {
        "fullname": data["fullname"],
        "email": data["email"],
        "password": generate_password_hash(data["password"]),
        "role": data["role"],
        "university_name": data.get("university_name"),
        "faculty_name": data.get("faculty_name"),
        "zone": data.get("zone"),
        "school_name": data.get("school_name"),
        "created_at": datetime.utcnow(),
    }

    result = mongo.db.users.insert_one(user_data)

    return jsonify({
        "message": "User added successfully",
        "id": str(result.inserted_id)
    }), 201


# -------------------------
# ✅ Edit Existing User
# -------------------------
@coordinator_bp.route("/users/<user_id>/edit", methods=["PUT"])
@jwt_required()
def edit_user(user_id):
    """Edit an existing user's details."""
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json()
    try:
        user_obj_id = ObjectId(user_id)
    except:
        return jsonify({"error": "Invalid user ID"}), 400

    update_data = {}

    # Allow updating name, email, role, password, and associations
    for field in ["fullname", "email", "role", "university_name", "faculty_name", "zone", "school_name"]:
        if field in data:
            update_data[field] = data[field]

    if "password" in data and data["password"]:
        update_data["password"] = generate_password_hash(data["password"])

    if not update_data:
        return jsonify({"error": "No valid fields to update"}), 400

    result = mongo.db.users.update_one({"_id": user_obj_id}, {"$set": update_data})

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User updated successfully"}), 200

   # -------------------------
# ✅ Delete Event by ID (University or School)
# -------------------------
@coordinator_bp.route("/events/<event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    """Delete an event by its ID."""
    claims = get_jwt()
    role = claims.get("role", "")

    # Only coordinators can delete events
    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        event_obj_id = ObjectId(event_id)
    except:
        return jsonify({"error": "Invalid event ID"}), 400

    # Find the event before deleting (for logging or returning)
    event = mongo.db.events.find_one({"_id": event_obj_id})
    if not event:
        return jsonify({"error": "Event not found"}), 404

    # Delete the event
    result = mongo.db.events.delete_one({"_id": event_obj_id})
    if result.deleted_count == 1:
        # Optionally, you can return the deleted event data
        deleted_event = {
            "id": str(event["_id"]),
            "title": event.get("title") or event.get("name"),
            "location": event.get("location") or event.get("venue"),
            "date": event.get("date"),
            "description": event.get("description"),
            "start_time": event.get("start_time"),
            "end_time": event.get("end_time"),
            "facilitator": [str(f) for f in event.get("facilitator", [])],
            "modules": event.get("modules", [])
        }
        return jsonify({"message": "Event deleted successfully", "deleted_event": deleted_event}), 200
    else:
        return jsonify({"error": "Failed to delete event"}), 500
