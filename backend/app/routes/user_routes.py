from flask import Blueprint, jsonify ,request
from app import mongo, mail
from flask_mail import Message
from werkzeug.security import generate_password_hash
from bson import ObjectId
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
        "password": generate_password_hash(data.get("password", data["email"])), #default password will assign to new users created by admin
        "role": data.get("role", "student"),
        "status": "Pending",  
        "joinDate": data.get("joinDate", "2025-01-01"),
        "location": data.get("location", ""),
        "school": data.get("school", ""),
        "contact": data.get("contact", ""),
    }

    mongo.db.users.insert_one(new_user)
    return jsonify({"message": "User added successfully", "user": new_user}), 201
# ---------------------- GET USER BY ID ----------------------
@user_bp.route("/<user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Convert ObjectId to string for JSON
        user["_id"] = str(user["_id"])
        # Optionally, remove password before sending
        user.pop("password", None)
        return jsonify(user), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# ---------------------- UPDATE USER ----------------------
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


# ---------------------- DELETE USER ----------------------
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = mongo.db.users.delete_one({"id": user_id})
    if result.deleted_count == 1:
        return jsonify({"message": "User deleted"}), 200
    else:
        return jsonify({"message": "User not found"}), 404


# ---------------------- VERIFY / TOGGLE USER STATUS ----------------------
@user_bp.route("/verify/<int:user_id>", methods=["PUT"])
def verify_user(user_id):
    user = mongo.db.users.find_one({"id": user_id})

    if not user:
        return jsonify({"message": "User not found"}), 404

    # Handle first-time verification from Pending → Active
    current_status = user.get("status", "Pending")
    if current_status not in ["Active", "Inactive"]:
        new_status = "Active"
    else:
        new_status = "Inactive" if current_status == "Active" else "Active"

    result = mongo.db.users.update_one({"id": user_id}, {"$set": {"status": new_status}})
    if result.modified_count != 1:
        return jsonify({"message": "Failed to update user status"}), 500

    # Send Email Notification
    user_email = user.get("email")
    if user_email:
        try:
            subject = f"Update: Your Account Has Been {new_status}"
            msg = Message(subject=subject, recipients=[user_email])
            msg.body = f"""
Hello {user.get('fullName', '')},
We would like to notify you that the status of your account on the Varppu Counseling System has been updated to {new_status}.
▶️ If your account is now Active, you can log in and begin using the available counseling features and services.
⛔ If your account has been set to Inactive, you may not have access until reactivation. If you believe this was a mistake, please contact the system administrator.
If you have any questions or require further assistance, feel free to reach out to us at support@varppu.lk.
Thank you for being a part of the Varppu community.
Warm regards,  
Varppu Counseling System Team
"""
            mail.send(msg)
        except Exception as e:
            print("Email sending failed:", e)

    return jsonify({"message": f"User status updated to {new_status}"}), 200