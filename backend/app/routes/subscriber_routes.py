from flask import Blueprint, request, jsonify
from app import mongo  # using your existing mongo instance

subscribe_bp = Blueprint("subscribe_bp", __name__)

# POST /subscribe
@subscribe_bp.route("/subscribe", methods=["POST"])
def subscribe():
    data = request.get_json()
    email = data.get("email")

    # Basic validation
    if not email or "@" not in email:
        return jsonify({"message": "Invalid email address."}), 400

    # Check if email already exists
    existing = mongo.db.subscribers.find_one({"email": email})
    if existing:
        return jsonify({"message": "Email already subscribed."}), 400

    # Insert new subscriber
    mongo.db.subscribers.insert_one({"email": email})
    return jsonify({"message": "Subscribed successfully!"}), 200

# Optional: GET /subscribers for testing
@subscribe_bp.route("/subscribers", methods=["GET"])
def list_subscribers():
    subs = list(mongo.db.subscribers.find({}, {"_id": 0}))
    return jsonify(subs), 200
