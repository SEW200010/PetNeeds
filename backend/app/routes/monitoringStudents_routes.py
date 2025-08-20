from flask import Blueprint, jsonify ,request
from app import mongo
from bson import ObjectId

monitoringstudent_bp = Blueprint('monitoringstudent_bp', __name__)

@monitoringstudent_bp.route('/api/monitoringstudents', methods=['GET'])
def get_all_monitored_students():
    students = list(mongo.db.montoringstudents.find({}, {"_id": 0}))
    return jsonify(students), 200

# -----------------------------
# Add New Monitored Student
# -----------------------------
@monitoringstudent_bp.route('/api/monitoringstudents', methods=['POST'])
def add_monitored_student():
    try:
        data = request.get_json(force=True)
        name = data.get("name")
        unid = data.get("unid")
        email = data.get("email")
        progress = data.get("progress", 0)
        supervisor = data.get("supervisor")

        # Basic validation
        if not all([name, unid, email, supervisor]):
            return jsonify({"error": "All fields are required"}), 400

        # Check if student with same UNID already exists
        if mongo.db.montoringstudents.find_one({"unid": unid}):
            return jsonify({"error": "Student with this UNID already exists"}), 409

       

        student_doc = {
            "name": name,
            "unid": unid,
            "email": email,
            "progress": progress,
            "supervisor": supervisor,
           
        }

        result = mongo.db.montoringstudents.insert_one(student_doc)

        # Include inserted _id for frontend
        student_doc["_id"] = str(result.inserted_id)

        return jsonify(student_doc), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
# -----------------------------
# Get Student by ID
# -----------------------------
@monitoringstudent_bp.route('/api/monitoringstudents/<student_id>', methods=['GET'])
def get_student(student_id):
    try:
        student = mongo.db.monitoringstudents.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"error": "Student not found"}), 404
        student["_id"] = str(student["_id"])
        return jsonify(student), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Update Student
# -----------------------------
@monitoringstudent_bp.route('/api/monitoringstudents/<student_id>', methods=['PUT'])
def update_student(student_id):
    try:
        data = request.get_json(force=True)
        update_data = {
            "name": data.get("name"),
            "unid": data.get("unid"),
            "email": data.get("email"),
            "progress": data.get("progress", 0),
            "supervisor": data.get("supervisor")
        }

        result = mongo.db.montoringstudents.update_one(
            {"_id": ObjectId(student_id)},
            {"$set": update_data}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Student updated successfully"}), 200
        else:
            return jsonify({"message": "No changes made or student not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Delete Student
# -----------------------------
@monitoringstudent_bp.route('/api/monitoringstudents/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    try:
        result = mongo.db.monitoringstudents.delete_one({"_id": ObjectId(student_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Student deleted successfully"}), 200
        else:
            return jsonify({"error": "Student not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
