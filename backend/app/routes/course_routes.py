from flask import Blueprint, request, jsonify
from bson import ObjectId
from app import mongo

course_bp = Blueprint('course_bp', __name__)

# -----------------------------
# Create Course
# -----------------------------
@course_bp.route('/add', methods=['POST'])
def create_course():
    try:
        data = request.get_json(force=True)
        course_name = data.get("courseName")
        duration = data.get("duration")
        course_id = data.get("courseId")
        attendees_count = data.get("attendeesCount", 0)
        attendees = data.get("attendees", [])
        teacher_incharge = data.get("teacherIncharge")
        year = data.get("year")

        # Basic validation
        if not all([course_name, duration, course_id, teacher_incharge, year]):
            return jsonify({"error": "All required fields must be provided"}), 400
        if not isinstance(attendees, list) or not all(isinstance(a, str) for a in attendees):
            return jsonify({"error": "Attendees must be a list of emails"}), 400

        course_doc = {
            "courseName": course_name,
            "duration": duration,
            "courseId": course_id,
            "attendeesCount": attendees_count,
            "attendees": attendees,
            "teacherIncharge": teacher_incharge,
            "year": year
        }

        result = mongo.db.courses.insert_one(course_doc)
        course_doc["_id"] = str(result.inserted_id)

        return jsonify(course_doc), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get All Courses
# -----------------------------
@course_bp.route('/', methods=['GET'])
def get_all_courses():
    try:
        courses = list(mongo.db.courses.find())
        for course in courses:
            course["_id"] = str(course["_id"])
        return jsonify(courses), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get Courses by Teacher
# -----------------------------
@course_bp.route('/teacher/<teacher>', methods=['GET'])
def get_courses_by_teacher(teacher):
    try:
        courses = list(mongo.db.courses.find({"teacherIncharge": teacher}))
        for course in courses:
            course["_id"] = str(course["_id"])
        return jsonify(courses), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Get Course by ID
# -----------------------------
@course_bp.route('/<course_id>', methods=['GET'])
def get_course(course_id):
    try:
        course = mongo.db.courses.find_one({"_id": ObjectId(course_id)})
        if not course:
            return jsonify({"error": "Course not found"}), 404
        course["_id"] = str(course["_id"])
        return jsonify(course), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Update Course
# -----------------------------
@course_bp.route('/<course_id>', methods=['PUT'])
def update_course(course_id):
    try:
        data = request.get_json(force=True)
        update_data = {
            "courseName": data.get("courseName"),
            "duration": data.get("duration"),
            "courseId": data.get("courseId"),
            "attendeesCount": data.get("attendeesCount", 0),
            "attendees": data.get("attendees", []),
            "teacherIncharge": data.get("teacherIncharge"),
            "year": data.get("year")
        }

        result = mongo.db.courses.update_one({"_id": ObjectId(course_id)}, {"$set": update_data})
        if result.modified_count == 1:
            return jsonify({"message": "Course updated successfully"}), 200
        else:
            return jsonify({"message": "No changes made or course not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -----------------------------
# Delete Course
# -----------------------------
@course_bp.route('/<course_id>', methods=['DELETE'])
def delete_course(course_id):
    try:
        result = mongo.db.courses.delete_one({"_id": ObjectId(course_id)})
        if result.deleted_count == 1:
            return jsonify({"message": "Course deleted successfully"}), 200
        else:
            return jsonify({"error": "Course not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
