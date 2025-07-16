from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from bson.json_util import dumps
from app import mongo

profile_bp = Blueprint("profile_bp", __name__)

@profile_bp.route("/api/user/<user_id>", methods=["GET"])
@jwt_required()
def get_user(user_id):
    current_user_id = get_jwt_identity()

    if current_user_id != user_id:
        return jsonify({"error": "Unauthorized"}), 403

    user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
    if user:
        return dumps(user), 200
    return jsonify({"error": "User not found"}), 404
