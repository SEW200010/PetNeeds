from flask import Blueprint, jsonify
from app import mongo

participant_bp = Blueprint('participant_bp', __name__)

@participant_bp.route("/participants", methods=["GET"])
def get_participants():
    participants = list(mongo.db.participants.find({}, {"_id": 0}))
    return jsonify(participants)
