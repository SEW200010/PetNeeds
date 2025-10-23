from flask import jsonify,Blueprint
from bson import ObjectId
from flask_jwt_extended import jwt_required, get_jwt
from app import mongo
from flask import Blueprint, jsonify ,request
import traceback

facilitator_bp = Blueprint("facilitator_bp", __name__)

@facilitator_bp.route("/facilitators/info/<id>", methods=["GET"])
@jwt_required()
def get_facilitator_by_id(id):
    """Fetch a single facilitator by their ID."""
    claims = get_jwt()
    role = claims.get("role", "")

    
    # Only facilitators can access their own data
    if role != "facilitator":
        return jsonify({"error": "Access denied"}), 403

    try:
        facilitator = mongo.db.users.find_one(
            {"_id": ObjectId(id)},
            {"_id": 1, "fullname": 1, "email": 1, "isVerified": 1, },
        )

        if not facilitator:
            return jsonify({"error": "Facilitator not found"}), 404

        facilitator_data = {
            "id": str(facilitator["_id"]),
            "fullname": facilitator.get("fullname", ""),
            "email": facilitator.get("email", ""),
           
        
            "isVerified": facilitator.get("isVerified", False),
        }

        return jsonify(facilitator_data), 200

    except Exception as e:
        print("Error fetching facilitator by ID:", e)
        return jsonify({"error": "Invalid facilitator ID or database error"}), 500


@facilitator_bp.route("/api/facilitator/events/<user_id>", methods=["GET"])
def get_facilitator_events(user_id):
    try:
        print("Fetching events for facilitator:", user_id)

        # ✅ Build query safely
        try:
            facilitator_obj_id = ObjectId(user_id)
            query = {"facilitator": {"$in": [facilitator_obj_id, user_id]}}
        except:
            query = {"facilitator": {"$in": [user_id]}}

        print("Query:", query)

        # ✅ Query the events collection correctly
        events_cursor = mongo.db.events.find(query)
        events = list(events_cursor)   # 👈 No keyword args here

        print(f"Found {len(events)} events")

        # Convert ObjectId to string for JSON serialization
        for event in events:
            event["_id"] = str(event["_id"])

        return jsonify(events), 200

    except Exception as e:
        print("❌ Error fetching facilitator events:", e)
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
