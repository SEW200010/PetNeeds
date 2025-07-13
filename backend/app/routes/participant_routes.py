from flask import Blueprint, jsonify, request
from app import mongo

participant_bp = Blueprint('participant_bp', __name__)

@participant_bp.route("/participants", methods=["GET"])
def get_participants():
    event_id = request.args.get("event_id")
    query = {}
    if event_id:
        try:
            event_id_int = int(event_id)
            query["event_id"] = event_id_int
        except ValueError:
            query["event_id"] = event_id
    participants = list(mongo.db.participants.find(query, {"_id": 0}))
    return jsonify(participants)
