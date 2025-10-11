from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import mongo

student_bp = Blueprint("student_bp", __name__)

@student_bp.route("/enroll-module", methods=["POST"])
@jwt_required()
def enroll_module():
    data = request.get_json()
    module_name = data.get("module_name")
    if not module_name:
        return jsonify({"error": "Module name is required"}), 400

    # Get current logged-in student ID from JWT
    user_id = get_jwt_identity()

    student = mongo.db.students.find_one({"_id": user_id})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    modules = student.get("module", [])

    # Avoid duplicate enrollment
    if module_name in modules:
        return jsonify({"message": "Already enrolled"}), 200

    modules.append(module_name)
    mongo.db.students.update_one(
        {"_id": user_id}, {"$set": {"module": modules}}
    )

    return jsonify({"message": f"Successfully enrolled in {module_name}"}), 200
