from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo

auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")
    location = data.get("location")
    school = data.get("school")
    contact = data.get("contact")
    status = "Pending"
    joinDate = "2025-01-01"
       

    if not all([name, email, password, user_type]):
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)
    mongo.db.users.insert_one({
        "fullName": name,
        "email": email,
        "password": hashed_password,
        "role": user_type,
        "status" : status,
        "joinedDate" : joinDate,
        "location" : location,
        "school" : school,
        "contact" : contact

    })

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email == "admin@admin.com" and password == "admin123":
        return jsonify({"message": "Admin login successful"}), 200

    user = mongo.db.users.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "User login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
