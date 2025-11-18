from flask import Blueprint, request, jsonify, send_file
from datetime import datetime
from bson import ObjectId
from io import BytesIO
from app import mongo

transaction_bp = Blueprint('transaction_bp', __name__)

@transaction_bp.route('/api/transactions', methods=['POST'])
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


@transaction_bp.route('/api/transactions', methods=['GET'])
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


@transaction_bp.route('/api/transactions/paginated', methods=['GET'])

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


@transaction_bp.route('/api/file/<transaction_id>', methods=['GET'])
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



@transaction_bp.route('/api/summary', methods=['GET'])
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

@transaction_bp.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    result = mongo.db.transactions.delete_one({'_id': ObjectId(transaction_id)})
    if result.deleted_count == 1:
        return jsonify({"message": "Transaction deleted"}), 200
    return jsonify({"error": "Transaction not found"}), 404

@transaction_bp.route('/api/chart-data', methods=['GET'])
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


@transaction_bp.route('/api/engagement-metrics', methods=['GET'])
def get_engagement_metrics():
    """Get real engagement metrics from database"""
    try:
        # Total users count
        total_users = mongo.db.users.count_documents({})
        
        # Count users with lastLogin (verified logins)
        verified_logins = mongo.db.users.count_documents({"lastLogin": {"$exists": True, "$ne": None}})
        
        # Count by role
        roles = mongo.db.users.aggregate([
            {"$group": {"_id": "$role", "count": {"$sum": 1}}}
        ])
        role_breakdown = {r["_id"]: r["count"] for r in roles}
        
        # Count events created
        total_events = mongo.db.events.count_documents({})
        
        # Count participants enrolled
        total_participants = mongo.db.participants.count_documents({})
        
        return jsonify({
            'totalLogins': verified_logins,
            'totalUsers': total_users,
            'totalEvents': total_events,
            'totalParticipants': total_participants,
            'roleBreakdown': role_breakdown
        }), 200
    except Exception as e:
        print(f"Error in get_engagement_metrics: {e}")
        return jsonify({"error": str(e)}), 500


@transaction_bp.route('/api/contribution-trends', methods=['GET'])
def get_contribution_trends():
    """Get contribution trends over time (monthly)"""
    try:
        from datetime import datetime, timedelta
        
        # Get last 12 months of transaction data
        months_data = []
        for i in range(11, -1, -1):
            date = datetime.utcnow() - timedelta(days=30*i)
            month_start = date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            
            pipeline = [
                {"$match": {
                    "timestamp": {"$gte": month_start, "$lt": month_end}
                }},
                {"$group": {
                    "_id": "$type",
                    "amount": {"$sum": "$amount"}
                }}
            ]
            
            results = list(mongo.db.transactions.aggregate(pipeline))
            income = next((r['amount'] for r in results if r['_id'] == 'income'), 0)
            expense = next((r['amount'] for r in results if r['_id'] == 'expense'), 0)
            
            months_data.append({
                "month": month_start.strftime("%b %Y"),
                "income": income,
                "expense": expense,
                "net": income - expense
            })
        
        return jsonify(months_data), 200
    except Exception as e:
        print(f"Error in get_contribution_trends: {e}")
        return jsonify({"error": str(e)}), 500


@transaction_bp.route('/api/management-trends', methods=['GET'])
def get_management_trends():
    """Return last 12 months of user registrations and event creations.
    Attempts to use datetime fields if present, otherwise falls back to
    string date fields like 'joinDate' (YYYY-MM-DD) and event 'date'.
    """
    try:
        from datetime import datetime, timedelta

        months = []
        for i in range(11, -1, -1):
            date = datetime.utcnow() - timedelta(days=30 * i)
            month_start = date.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            # next month start
            next_month = (month_start + timedelta(days=32)).replace(day=1)

            # string bounds for YYYY-MM-DD comparisons
            month_start_str = month_start.strftime('%Y-%m-01')
            next_month_str = next_month.strftime('%Y-%m-01')

            # Users: count those with created_at datetime within month
            users_with_created_at = mongo.db.users.count_documents({
                'created_at': {'$gte': month_start, '$lt': next_month}
            })

            # Users with joinDate string (YYYY-MM-DD) and no created_at
            users_with_joinDate = mongo.db.users.count_documents({
                'created_at': {'$exists': False},
                'joinDate': {'$gte': month_start_str, '$lt': next_month_str}
            })

            users_count = users_with_created_at + users_with_joinDate

            # Events: prefer created_at if present, otherwise use 'date' string
            events_with_created_at = mongo.db.events.count_documents({
                'created_at': {'$gte': month_start, '$lt': next_month}
            })
            events_with_date = mongo.db.events.count_documents({
                'created_at': {'$exists': False},
                'date': {'$gte': month_start_str, '$lt': next_month_str}
            })
            events_count = events_with_created_at + events_with_date

            months.append({
                'month': month_start.strftime('%b %Y'),
                'users': users_count,
                'events': events_count
            })

        return jsonify(months), 200
    except Exception as e:
        print(f"Error in get_management_trends: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@transaction_bp.route('/api/coordinator-reports', methods=['GET'])
def get_coordinator_reports():
    """Fetch all coordinator reports from MongoDB with optional filtering"""
    try:
        # Get optional query parameters for filtering
        search_query = request.args.get('search', '').strip()
        university = request.args.get('university', '').strip()
        month = request.args.get('month', '').strip()
        year = request.args.get('year', '').strip()
        
        # Build the filter query
        filter_query = {}
        
        if search_query:
            # Search across title, summary, and filename
            filter_query['$or'] = [
                {'title': {'$regex': search_query, '$options': 'i'}},
                {'summary': {'$regex': search_query, '$options': 'i'}},
                {'original_filename': {'$regex': search_query, '$options': 'i'}}
            ]
        
        if university:
            filter_query['university_name'] = university
        
        if month:
            filter_query['month'] = month.lower()
        
        if year:
            filter_query['year'] = year
        
        # Fetch reports from database, sorted by upload date (newest first)
        reports = list(mongo.db.reports.find(filter_query).sort('uploaded_at', -1))
        
        # Convert ObjectId to string and format dates
        for report in reports:
            report['_id'] = str(report['_id'])
            if 'uploaded_at' in report and isinstance(report['uploaded_at'], datetime):
                report['uploaded_at'] = report['uploaded_at'].isoformat()
            if 'uploaded_by' in report:
                report['uploaded_by'] = str(report['uploaded_by'])
        
        return jsonify(reports), 200
    except Exception as e:
        print(f"Error in get_coordinator_reports: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500


@transaction_bp.route('/api/coordinator-reports/download/<report_id>', methods=['GET'])
def download_coordinator_report(report_id):
    """Download a coordinator report file by ID"""
    try:
        import os
        
        # Fetch report metadata from database
        report = mongo.db.reports.find_one({'_id': ObjectId(report_id)})
        
        if not report:
            return jsonify({'error': 'Report not found'}), 404
        
        # Get the file path
        filename = report.get('filename')
        if not filename:
            return jsonify({'error': 'File not found'}), 404
        
        # Use the uploads directory from current working directory
        uploads_dir = os.path.join(os.getcwd(), 'uploads')
        file_path = os.path.join(uploads_dir, filename)
        
        # Check if file exists
        if not os.path.exists(file_path):
            return jsonify({'error': 'File does not exist on server'}), 404
        
        # Send the file
        return send_file(
            file_path,
            as_attachment=True,
            download_name=report.get('original_filename', 'report.pdf')
        )
    except Exception as e:
        print(f"Error in download_coordinator_report: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

