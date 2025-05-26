from datetime import datetime
import enum
from db import db 

class UserRole(enum.Enum):
    CUSTOMER = "customer"
    ADMIN = "admin"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password = db.Column(db.String(120), nullable=False)
    role = db.Column(db.Enum(UserRole), nullable=False, default=UserRole.CUSTOMER)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    products = db.relationship(
        'Product', backref='user', lazy=True, cascade='all, delete-orphan'
    )

    def __repr__(self):
        return f'<User {self.username}>'

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role.value,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
        }

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(256), nullable=False)
    price = db.Column(db.Float, nullable=False)
    gender = db.Column(db.String(120), nullable=False)
    category = db.Column(db.String(120), nullable=False)
    image = db.Column(db.String(256), nullable=False, default='default.png')
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    def __repr__(self):
        return f'<Product {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'gender': self.gender,
            'category': self.category,
            'createdAt': self.created_at.isoformat(),
            'updatedAt': self.updated_at.isoformat(),
        }

class CartItem(db.Model):
    __tablename__ = 'cart_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey(Product.id), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    added_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    user = db.relationship('User', backref='cart_items')
    product = db.relationship('Product', backref='in_carts')

    def __repr__(self):
        return f'<CartItem user_id={self.user_id} product_id={self.product_id} qty={self.quantity}>'

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'productId': self.product_id,
            'quantity': self.quantity,
            'addedAt': self.added_at.isoformat(),
            'product': self.product.to_dict() if self.product else None
        }


class OrderStatus(enum.Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.Enum(OrderStatus), default=OrderStatus.PENDING, nullable=False)
    razorpay_order_id = db.Column(db.String(100))
    razorpay_payment_id = db.Column(db.String(100))
    razorpay_signature = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    # Address fields
    shipping_name = db.Column(db.String(120), nullable=False)
    shipping_address = db.Column(db.String(256), nullable=False)
    phone_number = db.Column(db.String(20), nullable=False)
    city = db.Column(db.String(120), nullable=False)
    state = db.Column(db.String(120), nullable=False)
    postal_code = db.Column(db.String(20), nullable=False)
    country = db.Column(db.String(120), nullable=False)

    user = db.relationship('User', backref='orders')

    def __repr__(self):
        return f'<Order {self.id} user_id={self.user_id} status={self.status}>'

    def to_dict(self):
        return {
            'id': self.id,
            'userId': self.user_id,
            'totalAmount': self.total_amount,
            'status': self.status.value,
            'razorpayOrderId': self.razorpay_order_id,
            'razorpayPaymentId': self.razorpay_payment_id,
            'razorpaySignature': self.razorpay_signature,
            'createdAt': self.created_at.isoformat(),
            'shippingName': self.shipping_name,
            'shippingAddress': self.shipping_address,
            'phoneNumber': self.phone_number,
            'city': self.city,
            'state': self.state,
            'postalCode': self.postal_code,
            'country': self.country,
        }


class OrderItem(db.Model):
    __tablename__ = 'order_items'
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)  # Store price at the time of order
    title = db.Column(db.String(120), nullable=False)  # Optional snapshot
    image = db.Column(db.String(256), nullable=False)  # Optional snapshot

    order = db.relationship('Order', backref=db.backref('order_items', cascade='all, delete-orphan'))
    product = db.relationship('Product')

    def __repr__(self):
        return f'<OrderItem order_id={self.order_id} product_id={self.product_id} qty={self.quantity}>'

    def to_dict(self):
        return {
            'id': self.id,
            'orderId': self.order_id,
            'productId': self.product_id,
            'quantity': self.quantity,
            'price': self.price,
            'title': self.title,
            'image': self.image,
        }




