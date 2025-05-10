from functools import wraps
from flask_jwt_extended import get_jwt_identity, jwt_required
from models import User, UserRole
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request


def admin_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            verify_jwt_in_request()  # <-- this replaces @jwt_required()

            user_id = get_jwt_identity()
            if not user_id:
                return jsonify({"error": "Invalid token or user ID"}), 401

            user = User.query.get(user_id)

            if user is None or user.role != UserRole.ADMIN:
                return jsonify({"error": "Unauthorized access, admin role required"}), 403

            return fn(*args, **kwargs)

        except Exception as e:
            return jsonify({"error": f"Internal error: {str(e)}"}), 500

    return wrapper


