from flask import Blueprint, request, jsonify
from models import db, Order, CartItem, OrderItem, Product,User
from flask_jwt_extended import jwt_required, get_jwt_identity

order_items_bp = Blueprint('order_items', __name__)

# Route to add order items from cart
@order_items_bp.route('/api/v1/add-order-items/<int:order_id>', methods=['POST'])
@jwt_required()
def add_order_items(order_id):
    user_id = get_jwt_identity()

    # Verify the order belongs to the user
    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found or unauthorized'}), 404

    cart_items = CartItem.query.filter_by(user_id=user_id).all()
    if not cart_items:
        return jsonify({'error': 'Cart is empty'}), 400

    for item in cart_items:
        product = Product.query.get(item.product_id)
        if product:
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item.quantity,
                price=product.price,
                title=product.title,
                image=product.image
            )
            db.session.add(order_item)

    # Clear cart
    CartItem.query.filter_by(user_id=user_id).delete()
    db.session.commit()

    return jsonify({'message': 'Order items added successfully'}), 201


# Route to get order items for a specific order
@order_items_bp.route('/api/v1/get-order-items/<int:order_id>', methods=['GET'])
@jwt_required()
def get_order_items(order_id):
    user_id = get_jwt_identity()

    order = Order.query.filter_by(id=order_id, user_id=user_id).first()
    if not order:
        return jsonify({'error': 'Order not found or unauthorized'}), 404

    order_items = OrderItem.query.filter_by(order_id=order.id).all()
    return jsonify([item.to_dict() for item in order_items]), 200


# Route to get all order items for the authenticated user
@order_items_bp.route('/api/v1/get-all-order-items', methods=['GET'])
@jwt_required()
def get_all_order_items():
    try:
        user_id = get_jwt_identity()
        orders = Order.query.filter_by(user_id=user_id).all()

        if not orders:
            return jsonify({'message': 'No orders found'}), 404

        all_order_items = []
        for order in orders:
            order_items = OrderItem.query.filter_by(order_id=order.id).all()
            all_order_items.extend([item.to_dict() for item in order_items])

        return jsonify(all_order_items), 200

    except Exception as e:
        print(f"Error fetching order items: {str(e)}")
        return jsonify({'error': 'Failed to fetch order items'}), 500