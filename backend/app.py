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


if __name__ == "__main__":
    app.run(debug=True)
