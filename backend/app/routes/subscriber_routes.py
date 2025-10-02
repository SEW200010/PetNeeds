from flask import Blueprint, request, jsonify
from app import mongo
import uuid
import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os

subscribe_bp = Blueprint("subscribe_bp", __name__)

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")  # configurable

def send_confirmation_email(email, token):
    confirm_url = f"{FRONTEND_URL}/confirm-subscription/{token}"
    subject = "Confirm your subscription"
    body = f"""
    <h2>Confirm Your Subscription</h2>
    <p>Thanks for subscribing! Please confirm your email by clicking the link below:</p>
    <a href="{confirm_url}">Confirm Subscription</a>
    """

    msg = MIMEMultipart()
    msg["From"] = EMAIL_USER
    msg["To"] = email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(EMAIL_USER, EMAIL_PASS)
    server.sendmail(EMAIL_USER, email, msg.as_string())
    server.quit()


# POST /subscribe
@subscribe_bp.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json()
    email = data.get("email")

    if not email or "@" not in email:
        return jsonify({"message": "Invalid email address."}), 400

    existing = mongo.db.subscribers.find_one({"email": email})
    if existing:
        return jsonify({"message": "Email already subscribed."}), 400

    token = str(uuid.uuid4())
    mongo.db.subscribers.insert_one({
        "email": email,
        "verified": False,
        "token": token,
        "created_at": datetime.datetime.utcnow()
    })

    try:
        send_confirmation_email(email, token)
    except Exception as e:
        print("Email error:", e)
        return jsonify({"message": "Failed to send confirmation email."}), 500

    return jsonify({"message": "Check your email to confirm subscription!"}), 200


@subscribe_bp.route("/confirm-subscription/<token>", methods=["GET"])
def confirm_subscription(token):
    subscriber = mongo.db.subscribers.find_one({"token": token})

    if not subscriber:
        # Check if already verified (no token, but verified = True)
        verified_subscriber = mongo.db.subscribers.find_one({"verified": True, "token": {"$exists": False}})
        if verified_subscriber:
            return jsonify({"message": "This email is already confirmed."}), 200
        return jsonify({"message": "Invalid or expired confirmation link."}), 400

    # Expiry check (24 hours)
    if (datetime.datetime.utcnow() - subscriber["created_at"]).total_seconds() > 86400:
        return jsonify({"message": "Confirmation link expired."}), 400

    if subscriber.get("verified", False):
        return jsonify({"message": "This email is already confirmed."}), 200

    mongo.db.subscribers.update_one(
        {"_id": subscriber["_id"]},
        {"$set": {"verified": True}, "$unset": {"token": ""}}
    )
    return jsonify({"message": "Subscription confirmed successfully!"}), 200
