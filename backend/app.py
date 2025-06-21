from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
mongo = PyMongo(app)
@app.route('/register', methods=['POST'])
def register():
    data = request.json

    # 🔍 Debug: Print received data
    print("📥 Received data from frontend:", data)

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    # Also print individual fields (optional)
    print(f"Name: {name}, Email: {email}, Password: {password}, User Type: {user_type}")

    return jsonify({"message": "Data received"}), 200


if __name__ == "__main__":
    app.run(debug=True)
