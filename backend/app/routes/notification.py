from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
import csv
import smtplib
from email.message import EmailMessage
import os
from app import mongo  # Ensure mongo is imported

notify_bp = Blueprint('notify_bp', __name__)

@notify_bp.route('/notify/<event_mongo_id>', methods=['POST'])
def notify_participants(event_mongo_id):
    try:
        print("Received event_mongo_id:", event_mongo_id)

        # Find event by ObjectId
        event = mongo.db.events.find_one({"_id": ObjectId(event_mongo_id)})
        if not event:
            print("Event not found in DB")
            return jsonify({"error": "Event not found"}), 404

        print("Fetched event:", event)

        numeric_event_id = str(event.get("event_id"))
        if not numeric_event_id:
            print("Missing event_id in event:", event)
            return jsonify({"error": "Event numeric ID not found"}), 404

        csv_path = os.path.join(os.path.dirname(__file__), "data", "participants.csv")
        print("Looking for CSV file at:", csv_path)

        participants = []
        with open(csv_path, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                if row.get('event_id') == numeric_event_id:
                    participants.append(row)

        print("Matched participants:", participants)

        if not participants:
            return jsonify({"error": "No participants found."}), 404

        # EMAIL CREDENTIALS from environment variables
        sender_email = os.getenv("EMAIL_USER")
        sender_password = os.getenv("EMAIL_PASS")
        if not sender_email or not sender_password:
            print("Email credentials not configured")
            return jsonify({"error": "Email credentials not configured"}), 500

        for p in participants:
            msg = EmailMessage()
            msg["Subject"] = f"Event Notification - Event ID {numeric_event_id}"
            msg["From"] = sender_email
            msg["To"] = p["Email"]
            msg.set_content(f"""Dear {p['Name']},\nYou are registered for Event ID {numeric_event_id}.\nThanks.""")

            try:
                with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                    server.login(sender_email, sender_password)
                    server.send_message(msg)
            except Exception as email_err:
                print(f"Error sending email to {p['Email']}: {email_err}")
                return jsonify({"error": f"Failed to send email to {p['Email']}"}), 500

        return jsonify({"message": "Emails sent!"}), 200

    except Exception as e:
        print("Server error:", str(e))
