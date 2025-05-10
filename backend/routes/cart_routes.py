from flask import Blueprint, request, jsonify 
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from models import Product,User,CartItem
from decimal import Decimal

cart_bp = Blueprint('cart', __name__)

# add to cart
@cart_bp.route('/api/v1/addToCart/<int:product_id>', methods=['POST'])
@jwt_required()
def add_to_cart(product_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Check if the product is already in the user's cart
        cart_item = CartItem.query.filter_by(user_id=user.id, product_id=product.id).first()
        if cart_item:
            # Increase quantity
            cart_item.quantity += 1
        else:
            # Add new item to cart
            cart_item = CartItem(user=user, product=product, quantity=1)
            db.session.add(cart_item)

        db.session.commit()

        return jsonify({"message": "Product added to cart successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Fetch all cart items
@cart_bp.route('/api/v1/getCart', methods=['GET'])
@jwt_required()
def get_cart():
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_items = CartItem.query.filter_by(user_id=user.id).all()
        cart_data = [item.to_dict() for item in cart_items]

        return jsonify({"cartItems": len(cart_items)},{"cart": cart_data},{"total": sum(item.product.price * item.quantity for item in cart_items)}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# delete cartItem
@cart_bp.route('/api/v1/deleteCartItem/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_cart_item(item_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_item = CartItem.query.filter_by(user_id=user.id, id=item_id).first()
        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        db.session.delete(cart_item)
        db.session.commit()

        return jsonify({"message": "Cart item deleted successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# remove quantity -1
@cart_bp.route('/api/v1/updateCartItem/<int:item_id>', methods=['PUT'])
@jwt_required()
def update_cart_item(item_id):
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        cart_item = CartItem.query.filter_by(user_id=user.id, id=item_id).first()
        if not cart_item:
            return jsonify({"error": "Cart item not found"}), 404

        cart_item.quantity -= 1
        if cart_item.quantity <= 0:
            db.session.delete(cart_item)
        else:
            db.session.commit()

        return jsonify({"message": "Cart item quantity updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500  