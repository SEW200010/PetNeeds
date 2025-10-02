from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import mongo
from flask_jwt_extended import create_access_token
from bson import ObjectId
from datetime import timedelta, datetime
from dotenv import load_dotenv
load_dotenv()
import re
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

auth_bp = Blueprint('auth_bp', __name__)

# -------------------------
#  Send Confirmation Email
# -------------------------
def send_confirmation_email(to_email, name):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")   # your email address
    smtp_pass = os.getenv("SMTP_PASS")   # app-specific password

    subject = "Registration Successful"
    body = f"""
    Hi {name},

    🎉 Thank you for registering on our platform!
    Your account has been created successfully. You can now log in with your credentials.

    Regards,
    The Team
    Varappu - Life Skills Education
    """

    msg = MIMEMultipart()
    msg["From"] = smtp_user
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        print(f"✅ Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email: {e}")

# -------------------------
#  Register Route
# -------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type", "user")
    location = data.get("location")
    school = data.get("school")
    contact = data.get("contact")
    joinedDate = datetime.now().strftime("%Y-%m-%d")

    # Required fields
    if not all([name, email, password, user_type]):
        return jsonify({"error": "All fields are required"}), 400

    # Email format
    if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email):
        return jsonify({"error": "Invalid email format"}), 400

    # Contact validation
    if contact and not re.fullmatch(r"\d{10}", contact):
        return jsonify({"error": "Contact must be 10 digits"}), 400

    # Check if email exists
    if mongo.db.users.find_one({"email": email}):
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = generate_password_hash(password)
    default_profile_image = "/uploads/default.png"

    mongo.db.users.insert_one({
        "fullName": name,
        "email": email,
        "password": hashed_password,
        "role": user_type,
        "joinedDate": joinedDate,
        "location": location,
        "school": school,
        "contact": contact,
        "profileImage": default_profile_image
    })

    # Send confirmation email
    send_confirmation_email(email, name)

    return jsonify({"message": "User registered successfully"}), 201

# -------------------------
#  Login Route
# -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Hardcoded admin login
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

    # Normal user login
    user = mongo.db.users.find_one({"email": email})
    if user and check_password_hash(user["password"], password):
        user_id = str(user["_id"])
        role = user.get("role", "").strip()
        name = user.get("fullName", "Unknown")

        access_token = create_access_token(
            identity=user_id,
            additional_claims={"role": role, "name": name},
            expires_delta=timedelta(hours=2)
        )

        return jsonify({
            "message": f"{role.capitalize()} login successful",
            "access_token": access_token,
            "user_id": user_id,
            "role": role,
            "name": name
        }), 200

    return jsonify({"error": "Invalid credentials"}), 401
