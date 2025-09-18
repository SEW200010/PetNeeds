from flask import Blueprint, jsonify
from app import mongo

user_bp = Blueprint("user", __name__, url_prefix="/api/users")

@user_bp.route("/", methods=["GET"])
def get_users():
    users = list(mongo.db.users.find({}, {"_id": 0}))  # Exclude _id or convert to string
    return jsonify(users)

@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = mongo.db.users.delete_one({"id": user_id})
    if result.deleted_count == 1:
        return jsonify({"message": "User deleted"}), 200
    else:
        return jsonify({"message": "User not found"}), 404
    
@user_bp.route("/verify/<int:user_id>", methods=["PUT"])
def verify_user(user_id):
    result = mongo.db.users.update_one(
        {"id": user_id},
        {"$set": {"status": "Active"}}
    )
    if result.modified_count == 1:
        return jsonify({"message": "User verified successfully"}), 200
    else:
        return jsonify({"message": "User not found or already active"}), 404

from flask import request

@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    data = request.json
    update_fields = {
        "fullName": data.get("fullName"),
        "location": data.get("location"),
        "school": data.get("school"),
        "contact": data.get("contact"),
        "email": data.get("email"),
    }

    result = mongo.db.users.update_one({"id": user_id}, {"$set": update_fields})
    if result.modified_count == 1:
        return jsonify({"message": "User updated successfully"}), 200
    else:
        return jsonify({"message": "No changes made or user not found"}), 404

@user_bp.route("/", methods=["POST"])
def add_user():
    data = request.json
    required_fields = ["fullName", "email"]

    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Auto-generate a unique 'id' field
    last_user = mongo.db.users.find_one(sort=[("id", -1)])
    next_id = (last_user["id"] + 1) if last_user else 1

    new_user = {
        "id": next_id,
        "fullName": data.get("fullName"),
        "email": data.get("email"),
        "role": data.get("role", "student"),
        "status": "Pending",  
        "joinDate": data.get("joinDate", "2025-01-01"),
        "location": data.get("location", ""),
        "school": data.get("school", ""),
        "contact": data.get("contact", ""),
    }

    mongo.db.users.insert_one(new_user)
    return jsonify({"message": "User added successfully", "user": new_user}), 201

    
