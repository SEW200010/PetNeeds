from flask import Blueprint, jsonify
from app import mongo

session_bp = Blueprint('session', __name__)

@session_bp.route('/sessions', methods=['GET'])
def get_sessions():
    try:
        sessions = mongo.db.sessions.find()
        output = []

        for session in sessions:
            output.append({
                "id": str(session["_id"]),
                "courseCode": session.get("courseCode"),
                "lectureTitle": session.get("lectureTitle"),
                "attendees": session.get("attendees"),
                "lecturer": session.get("lecturer"),
                "location": session.get("location"),
                "time": session.get("time"),  # safe handling
                "details": session.get("details")
            })

        return jsonify(output), 200

    except Exception as e:
        print("Error fetching sessions:", e)
        return jsonify({"error": str(e)}), 500


