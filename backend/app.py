from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# In-memory storage for pets (in production, use a database)
pets_data = {}

# In-memory storage for orders
orders_data = []
order_id_counter = 1

@app.route('/api/user/<user_id>/pets', methods=['POST'])
def add_pet(user_id):
    try:
        data = request.get_json()
        pet = {
            '_id': str(len(pets_data.get(user_id, [])) + 1),
            'name': data['name'],
            'breed': data['breed'],
            'age': data['age'],
            'type': data['type']
        }

        if user_id not in pets_data:
            pets_data[user_id] = []

        pets_data[user_id].append(pet)

        return jsonify({'pet': pet}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/user/<user_id>/pets/<pet_id>', methods=['DELETE'])
def delete_pet(user_id, pet_id):
    try:
        if user_id in pets_data:
            pets_data[user_id] = [p for p in pets_data[user_id] if p['_id'] != pet_id]
            return jsonify({'message': 'Pet deleted'}), 200
        else:
            return jsonify({'error': 'User not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        return jsonify({'orders': orders_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
