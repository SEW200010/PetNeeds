from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production
jwt = JWTManager(app)

# In-memory storage for users
users_data = {}

# In-memory storage for pets (in production, use a database)
pets_data = {}

# In-memory storage for products
products_data = [
    {"id": 1, "name": "Premium Dog Food", "price": "Rs.1000", "category": "Dog", "stock": 50, "image": "/Product/image1.png"},
    {"id": 2, "name": "Dog Leash", "price": "Rs.800", "category": "Dog", "stock": 50, "image": "/Product/image2.jpeg"},
    {"id": 3, "name": "Dog Chew Toy", "price": "Rs.1200", "category": "Dog", "stock": 50, "image": "/Product/image3.jpeg"},
    {"id": 4, "name": "WaterCup", "price": "Rs.500", "category": "Dog", "stock": 50, "image": "/Product/image4.jpeg"},
    {"id": 5, "name": "Comb", "price": "Rs.300", "category": "Dog", "stock": 50, "image": "/Product/image5.webp"},
    {"id": 6, "name": "Premium puppy", "price": "Rs.2500", "category": "Dog", "stock": 50, "image": "/Product/image6.jpeg"},
    {"id": 7, "name": "Proplan", "price": "Rs.1800", "category": "Cat", "stock": 50, "image": "/Product/image7.jpeg"},
    {"id": 8, "name": "Bascket", "price": "Rs.2000", "category": "Cat", "stock": 50, "image": "/Product/image8.jpeg"},
    {"id": 9, "name": "Bed", "price": "Rs.3000", "category": "Cat", "stock": 50, "image": "/Product/image9.jpeg"},
    {"id": 10, "name": "Toy", "price": "Rs.1200", "category": "Cat", "stock": 50, "image": "/Product/image10.webp"},
    {"id": 11, "name": "Toy", "price": "Rs.1500", "category": "Cat", "stock": 50, "image": "/Product/image11.webp"},
    {"id": 12, "name": "Bonoat", "price": "Rs.4100", "category": "Cat", "stock": 50, "image": "/Product/image12.jpeg"},
    {"id": 13, "name": "Gem Paharam", "price": "Rs.2600", "category": "Bird", "stock": 50, "image": "/Product/image13.jpeg"},
    {"id": 14, "name": "Birds Care", "price": "Rs.1300", "category": "Bird", "stock": 50, "image": "/Product/image14.jpg"},
    {"id": 15, "name": "Bird Toy", "price": "Rs.700", "category": "Bird", "stock": 50, "image": "/Product/image15.jpg"},
    {"id": 16, "name": "Bird Toy Set", "price": "Rs.800", "category": "Bird", "stock": 50, "image": "/Product/image16.jpeg"},
    {"id": 17, "name": "Peckish Complete", "price": "Rs.3600", "category": "Bird", "stock": 50, "image": "/Product/image17.jpeg"},
    {"id": 18, "name": "Cracked Corne", "price": "Rs.2300", "category": "Bird", "stock": 50, "image": "/Product/image18.jpg"},
    {"id": 19, "name": "Fish Tank", "price": "Rs.2000", "category": "Fish", "stock": 50, "image": "/Product/image19.jpeg"},
    {"id": 20, "name": "Aquarium Filter", "price": "Rs.5000", "category": "Fish", "stock": 50, "image": "/Product/image20.jpeg"},
    {"id": 21, "name": "Fish Food", "price": "Rs.1000", "category": "Fish", "stock": 50, "image": "/Product/image21.jpeg"},
    {"id": 22, "name": "Seeds", "price": "Rs.1000", "category": "Fish", "stock": 50, "image": "/Product/image22.jpeg"},
    {"id": 23, "name": "Blue salt", "price": "Rs.230", "category": "Fish", "stock": 50, "image": "/Product/image23.jpeg"},
    {"id": 24, "name": "Bettafix", "price": "Rs.500", "category": "Fish", "stock": 50, "image": "/Product/image24.png"},
]

# In-memory storage for orders
orders_data = []
order_id_counter = 1

# Initialize with admin user
users_data['admin'] = {
    'user_id': 'admin',
    'username': 'admin',
    'email': 'admin@example.com',
    'password': 'admin123',
    'role': 'admin'
}
users_data['user'] = {
    'user_id': 'user',
    'username': 'user',
    'email': 'user@example.com',
    'password': 'user123',
    'role': 'user'
}
# Authentication endpoints
@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = data['password']

        if username in users_data:
            return jsonify({'error': 'Username already exists'}), 400

        user_id = str(len(users_data) + 1)
        users_data[username] = {
            'user_id': user_id,
            'username': username,
            'email': email,
            'password': password,  # In production, hash this
            'role': 'user'
        }

        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token, 'user': {'user_id': user_id, 'username': username, 'role': 'user'}}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data['username']
        password = data['password']

        user = users_data.get(username)
        if not user or user['password'] != password:
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=username)
        return jsonify({'access_token': access_token, 'user': {'user_id': user['user_id'], 'username': username, 'role': user['role']}}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Products endpoints
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        return jsonify({'products': products_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/products', methods=['POST'])
@jwt_required()
def add_product():
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        if user['role'] != 'admin':
            return jsonify({'error': 'Admin access required'}), 403

        data = request.get_json()
        product_id = len(products_data) + 1
        product = {
            'id': product_id,
            'name': data['name'],
            'price': data['price'],
            'category': data['category'],
            'stock': data['stock']
        }
        products_data.append(product)
        return jsonify({'product': product}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Orders endpoints
@app.route('/api/orders', methods=['POST'])
@jwt_required()
def place_order():
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        data = request.get_json()
        global order_id_counter
        order = {
            'id': order_id_counter,
            'user_id': user['user_id'],
            'products': data['products'],
            'total': data['total'],
            'status': 'pending',
            'date': datetime.now().isoformat()
        }
        orders_data.append(order)
        order_id_counter += 1
        return jsonify({'order': order}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/user/orders', methods=['GET'])
@jwt_required()
def get_user_orders():
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        user_orders = [order for order in orders_data if order['user_id'] == user['user_id']]
        return jsonify({'orders': user_orders}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/user/pets', methods=['GET'])
@jwt_required()
def get_user_pets():
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        user_pets = pets_data.get(user['user_id'], [])
        return jsonify({'pets': user_pets}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/user/pets', methods=['POST'])
@jwt_required()
def add_pet():
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        data = request.get_json()
        pet = {
            '_id': str(len(pets_data.get(user['user_id'], [])) + 1),
            'name': data['name'],
            'breed': data['breed'],
            'age': data['age'],
            'type': data['type']
        }

        if user['user_id'] not in pets_data:
            pets_data[user['user_id']] = []

        pets_data[user['user_id']].append(pet)

        return jsonify({'pet': pet}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/user/pets/<pet_id>', methods=['DELETE'])
@jwt_required()
def delete_pet(pet_id):
    try:
        current_user = get_jwt_identity()
        user = users_data.get(current_user)
        if user['user_id'] in pets_data:
            pets_data[user['user_id']] = [p for p in pets_data[user['user_id']] if p['_id'] != pet_id]
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
