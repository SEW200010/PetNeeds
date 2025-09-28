from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo
from flask_jwt_extended import create_access_token
from bson import ObjectId
from datetime import timedelta
from datetime import datetime


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
    province = data.get("province") 
    district = data.get("district") 
    zone = data.get("zone")
    address = data.get("location")
    school = data.get("school")
    contact = data.get("contact")
    status = "Pending"

    # Get current date as joinedDate
    joinedDate = datetime.now().strftime("%Y-%m-%d")  # e.g., "2025-08-20"

    if not all([[name, email, password, user_type, province, district, zone]]):
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
        "joinedDate": joinedDate,
        "province": province, 
        "district": district,
        "zone": zone,
        "location": address,
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
            "role": "admin",
            
        }), 200

    # ✅ Normal user login from MongoDB
    # Normal user login from MongoDB
    user = mongo.db.users.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        user_id = str(user["_id"])
        role = user.get("role", "").strip()  # remove extra spaces
        name = user.get("fullName", "Unknown")  # get the teacher's name
        province = user.get("province", "")
        district = user.get("district", "")
        zone = user.get("zone", "")

        # Debug print
        print(f"Login -> Name: '{name}', Role: '{role}',, Province: '{province}', District: '{district}', Zone: '{zone}'")

        access_token = create_access_token(
            identity=user_id,
            additional_claims={
                "role": role,
                "name": name , # include name in JWT
                "province": province,
                "district": district,
                "zone": zone
            },
            expires_delta=timedelta(hours=2)
        )

        return jsonify({
            "message": f"{role.capitalize()} login successful",
            "access_token": access_token,
            "user_id": user_id,
            "role": role,
            "name": name,
            "province": province,
            "district": district,
            "zone": zone
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401
