from flask import Blueprint, jsonify
from app import mongo

monitoringstudent_bp = Blueprint('monitoringstudent_bp', __name__)

@monitoringstudent_bp.route('/api/monitoringstudents', methods=['GET'])
def get_all_monitored_students():
    students = list(mongo.db.montoringstudents.find({}, {"_id": 0}))
    return jsonify(students), 200
