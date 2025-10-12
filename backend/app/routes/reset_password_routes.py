from flask import Blueprint, request, jsonify
from app import mongo, mail
from flask_mail import Message
from flask_jwt_extended import create_access_token, decode_token, exceptions

from werkzeug.security import generate_password_hash
from bson import ObjectId
import datetime
import os

password_bp = Blueprint("password_bp", __name__)

# ------------------ STEP 1: Request Password Reset ------------------ #
@password_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"message": "No account found with this email"}), 404

    # Generate token valid for 15 minutes
    expires = datetime.timedelta(minutes=15)
    reset_token = create_access_token(identity=str(user["_id"]), expires_delta=expires)

    # Build reset link (frontend route should handle token)
    FRONTEND_URL = os.getenv("FRONTEND_URL")
 # change if deployed
    reset_url = f"{FRONTEND_URL}/reset-password/{reset_token}"

    # Send reset email
    msg = Message("Password Reset Request", recipients=[email])
    msg.body = f"""
Hi,

We received a request to reset your password.

Click the link below to set a new password:
{reset_url}

⚠️ This link will expire in 15 minutes.

If you did not request this reset, please ignore this email.

Thanks,  
LifeSkill Team
"""
    mail.send(msg)

    return jsonify({"message": "Password reset link sent to your email"}), 200


# ------------------ STEP 2: Reset Password ------------------ #
@password_bp.route("/reset-password/<token>", methods=["POST"])
def reset_password(token):
    data = request.get_json()
    new_password = data.get("password")

    if not new_password:
        return jsonify({"message": "Password is required"}), 400

    try:
        # Decode token safely
        try:
            decoded_token = decode_token(token)
        except exceptions.ExpiredSignatureError:
            return jsonify({"message": "Token has expired"}), 400
        except exceptions.JWTDecodeError:
            return jsonify({"message": "Invalid token"}), 400

        user_id = decoded_token["sub"]

        # Hash password with Werkzeug
        hashed_pw = generate_password_hash(new_password)

        # Update in DB
        mongo.db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"password": hashed_pw}}
        )

        # Send confirmation email
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if user:
            email = user.get("email")
            msg = Message("Password Changed Successfully", recipients=[email])
            msg.body = f"""
Hi,

Your password has been successfully updated.  
If this wasn't you, please contact support immediately.

Thanks,  
LifeSkill Team
"""
            mail.send(msg)

        return jsonify({"message": "Password has been reset successfully"}), 200

    except Exception as e:
        return jsonify({"message": "Something went wrong", "error": str(e)}), 400