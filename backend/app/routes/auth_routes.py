from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo
from flask_jwt_extended import create_access_token
from bson import ObjectId
from datetime import timedelta

auth_bp = Blueprint('auth_bp', __name__)

# -------------------------
# ✅ Register Route
# -------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type", "user")  # default role is "user"
    location = data.get("location")
    school = data.get("school")
    contact = data.get("contact")
    status = "Pending"
    joinDate = "2025-01-01"

    if not all([name, email, password, user_type]):
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = generate_password_hash(password)
    
    default_profile_image = "/uploads/default.png"
    
    mongo.db.users.insert_one({
        "fullName": name,
        "email": email,
        "password": hashed_password,
        "role": user_type,
        "status": status,
        "joinedDate": joinDate,
        "location": location,
        "school": school,
        "contact": contact,
        "profileImage": default_profile_image
    })

    return jsonify({"message": "User registered successfully"}), 201

# -------------------------
# ✅ Login Route
# -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # ✅ Optional: Hardcoded admin login (not from DB)
    if email == "admin@admin.com" and password == "admin123":
        access_token = create_access_token(
            identity="admin",
            additional_claims={"role": "admin"},
            expires_delta=timedelta(hours=2)
        )
        return jsonify({
            "message": "Admin login successful",
            "access_token": access_token,
            "user_id": "admin",
            "role": "admin"
        }), 200

    # ✅ Normal user login from MongoDB
    user = mongo.db.users.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        user_id = str(user["_id"])
        role = user.get("role", "user")

        access_token = create_access_token(
            identity=user_id,
            additional_claims={"role": role},
            expires_delta=timedelta(hours=2)
        )

        return jsonify({
            "message": f"{role.capitalize()} login successful",
            "access_token": access_token,
            "user_id": user_id,
            "role": role
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401
