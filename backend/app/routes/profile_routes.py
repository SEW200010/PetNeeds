from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from bson.json_util import dumps
from app import mongo
from flask import request
from werkzeug.security import generate_password_hash
import os
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')  # Absolute path
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


profile_bp = Blueprint("profile_bp", __name__)


@profile_bp.route("/api/user/<user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return dumps(user), 200
    return jsonify({"error": "User not found"}), 404


@profile_bp.route("/api/user/<user_id>/add-email", methods=["POST"])
@jwt_required()
def add_email(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return jsonify({"msg": "User not found"}), 404

    data = request.get_json()
    new_email = data.get("email")
    if not new_email:
        return jsonify({"msg": "Email is required"}), 400

    # Prevent adding the same email again
    if new_email == user.get("email") or new_email in user.get("otherEmails", []):
        return jsonify({"msg": "Email already exists"}), 400

    # Add the new email to otherEmails list
    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$push": {"otherEmails": new_email}}
    )

    # Return updated user data
    updated = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    updated["_id"] = str(updated["_id"])
    return jsonify(updated), 200


@profile_bp.route('/api/user/remove-email', methods=['DELETE'])
@jwt_required()
def remove_email():
    user_id = get_jwt_identity()
    data = request.get_json()
    email_to_remove = data.get('email')

    if not email_to_remove:
        return jsonify({"error": "Email is required"}), 400

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    updated_emails = [e for e in user.get("otherEmails", []) if e != email_to_remove]

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"otherEmails": updated_emails}}
    )

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    user["_id"] = str(user["_id"])
    return jsonify(user), 200


@profile_bp.route('/api/user/<user_id>/change-password', methods=["PUT"])
@jwt_required()
def change_password(user_id):
    try:
        current_user_id = get_jwt_identity()

        # Ensure authorized user is changing their own password
        if str(current_user_id) != str(user_id):
            return jsonify({"message": "Unauthorized"}), 403

        # Parse new password
        data = request.get_json()
        new_password = data.get("newPassword")

        if not new_password:
            return jsonify({"message": "Password is required"}), 400

        # Hash password using werkzeug
        new_hashed_password = generate_password_hash(new_password)

        # Update password in DB
        result = mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": new_hashed_password}}
        )

        if result.modified_count == 0:
            return jsonify({"message": "No changes made"}), 200

        return jsonify({"message": "Password updated successfully"}), 200

    except Exception as e:
        print("Error changing password:", str(e))
        return jsonify({"message": "Server error", "error": str(e)}), 500

@profile_bp.route('/api/user/<user_id>/upload-image', methods=['POST'])
@jwt_required()
def upload_profile_image(user_id):
    current_user_id = get_jwt_identity()
    if str(current_user_id) != str(user_id):
        return jsonify({"message": "Unauthorized"}), 403

    if 'image' not in request.files:
        return jsonify({"message": "No image file provided"}), 400

    image = request.files['image']
    if image and allowed_file(image.filename):
        filename = secure_filename(image.filename)
        filepath = os.path.join(UPLOAD_FOLDER, filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        image.save(filepath)

        # You’ll serve it at: http://localhost:5000/uploads/<filename>
        image_url = f"/uploads/{filename}"

        # Save in MongoDB
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"profileImage": image_url}}
        )

        return jsonify({"message": "Image uploaded", "imageUrl": image_url}), 200
    else:
        return jsonify({"message": "Invalid image file"}), 400


@profile_bp.route('/api/user/<user_id>/update', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    data = request.get_json()
    update_fields = {}

    for field in ["fullName", "email", "role", "location", "school", "contact"]:
        if data.get(field):
            update_fields[field] = data[field]

    result = mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        return jsonify({"error": "User not found"}), 404

    updated_user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    updated_user["_id"] = str(updated_user["_id"])
    return jsonify(updated_user), 200
