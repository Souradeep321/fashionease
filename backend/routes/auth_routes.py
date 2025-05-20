from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token, get_jwt_identity,
    jwt_required, set_access_cookies, unset_jwt_cookies
)
from models import User
from db import db
from werkzeug.security import generate_password_hash, check_password_hash
import re  # For regex
from decorators.roles import admin_required

auth_bp = Blueprint('auth', __name__)

# Home
@auth_bp.route('/', methods=['GET'])
def index():
    return jsonify({'message': "Hello, World!"}), 200

# Get all users only admin
@auth_bp.route('/api/v1/users', methods=['GET'])
@admin_required
def get_all_users():
    try:
        users = User.query.all()
        user_list = [user.to_dict() for user in users]
        return jsonify({'users': user_list}), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching users: {str(e)}"}), 500

# Register User
@auth_bp.route('/api/v1/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        required_fields = ["username", "email", "password"]
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f'Missing required field: {field}'}), 400

        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # ✅ Email validation
        email_regex = r"[^@]+@[^@]+\.[^@]+"
        if not re.match(email_regex, email):
            return jsonify({"error": "Invalid email format"}), 400

        # ✅ Password validation
        password_regex = r"^(?=.*[A-Za-z])(?=.*\d).{6,}$"
        if not re.match(password_regex, password):
            return jsonify({
                "error": "Password must be at least 6 characters long and contain at least one letter and one number"
            }), 400


        # ✅ Check for existing user
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            return jsonify({'error': 'Username or email already exists'}), 409

        # ✅ Hash password
        hashed_password = generate_password_hash(password)

        new_user = User(username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        # ✅ Create access token
        access_token = create_access_token(identity=str(new_user.id))
        response = jsonify({
            "message": "Registration successful",
            "user": new_user.to_dict()
        })
        set_access_cookies(response, access_token)  # ✅ Set JWT in cookie
        return response, 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Login User
@auth_bp.route('/api/v1/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # ✅ Find user by email
        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "Invalid credentials"}), 401

        # ✅ Check password
        if not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid credentials"}), 401

        # ✅ Create token
        access_token = create_access_token(identity=str(user.id))

        # ✅ Set JWT cookie
        response = jsonify({
            "message": "Login successful",
            "user": user.to_dict()
        })
        set_access_cookies(response, access_token)
        print(access_token) 
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete User
@auth_bp.route('/api/v1/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        user = User.query.get_or_404(user_id)
        if user is None:
            return jsonify({'error': 'User not found'}), 404
            
        db.session.delete(user)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# Logout
@auth_bp.route('/api/v1/logout', methods=['POST'])
def logout():
    try:
        response = jsonify({"message": "Logout successful"})
        unset_jwt_cookies(response)  # ✅ removes JWT cookie from browser
        return response, 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



# get profile
@auth_bp.route('/api/v1/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()  # 🔐 Get the user ID from the token
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



