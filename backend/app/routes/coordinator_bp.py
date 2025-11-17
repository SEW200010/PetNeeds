import os
from flask import Blueprint, jsonify ,request, current_app, send_from_directory
from werkzeug.security import generate_password_hash
from flask_jwt_extended import jwt_required, get_jwt
from app import mongo
from bson import ObjectId
from datetime import datetime
from werkzeug.utils import secure_filename


coordinator_bp = Blueprint("coordinator_bp", __name__)

# Folder to store uploaded module documents
UPLOAD_FOLDER = "uploads/modules"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Allowed file extensions
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx", "pptx", "txt", "png", "jpg", "jpeg"}


def is_allowed_file(filename):
    """Check if uploaded file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Folder for coordinator reports
REPORTS_FOLDER = "uploads/reports"
os.makedirs(REPORTS_FOLDER, exist_ok=True)




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
            {"_id": 1, "faculty_name": 1, "university_name": 1 ,"dean":1,"contact":1}
        )
    )

    if not faculties:
        return jsonify({"error": f"No faculties found for {university_name}"}), 404

    faculties_list = [
        {"id": str(f["_id"]), "faculty_name": f["faculty_name"], "dean":f.get("dean",""), "contact":f.get("contact",{})}
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
        "isVerified": False if data.get("role") == "facilitator" else True ,
        "joinedDate": datetime.utcnow(),
        "organization_unit": data.get("organization_unit"), 
        "school_name": data.get("school_name") or "",
        "zone": data.get("zone") or "",
        "district": data.get("district") or "", # faculty or school
        "university_name": data.get("university_name") or "",
        "faculty_name": data.get("faculty_name") or "",
        "address": data.get("address"),
        "contact": data.get("contact"),
        "profileImage" :"/uploads/default.png",
        "lastLogin": None,
    }

    result = mongo.db.users.insert_one(user_data)

    if user_data["role"] == "coordinator":
        res1 =mongo.db.coordinators.insert_one(user_data)
    elif user_data["role"] == "facilitator":
        res1 =mongo.db.facilitators.insert_one(user_data)
    elif user_data["role"] == "student":
        res1 =mongo.db.students.insert_one(user_data)

    return jsonify({
        "message": "User added successfully",
        "id": str(result.inserted_id),
        "id2": str(res1.inserted_id)
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

    if update_data["role"] == "coordinator":
        mongo.db.coordinators.update_one({"_id": user_obj_id}, {"$set": update_data})
    elif update_data["role"] == "facilitator":
        mongo.db.facilitators.update_one({"_id": user_obj_id}, {"$set": update_data})
    elif update_data["role"] == "student":
        mongo.db.students.update_one({"_id": user_obj_id}, {"$set": update_data})

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    return jsonify({"message": "User updated successfully"}), 200


@coordinator_bp.route("/users/<user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    """Delete a user by MongoDB ObjectId (string)."""
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        user_obj_id = ObjectId(user_id)
    except Exception:
        return jsonify({"error": "Invalid user ID"}), 400

    result = mongo.db.users.delete_one({"_id": user_obj_id})

     # Find the user first
    user = mongo.db.students.find_one({"_id": user_obj_id})
    if user:
        mongo.db.students.delete_one({"_id": user_obj_id})

    user = mongo.db.facilitators.find_one({"_id": user_obj_id})
    if user:
        mongo.db.facilitators.delete_one({"_id": user_obj_id})

    user = mongo.db.coordinators.find_one({"_id": user_obj_id})
    if user:
        mongo.db.coordinators.delete_one({"_id": user_obj_id})

    if result.deleted_count == 1:
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"error": "User not found"}), 404



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

# -------------------------
# ✅ Get Facilitators by University Name
# -------------------------
@coordinator_bp.route("/facilitators/<university_name>", methods=["GET"])
@jwt_required()
def get_facilitators_by_university(university_name):
    """Fetch all facilitators belonging to a specific university."""
    claims = get_jwt()
    role = claims.get("role", "")

    # Only coordinators can access
    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    # Fetch facilitators
    facilitators = list(
        mongo.db.facilitators.find(
            {"university_name": {"$regex": f"^{university_name}$", "$options": "i"}},  # case-insensitive
            {"_id": 1, "fullname": 1, "email": 1, "faculty_name": 1,"isVerified":1,}
        )
    )

    if not facilitators:
        return jsonify({"error": f"No facilitators found for {university_name}"}), 404

    facilitators_list = [
        {
            "_id": str(f["_id"]),
            "id": str(f["_id"]),
            "fullname": f.get("fullname", ""),
            "email": f.get("email", ""),
            "faculty": f.get("faculty_name", ""),
            "isVerified": f.get("isVerified", "")
        }
        for f in facilitators
    ]

    print({"facilitators": facilitators_list})
    print("done")
    return jsonify({
        "university": university_name,
        "facilitators": facilitators_list
    }), 200


# -------------------------
# ✅ Update facilitator verification status
# -------------------------
@coordinator_bp.route("/facilitators/<facilitator_id>/verify", methods=["PUT"])
@jwt_required()
def set_facilitator_verification(facilitator_id):
    """Set or clear the isVerified flag for a facilitator.
    Expects JSON body: { "isVerified": true|false }
    """
    claims = get_jwt()
    role = claims.get("role", "")

    # Only coordinators can update facilitator verification
    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json() or {}
    if "isVerified" not in data:
        return jsonify({"error": "Missing 'isVerified' in request body"}), 400

    try:
        fac_obj_id = ObjectId(facilitator_id)
    except Exception:
        return jsonify({"error": "Invalid facilitator id"}), 400

    is_verified = bool(data.get("isVerified"))

    result = mongo.db.facilitators.update_one(
        {"_id": fac_obj_id},
        {"$set": {"isVerified": is_verified}}
    )

    if result.matched_count == 0:
        return jsonify({"error": "Facilitator not found"}), 404

    return jsonify({"message": "Updated", "isVerified": is_verified}), 200


# -------------------------
# ✅ Add New Faculty (matches frontend payload)
# -------------------------
@coordinator_bp.route("/faculties/add", methods=["POST"])
@jwt_required()
def add_faculty():
    """Add a new faculty under a university."""
    claims = get_jwt()
    role = claims.get("role", "")

    # Only coordinators can add faculties
    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    data = request.get_json() or {}

    # Map frontend keys to backend keys
    university_name = data.get("university", "").strip()
    faculty_name = data.get("faculty_name", "").strip()
    dean = data.get("dean", "").strip()
    contact = data.get("contact", {})

    # Validate required fields
    if not university_name or not faculty_name or not dean or not contact:
        return jsonify({"error": "Missing required fields"}), 400

    # Check for duplicate faculty under the same university
    existing = mongo.db.faculties.find_one({
        "university_name": {"$regex": f"^{university_name}$", "$options": "i"},
        "faculty_name": {"$regex": f"^{faculty_name}$", "$options": "i"}
    })
    if existing:
        return jsonify({"error": "Faculty already exists under this university"}), 400

    # Build MongoDB document
    faculty_doc = {
        "university_name": university_name,
        "faculty_name": faculty_name,
        "dean": dean,
        "contact": {
            "email": contact.get("email", ""),
            "phone": contact.get("phone", "")
        },
        "created_at": datetime.utcnow()
    }

    result = mongo.db.faculties.insert_one(faculty_doc)

    return jsonify({
        "message": "Faculty added successfully",
        "id": str(result.inserted_id)
    }), 201


# ✅ UPDATE EXISTING FACULTY
@coordinator_bp.route("/faculties/<faculty_id>", methods=["PUT"])
@jwt_required()
def update_faculty(faculty_id):
    """Edit an existing faculty."""
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        faculty_obj_id = ObjectId(faculty_id)
    except Exception:
        return jsonify({"error": "Invalid faculty ID"}), 400

    data = request.get_json() or {}
    update_data = {}

    for field in ["faculty_name", "dean", "contact"]:
        if field in data:
            update_data[field] = data[field]

    if not update_data:
        return jsonify({"error": "No valid fields provided"}), 400

    result = mongo.db.faculties.update_one({"_id": faculty_obj_id}, {"$set": update_data})

    if result.matched_count == 0:
        return jsonify({"error": "Faculty not found"}), 404

    return jsonify({"message": "Faculty updated successfully"}), 200


# ✅ DELETE FACULTY
@coordinator_bp.route("/faculties/<faculty_id>", methods=["DELETE"])
@jwt_required()
def delete_faculty(faculty_id):
    """Delete a faculty by its ID."""
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        faculty_obj_id = ObjectId(faculty_id)
    except Exception:
        return jsonify({"error": "Invalid faculty ID"}), 400

    result = mongo.db.faculties.delete_one({"_id": faculty_obj_id})

    if result.deleted_count == 0:
        return jsonify({"error": "Faculty not found"}), 404

    return jsonify({"message": "Faculty deleted successfully"}), 200


# -----------------------------------------------------------------
# 📌 Get all modules
# -----------------------------------------------------------------
@coordinator_bp.route("/modules", methods=["GET"])
@jwt_required()
def get_modules():
    try:
        modules = list(mongo.db.modules.find())
        for m in modules:
            m["id"] = str(m["_id"])
            m["_id"] = str(m["_id"])
        return jsonify({"items": modules}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------------------------------------------
# 📌 Add new module (with file uploads)
# -----------------------------------------------------------------
@coordinator_bp.route("/modules/add", methods=["POST"])
@jwt_required()
def add_module():
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    module_name = request.form.get("module_name", "").strip()
    if not module_name:
        return jsonify({"error": "Module name is required"}), 400

    # Handle file uploads
    files = request.files.getlist("documents")
    documents = []

    for file in files:
        if not file or file.filename == "":
            continue  # skip empty uploads
        if not is_allowed_file(file.filename):
            return jsonify({"error": f"Invalid file type: {file.filename}"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        documents.append({
            "name": filename,
            "url": f"/modules/files/{filename}"
        })

    module_data = {
        "module_name": module_name,
        "documents": documents,
        "created_at": datetime.utcnow()
    }

    inserted = mongo.db.modules.insert_one(module_data)
    return jsonify({
        "message": "Module added successfully",
        "id": str(inserted.inserted_id)
    }), 201


# -----------------------------------------------------------------
# 📌 Update existing module (optional new files)
# -----------------------------------------------------------------
@coordinator_bp.route("/modules/<module_id>", methods=["PUT"])
@jwt_required()
def update_module(module_id):
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        obj_id = ObjectId(module_id)
    except:
        return jsonify({"error": "Invalid module ID"}), 400

    module = mongo.db.modules.find_one({"_id": obj_id})
    if not module:
        return jsonify({"error": "Module not found"}), 404

    module_name = request.form.get("module_name", module["module_name"])
    new_files = request.files.getlist("documents")

    updated_docs = module.get("documents", [])

    # Add new documents
    for file in new_files:
        if not file or file.filename == "":
            continue
        if not is_allowed_file(file.filename):
            return jsonify({"error": f"Invalid file type: {file.filename}"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        updated_docs.append({
            "name": filename,
            "url": f"/modules/files/{filename}"
        })

    mongo.db.modules.update_one(
        {"_id": obj_id},
        {"$set": {"module_name": module_name, "documents": updated_docs}}
    )

    return jsonify({"message": "Module updated successfully"}), 200


# -----------------------------------------------------------------
# 📌 Delete module
# -----------------------------------------------------------------
@coordinator_bp.route("/modules/<module_id>", methods=["DELETE"])
@jwt_required()
def delete_module(module_id):
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        obj_id = ObjectId(module_id)
    except:
        return jsonify({"error": "Invalid module ID"}), 400

    deleted = mongo.db.modules.delete_one({"_id": obj_id})
    if deleted.deleted_count == 0:
        return jsonify({"error": "Module not found"}), 404

    return jsonify({"message": "Module deleted successfully"}), 200


# -----------------------------------------------------------------
# 📌 Serve uploaded files
# -----------------------------------------------------------------
@coordinator_bp.route("/modules/files/<filename>", methods=["GET"])
def get_file(filename):
    """Serve uploaded files from the uploads/modules directory."""
    try:
        return send_from_directory(UPLOAD_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404

    return send_from_directory(UPLOAD_FOLDER, filename)


# -------------------------
# Coordinator Reports Endpoints
# -------------------------
@coordinator_bp.route("/coordinator/reports", methods=["POST"])
@jwt_required()
def upload_report():
    """Upload a coordinator report (file + metadata).
    Expects multipart/form-data with fields: title, summary, month (optional), year (optional), university_name (optional) and file field 'file'.
    """
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    # Try to derive university from token claims first, fallback to form
    university_name = claims.get("university_name") or request.form.get("university_name") or ""

    title = request.form.get("title", "").strip()
    summary = request.form.get("summary", "").strip()
    month = request.form.get("month")
    year = request.form.get("year")

    if not title or "file" not in request.files:
        return jsonify({"error": "Missing title or file"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Empty file"}), 400

    if not is_allowed_file(file.filename):
        return jsonify({"error": "Invalid file type"}), 400

    filename = secure_filename(file.filename)
    # add timestamp prefix to avoid overwriting
    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")
    saved_name = f"{timestamp}_{filename}"
    file_path = os.path.join(REPORTS_FOLDER, saved_name)
    file.save(file_path)

    report_doc = {
        "university_name": university_name,
        "title": title,
        "summary": summary,
        "month": month,
        "year": year,
        "filename": saved_name,
        "original_filename": filename,
        "uploaded_by": claims.get("sub") or claims.get("email") or "",
        "uploaded_at": datetime.utcnow()
    }

    inserted = mongo.db.reports.insert_one(report_doc)

    return jsonify({"message": "Report uploaded", "id": str(inserted.inserted_id)}), 201


@coordinator_bp.route("/coordinator/reports/<university_name>", methods=["GET"])
@jwt_required()
def list_reports(university_name):
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    reports = list(mongo.db.reports.find({"university_name": {"$regex": f"^{university_name}$", "$options": "i"}}).sort("uploaded_at", -1))

    items = []
    for r in reports:
        items.append({
            "id": str(r.get("_id")),
            "title": r.get("title"),
            "summary": r.get("summary"),
            "month": r.get("month"),
            "year": r.get("year"),
            "filename": r.get("filename"),
            "original_filename": r.get("original_filename"),
            "uploaded_by": r.get("uploaded_by"),
            "uploaded_at": (r.get("uploaded_at").isoformat() if r.get("uploaded_at") else None)
        })

    return jsonify({"university": university_name, "items": items}), 200


@coordinator_bp.route("/coordinator/reports/files/<filename>", methods=["GET"])
def serve_report_file(filename):
    try:
        return send_from_directory(REPORTS_FOLDER, filename)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404


@coordinator_bp.route("/coordinator/reports/<report_id>", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    claims = get_jwt()
    role = claims.get("role", "")

    if role != "coordinator":
        return jsonify({"error": "Access denied"}), 403

    try:
        obj_id = ObjectId(report_id)
    except Exception:
        return jsonify({"error": "Invalid report id"}), 400

    report = mongo.db.reports.find_one({"_id": obj_id})
    if not report:
        return jsonify({"error": "Report not found"}), 404

    filename = report.get("filename")
    if filename:
        try:
            os.remove(os.path.join(REPORTS_FOLDER, filename))
        except Exception:
            pass

    mongo.db.reports.delete_one({"_id": obj_id})
    return jsonify({"message": "Report deleted"}), 200
