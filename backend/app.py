from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from db import db  # ✅ import db from separate module
from datetime import timedelta
from dotenv import load_dotenv
import os
import cloudinary
import cloudinary.uploader
import cloudinary.api
import razorpay


app = Flask(__name__)
CORS(app,
    origins=["http://localhost:5173"],
    supports_credentials=True,
    expose_headers=["Content-Type", "Authorization"],
    allow_headers=["Content-Type", "Authorization"]
)

load_dotenv()  # Load environment variables
razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID"),      # Your Razorpay Key ID
        os.getenv("RAZORPAY_KEY_SECRET")   # Your Razorpay Key Secret
    )
)

print(os.getenv('RAZORPAY_KEY_ID'))
print(os.getenv('RAZORPAY_KEY_SECRET'))

print(os.getenv('JWT_SECRET_KEY'))

# Configuration
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY') 
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# JWT Cookie Config ✅
app.config['JWT_TOKEN_LOCATION'] = ['headers', 'cookies']
app.config['JWT_COOKIE_SECURE'] = False  # Set to True in production (HTTPS)
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'  # Cookie available site-wide
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Enable for added security
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)  # Adjust as needed
app.config['JWT_SESSION_COOKIE'] = False  # Important for API endpoints
app.config['JWT_COOKIE_SAMESITE'] = 'Lax'  # or 'None' if using cross-site


# Cloudinary config
cloudinary.config(
    cloud_name= os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key= os.getenv('CLOUDINARY_API_KEY'),       
    api_secret= os.getenv('CLOUDINARY_API_SECRET'), 
    secure=True 
)

# Initialize extensions
db.init_app(app)  # ✅ important: initialize db here
jwt = JWTManager(app)

# Register Blueprints after init
from routes.auth_routes import auth_bp
from routes.product_routes import product_bp
from routes.cart_routes import cart_bp
from routes.order_routes import order_bp
from routes.order_items import order_items_bp

app.register_blueprint(auth_bp)
app.register_blueprint(product_bp)
app.register_blueprint(cart_bp)
app.register_blueprint(order_bp)
app.register_blueprint(order_items_bp)
    

# Create DB tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)

