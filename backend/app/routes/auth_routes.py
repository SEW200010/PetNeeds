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
# Email Helper
# -------------------------
def send_email(to_email, subject, body):
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

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
        print(f"✅ Email sent to {to_email}")
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")

def send_confirmation_email(to_email, fullname):
    subject = "Registration Successful"
    body = f"""
Hi {fullname},

🎉 Thank you for registering on our platform!
Your account has been created successfully. You can now log in with your credentials.

Regards,
The Team
Varappu - Life Skills Education
"""
    send_email(to_email, subject, body)

def send_facilitator_verified_email(to_email, fullname):
    subject = "Your Facilitator Account is Verified ✅"
    body = f"""
Hi {fullname},

Your facilitator account has been verified by the admin.
You can now log in and access your account.

Regards,
The Team
Varappu - Life Skills Education
"""
    send_email(to_email, subject, body)

# -------------------------
# Register Route
# -------------------------
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}

    # Normalize and trim fields
    fullname = (data.get("fullname") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""
    role = (data.get("role") or "user").strip().lower()
    organization_unit = (data.get("organization_unit") or "").strip().lower()
    school_name = (data.get("school_name") or "").strip()
    zone = (data.get("zone") or "").strip()
    district = (data.get("district") or "").strip()
    university_name = (data.get("university_name") or "").strip()
    faculty_name = (data.get("faculty_name") or "").strip()
    contact = (data.get("contact") or "").strip()
    address = (data.get("address") or "").strip()
    joinedDate = datetime.utcnow()

    # Required fields
    if not all([fullname, email, password, role, organization_unit]):
        return jsonify({"error": "All required fields are missing"}), 400

    # Conditional required fields
    if organization_unit == "school" and not all([school_name, zone, district]):
        return jsonify({"error": "All school fields are required"}), 400
    elif organization_unit == "university" and not all([university_name, faculty_name]):
        return jsonify({"error": "All university fields are required"}), 400

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

    # Insert user
    mongo.db.users.insert_one({
        "fullname": fullname,
        "email": email,
        "password": hashed_password,
        "role": role,
        "isVerified": False if role == "facilitator" else True,
        "joinedDate": joinedDate,
        "organization_unit": organization_unit,
        "school_name": school_name,
        "zone": zone,
        "district": district,
        "university_name": university_name,
        "faculty_name": faculty_name,
        "address": address,
        "contact": contact,
        "profileImage": default_profile_image
    })

    # Send confirmation email for non-facilitators
    if role != "facilitator":
        send_confirmation_email(email, fullname)

    return jsonify({"message": "User registered successfully"}), 201

# -------------------------
# Login Route
# -------------------------
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}

    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

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
    if user:
        role = user.get("role", "").strip()
        

         

        # Facilitator must be verified
       

        if check_password_hash(user.get("password", ""), password):
            user_id = str(user["_id"])
            fullname = user.get("fullname", "Unknown")
            user_id = str(user["_id"])
            role = user.get("role", "").strip()  # remove extra spaces
            name = user.get("fullname", "Unknown")  # get the teacher's name
            organization_unit = user.get("organization_unit", "")  # 🆕 added
            university = user.get("university_name", "")  # 🆕 added
            zone = user.get("zone", "")

            print(f"Login -> Name: '{name}', Role: '{role}',, Province: '{organization_unit}', District: '{university}', Zone: '{zone}'") 
            
            access_token = create_access_token(
                identity=user_id,
                 additional_claims={
                "role": role,
                "name": name,
                "zone": zone,
                "organization_unit": organization_unit,  # 🆕 include in token
                "university": university  # 🆕 include in token
            },
                expires_delta=timedelta(hours=2)
            )

            # Update lastLogin timestamp
            mongo.db.users.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"lastLogin": datetime.utcnow()}}
            )

            return jsonify({
                "message": f"{role.capitalize()} login successful",
            "access_token": access_token,
            "user_id": user_id,
            "role": role,
            "name": name,
        
            "zone": zone,
            "organization_unit": organization_unit,  # 🆕 include in response
            "university": university  # 🆕 include in response
            }), 200

    return jsonify({"error": "Invalid credentials"}), 401

# -------------------------
# Verify Facilitator Route
# -------------------------
@auth_bp.route('/verify-facilitator/<user_id>', methods=['POST'])
def verify_facilitator(user_id):
    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user.get("role") != "facilitator":
        return jsonify({"error": "User is not a facilitator"}), 400

    if user.get("isVerified"):
        return jsonify({"message": "Facilitator already verified"}), 200

    mongo.db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"isVerified": True, "verifiedAt": datetime.utcnow()}}
    )

    send_facilitator_verified_email(user["email"], user["fullname"])

    return jsonify({"message": "Facilitator verified successfully"}), 200
