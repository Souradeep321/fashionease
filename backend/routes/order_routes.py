from flask import Blueprint, request, jsonify 
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from models import Order,User
from app import razorpay_client
from models import OrderStatus
import os
import razorpay
import hmac
import hashlib




order_bp = Blueprint('order', __name__)

@order_bp.route('/api/v1/createOrder', methods=['POST'])
@jwt_required()
def create_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        # Extract order details from request
        total_amount = data.get('totalAmount')
        shipping_name = data.get('shippingName')
        phone_number = data.get('phoneNumber')
        shipping_address = data.get('shippingAddress')
        city = data.get('city')
        state = data.get('state')
        postal_code = data.get('postalCode')
        country = data.get('country')

        if not all([total_amount, shipping_name, shipping_address, city, state, postal_code, country]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Create Razorpay order (amount in paise)
        razorpay_order = razorpay_client.order.create({
            "amount": int(float(total_amount) * 100),
            "currency": "INR",
            "payment_capture": 1
        })

        # Save order in DB
        order = Order(
            user_id=user_id,
            total_amount=total_amount,
            status=OrderStatus.PENDING,
            razorpay_order_id=razorpay_order['id'],
            shipping_name=shipping_name,
            shipping_address=shipping_address,
            phone_number=phone_number,
            city=city,
            state=state,
            postal_code=postal_code,
            country=country
        )
        db.session.add(order)
        db.session.commit()

        return jsonify({
            "orderId": order.id,
            "razorpayOrderId": razorpay_order['id'],
            "amount": razorpay_order['amount'],
            "currency": razorpay_order['currency']
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@order_bp.route('/api/v1/order/validate', methods=['POST'])
@jwt_required()
def validate_order():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Debug logging
        print("Received payment validation data:", data)

        razorpay_order_id = data.get('razorpayOrderId')
        razorpay_payment_id = data.get('razorpayPaymentId')
        razorpay_signature = data.get('razorpaySignature')

        if not razorpay_order_id:
            return jsonify({'error': 'Razorpay order ID is required'}), 400
        if not razorpay_payment_id:
            return jsonify({'error': 'Razorpay payment ID is required'}), 400
        if not razorpay_signature:
            return jsonify({'error': 'Razorpay signature is required'}), 400

        # Verify signature
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")
        if not key_secret:
            print("Razorpay secret key not found in environment variables")
            return jsonify({"error": "Payment verification configuration error"}), 500

        generated_signature = hmac.new(
            key=bytes(key_secret, 'utf-8'),
            msg=bytes(f"{razorpay_order_id}|{razorpay_payment_id}", 'utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature != razorpay_signature:
            print(f"Signature mismatch: Generated={generated_signature}, Received={razorpay_signature}")
            return jsonify({"error": "Invalid payment signature"}), 400

        # Update order
        order = Order.query.filter_by(razorpay_order_id=razorpay_order_id, user_id=user_id).first()
        if not order:
            return jsonify({"error": "No order found with this ID"}), 404

        order.razorpay_payment_id = razorpay_payment_id
        order.razorpay_signature = razorpay_signature
        order.status = OrderStatus.PAID
        
        try:
            db.session.commit()
        except Exception as db_error:
            print(f"Database error: {str(db_error)}")
            db.session.rollback()
            return jsonify({"error": "Failed to update order status"}), 500

        return jsonify({
            "message": "Payment verified successfully",
            "orderId": order.id,
            "paymentId": razorpay_payment_id,
            "status": order.status.value
        }), 200

    except Exception as e:
        print(f"Validation error: {str(e)}")
        return jsonify({"error": "Payment validation failed"}), 500