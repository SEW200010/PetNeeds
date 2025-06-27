from flask import Flask, request, jsonify, send_file
from flask_pymongo import PyMongo
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from io import BytesIO
from bson import ObjectId

app = Flask(__name__)
CORS(app)

app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
mongo = PyMongo(app)

# === User Registration ===
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

# === User Login ===
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
                "time": session.get("time"),
                "details": session.get("details")
            })

        return jsonify(output), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Add Transaction ===
@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    desc = request.form.get('description')
    amount = request.form.get('amount')
    ttype = request.form.get('type')
    category = request.form.get('category')
    donor_name = request.form.get('donorName')
    beneficiary_name = request.form.get('beneficiaryName')
    file = request.files.get('transcriptFile')

    if not all([desc, amount, ttype, category]) or \
       (ttype == 'income' and not donor_name) or \
       (ttype == 'expense' and not beneficiary_name):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        amount = float(amount)
    except (ValueError, TypeError):
        return jsonify({"error": "Invalid amount"}), 400

    if ttype == 'expense':
        pipeline = [{"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}]
        totals = list(mongo.db.transactions.aggregate(pipeline))
        income_total = next((r['total'] for r in totals if r['_id'] == 'income'), 0)
        expense_total = next((r['total'] for r in totals if r['_id'] == 'expense'), 0)
        balance = income_total - expense_total

        if amount > balance:
            return jsonify({"error": "Expense amount exceeds current available balance"}), 400
        
    transaction = {
        'description': desc,
        'amount': amount,
        'type': ttype,
        'category': category,
        'timestamp': datetime.utcnow(),
        'donorName': donor_name if ttype == 'income' else None,
        'beneficiaryName': beneficiary_name if ttype == 'expense' else None
    }

    if file:
        transaction['file'] = {
            'filename': file.filename,
            'content': file.read(),
            'content_type': file.content_type
        }

    
    result = mongo.db.transactions.insert_one(transaction)
    transaction['_id'] = str(result.inserted_id)
    transaction['timestamp'] = transaction['timestamp'].isoformat()
    if 'file' in transaction:
        transaction['file'] = {'filename': transaction['file']['filename']}

    return jsonify(transaction), 201

# === Get All Transactions ===
@app.route('/api/transactions', methods=['GET'])
def get_all_transactions():
    transactions = []
    cursor = mongo.db.transactions.find().sort('timestamp', -1)
    for t in cursor:
        t['_id'] = str(t['_id'])
        t['timestamp'] = t['timestamp'].isoformat()
        t['donorName'] = t.get('donorName') or ''
        t['beneficiaryName'] = t.get('beneficiaryName') or ''
        if 'file' in t:
            t['file'] = {
                'filename': t['file']['filename'],
                'url': f"http://localhost:5000/api/file/{t['_id']}"
            }
        transactions.append(t)
    return jsonify(transactions)

# === Get Paginated Transactions ===
@app.route('/api/transactions/paginated', methods=['GET'])
def get_transactions_paginated():
    ttype = request.args.get('type')
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 10))
    skip = (page - 1) * page_size

    query = {}
    if ttype in ['income', 'expense']:
        query['type'] = ttype

    total_count = mongo.db.transactions.count_documents(query)
    cursor = mongo.db.transactions.find(query).sort('timestamp', -1).skip(skip).limit(page_size)

    transactions = []
    for t in cursor:
        t['_id'] = str(t['_id'])
        t['timestamp'] = t['timestamp'].isoformat()
        t['donorName'] = t.get('donorName') or ''
        t['beneficiaryName'] = t.get('beneficiaryName') or ''
        if 'file' in t:
            t['file'] = {
                'filename': t['file']['filename'],
                'url': f"http://localhost:5000/api/file/{t['_id']}"
            }
        transactions.append(t)

    return jsonify({
        'transactions': transactions,
        'page': page,
        'page_size': page_size,
        'total_pages': (total_count + page_size - 1) // page_size,
        'total_count': total_count
    })

# === Download File ===
@app.route('/api/file/<transaction_id>', methods=['GET'])
def get_transaction_file(transaction_id):
    try:
        transaction = mongo.db.transactions.find_one({"_id": ObjectId(transaction_id)})
        if transaction and 'file' in transaction:
            file_data = transaction['file']
            return send_file(
                BytesIO(file_data['content']),
                download_name=file_data['filename'],
                mimetype=file_data['content_type']
            )
        return jsonify({"error": "File not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# === Summary API ===
@app.route('/api/summary', methods=['GET'])
def get_summary():
    pipeline = [
        {"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}
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

# === Chart Data API ===
@app.route('/api/chart-data', methods=['GET'])
def get_chart_data():
    total_pipeline = [{"$group": {"_id": "$type", "total": {"$sum": "$amount"}}}]
    totals = list(mongo.db.transactions.aggregate(total_pipeline))
    income_total = next((r['total'] for r in totals if r['_id'] == 'income'), 0)
    expense_total = next((r['total'] for r in totals if r['_id'] == 'expense'), 0)

    income_pipeline = [
        {"$match": {"type": "income"}},
        {"$group": {"_id": "$category", "value": {"$sum": "$amount"}}}
    ]
    income_breakdown = list(mongo.db.transactions.aggregate(income_pipeline))
    income_breakdown = [{"name": r["_id"], "value": r["value"]} for r in income_breakdown]

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
