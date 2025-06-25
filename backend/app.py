from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
mongo = PyMongo(app)
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json(force=True)  # Force parsing JSON

        print("Received data:", data)  # Debugging line

        # Extract fields
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        user_type = data.get("user_type")

        # Validation
        if not all([name, email, password, user_type]):
            return jsonify({"error": "All fields are required"}), 400

        # Insert into DB
        mongo.db.users.insert_one({
            "name": name,
            "email": email,
            "password": password,
            "user_type": user_type
        })

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email == "admin@admin.com" and password == "admin123":
        return jsonify({"message": "Admin login successful"}), 200

    user = mongo.db.users.find_one({"email": email, "password": password})
    if user:
        return jsonify({"message": "User login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401
@app.route('/sessions', methods=['GET'])
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

if __name__ == "__main__":
    app.run(debug=True)
