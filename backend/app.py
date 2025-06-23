# ======= backend/app.py =======
from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
mongo = PyMongo(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    user_type = data.get("user_type")

    if not all([name, email, password, user_type]):
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = generate_password_hash(password)
    mongo.db.users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "user_type": user_type
    })

    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if email == "admin@admin.com" and password == "admin123":
        return jsonify({"message": "Admin login successful"}), 200

    user = mongo.db.users.find_one({"email": email})
    if user and check_password_hash(user['password'], password):
        return jsonify({"message": "User login successful"}), 200
    else:
        return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    desc = data.get('description')
    amount = data.get('amount')
    ttype = data.get('type')
    category = data.get('category')

    if not all([desc, amount, ttype, category]):
        return jsonify({"error": "Missing required fields"}), 400

    transaction = {
        'description': desc,
        'amount': amount,
        'type': ttype,
        'category': category,
        'timestamp': datetime.utcnow()
    }
    result = mongo.db.transactions.insert_one(transaction)
    transaction['_id'] = str(result.inserted_id)
    transaction['timestamp'] = transaction['timestamp'].isoformat()
    return jsonify(transaction), 201

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    last_10 = list(mongo.db.transactions.find().sort('timestamp', -1).limit(10))
    for t in last_10:
        t['_id'] = str(t['_id'])
        t['timestamp'] = t['timestamp'].isoformat()
    return jsonify(last_10)

@app.route('/api/summary', methods=['GET'])
def get_summary():
    pipeline = [
        { "$group": { "_id": "$type", "total": {"$sum": "$amount"} } }
    ]
    results = list(mongo.db.transactions.aggregate(pipeline))
    income = next((r['total'] for r in results if r['_id'] == 'income'), 0)
    expense = next((r['total'] for r in results if r['_id'] == 'expense'), 0)
    balance = income - expense
    return jsonify({
        'income': income,
        'expense': expense,
        'balance': balance
    })

@app.route('/api/chart-data', methods=['GET'])
def get_chart_data():
    # Total income and expense
    total_pipeline = [
        {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}
    ]
    totals = list(mongo.db.transactions.aggregate(total_pipeline))
    income_total = next((r['total'] for r in totals if r['_id'] == 'income'), 0)
    expense_total = -next((r['total'] for r in totals if r['_id'] == 'expense'), 0)

    # Income breakdown
    income_pipeline = [
        {"$match": {"type": "income"}},
        {"$group": {"_id": "$category", "value": {"$sum": "$amount"}}}
    ]
    income_breakdown = list(mongo.db.transactions.aggregate(income_pipeline))
    income_breakdown = [{"name": r["_id"], "value": r["value"]} for r in income_breakdown]

    # Expense breakdown
    expense_pipeline = [
        {"$match": {"type": "expense"}},
        {"$group": {"_id": "$category", "value": {"$sum": {"$abs": "$amount"}}}}
    ]
    expense_breakdown = list(mongo.db.transactions.aggregate(expense_pipeline))
    expense_breakdown = [{"name": r["_id"], "value": r["value"]} for r in expense_breakdown]

    return jsonify({
        'income': income_total,
        'expense': expense_total,
        'incomeBreakdown': income_breakdown,
        'expenseBreakdown': expense_breakdown
    })

if __name__ == "__main__":
    app.run(debug=True)
