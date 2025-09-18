from flask import Blueprint, jsonify
from bson import ObjectId
from app import mongo

feedback_bp = Blueprint("feedback_bp", __name__)

@feedback_bp.route("/average-rating/<event_id>")
def get_average_rating(event_id):
    participants = mongo.db.participants.find({"event_id": event_id})
    ratings = [float(p.get("rating", 0)) for p in participants if "rating" in p and str(p["rating"]).replace('.', '', 1).isdigit()]
    if ratings:
        avg_rating = round(sum(ratings) / len(ratings), 2)
    else:
        avg_rating = None
    return jsonify({"average": avg_rating})
