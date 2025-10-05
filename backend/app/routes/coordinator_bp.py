from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app import mongo

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

@coordinator_bp.route("/zone/<zone_id>/events", methods=["GET"])
@jwt_required()
def get_events_by_zone_id(zone_id):
    claims = get_jwt()
    role = claims.get("role", "")

    # ✅ Only coordinators can access
    if role != "coordination":
        return jsonify({"error": "Access denied"}), 403

    # ✅ Validate zone_id and find the zone
    try:
        zone = mongo.db.zones.find_one({"_id": ObjectId(zone_id)})
    except:
        return jsonify({"error": "Invalid zone ID"}), 400

    if not zone:
        return jsonify({"error": f"No zone found with id '{zone_id}'"}), 404

    # ✅ Fetch events linked to this zone
    events = list(
        mongo.db.events.find(
            {"zone_id": str(zone["_id"])},   # assuming events store zone_id as string
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
        "zone": {"id": str(zone["_id"]), "name": zone["name"]},
        "events": events_list
    }), 200



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
    if role != "coordination":
        return jsonify({"error": "Access denied"}), 403

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