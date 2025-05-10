from flask import Blueprint, request, jsonify 
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import db
from models import Product,User
import cloudinary
from decorators.roles import admin_required  
from cloudinary.uploader import upload
from cloudinary.uploader import destroy
from cloudinary.exceptions import Error as CloudinaryError
from decimal import Decimal
from sqlalchemy.exc import SQLAlchemyError


# Create a product (only for logged-in users)
product_bp = Blueprint('product', __name__)

# Get all products for customer in shuffle order
@product_bp.route('/api/v1/products/shuffle', methods=['GET'])
def get_all_products_shuffle():
    try:
        products = Product.query.all()
        
        if not products:
            return jsonify({"message": "No products found"}), 404
        
        # Shuffle the products
        import random
        random.shuffle(products)
        
        result = [product.to_dict() for product in products]
        return jsonify({
            "message": f"Found {len(result)} products",
            "products": result
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching products: {str(e)}"}), 500


# Get all products for admin
@product_bp.route('/api/v1/products', methods=['GET'])
@admin_required
def get_all_products():
    try:
        products = Product.query.all()
        
        if not products:
            return jsonify({"message": "No products found"}), 404
        
        result = [product.to_dict() for product in products]
        return jsonify({
            "message": f"Found {len(result)} products",
            "products": result
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching products: {str(e)}"}), 500

# Get all products for customer
@product_bp.route('/api/v1/customerProducts', methods=['GET'])
def get_all_products_customer():
    try:
        products = Product.query.all()
        
        if not products:
            return jsonify({"message": "No products found"}), 404
        
        result = [product.to_dict() for product in products]
        return jsonify({
            "message": f"Found {len(result)} products",
            "products": result
        }), 200
    except Exception as e:
        return jsonify({"error": f"Error fetching products: {str(e)}"}), 500




@product_bp.route('/api/v1/products/<int:product_id>', methods=['GET'])
@admin_required  # Remove this if customers should access it
def get_product(product_id):
    try:
        # Get product with basic eager loading
        product = Product.query.options(db.joinedload(Product.user)).get(product_id)
        
        if not product:
            return jsonify({"error": "Product not found"}), 404
            
        # Include user details in response
        product_data = product.to_dict()
        product_data['user'] = product.user.to_dict() if product.user else None
        
        return jsonify(product_data), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500



# Create a product
@product_bp.route('/api/v1/products', methods=['POST'])
@admin_required 
def create_product():
    try:
        data = request.form  

        required_fields = ['title', 'description', 'price', 'gender', 'category']
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f'Missing required field: {field}'}), 400

        # Extract data from form
        title = data.get('title')
        description = data.get('description')
        price = Decimal(data.get('price'))
        gender = data.get('gender')
        category = data.get('category')

        # Handle image upload to Cloudinary
        if 'image' not in request.files or not request.files['image']:
            return jsonify({"error": "Image file is required"}), 400
        
        image_file = request.files['image']
        try:
            cloudinary_response = upload(image_file)
            image_url = cloudinary_response.get('secure_url')
            if not image_url:
                return jsonify({"error": "Image upload failed"}), 500
        except CloudinaryError as e:
            return jsonify({"error": f"Cloudinary upload failed: {str(e)}"}), 500

        # Get user ID from JWT token
        user_id = get_jwt_identity()
        user = User.query.get(user_id)

        if not user:
            try:
                public_id = cloudinary_response.get('public_id')
                if public_id:
                    destroy(public_id)
            except CloudinaryError:
                pass
            return jsonify({"error": "User not found"}), 404


        # Create the Product object and add to DB
        new_product = Product(
            title=title,
            description=description,
            price=price,
            gender=gender,
            category=category,
            image=image_url,
            user_id=user.id
        )

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            "message": "Product created successfully",
            "product": new_product.to_dict()
        }), 201

        print("Product created successfully")
    except Exception as e:
        db.session.rollback()
        
        try:
            if 'cloudinary_response' in locals():
                public_id = cloudinary_response.get('public_id')
                if public_id:
                    destroy(public_id)
        except CloudinaryError:
            pass

        return jsonify({"error": str(e)}), 500
 


# Update a product
@product_bp.route('/api/v1/products/<int:product_id>', methods=['PUT'])
@admin_required
def update_product(product_id):
    try:
        # Get the product from the database
        product = Product.query.get(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        data = request.form  # Use form data for file uploads

        # Check for required fields
        required_fields = ['title', 'description', 'price', 'gender', 'category']
        for field in required_fields:
            if field not in data or not data.get(field):
                return jsonify({"error": f'Missing required field: {field}'}), 400

        # Extract updated values
        product.title = data.get('title')
        product.description = data.get('description')
        product.price = float(data.get('price'))
        product.gender = data.get('gender')
        product.category = data.get('category')

        # Handle image update
        if 'image' in request.files and request.files['image']:
            new_image_file = request.files['image']
            try:
                cloudinary_response = upload(new_image_file)
                new_image_url = cloudinary_response.get('secure_url')
                if not new_image_url:
                    return jsonify({"error": "Image upload failed"}), 500

                # Delete old image from Cloudinary
                old_image_url = product.image
                if old_image_url:
                    old_public_id = old_image_url.split('/')[-1].split('.')[0]
                    try:
                        destroy(old_public_id)
                    except CloudinaryError:
                        pass  # Ignore failure to delete old image

                product.image = new_image_url

            except CloudinaryError as e:
                return jsonify({"error": f"Cloudinary upload failed: {str(e)}"}), 500

        db.session.commit()

        return jsonify({
            "message": "Product updated successfully",
            "product": product.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()

        # Clean up the new image if it was uploaded
        try:
            if 'cloudinary_response' in locals():
                public_id = cloudinary_response.get('public_id')
                if public_id:
                    destroy(public_id)
        except CloudinaryError:
            pass

        return jsonify({"error": str(e)}), 500


# Delete a product
@product_bp.route('/api/v1/products/<int:product_id>', methods=['DELETE'])
@admin_required
def delete_product(product_id):
    try:
        # Get the product by ID
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({"error": "Product not found"}), 404
        
        # Extract the public ID from the image URL
        image_url = product.image
        if image_url != 'default.png':  # Check if the product has an image
            # Extract the public ID from the URL (Cloudinary's public ID is the part after 'upload/' and before any extension)
            public_id = image_url.split('/')[7].split('.')[0]  # Assuming the image URL follows Cloudinary's pattern
            
            try:
                # Delete the image from Cloudinary
                destroy(public_id)
            except CloudinaryError as e:
                return jsonify({"error": f"Cloudinary delete failed: {str(e)}"}), 500
        
        # Delete the product from the database
        db.session.delete(product)
        db.session.commit()

        return jsonify({
            "message": f"Product with ID {product_id} and its image deleted successfully"
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error deleting product: {str(e)}"}), 500


# get suggested products based on title and gender 
@product_bp.route('/api/v1/products/suggestions', methods=['GET'])
def get_suggested_products():
    try:
        # title = request.args.get('title')
        gender = request.args.get('gender')

        if not gender:
            return jsonify({"error": "Missing required parameters"}), 400
# title=title,
        products = Product.query.filter_by( gender=gender).all()

        return jsonify({"products": [product.to_dict() for product in products]}), 200

    except Exception as e:
        return jsonify({"error": f"Error fetching suggested products: {str(e)}"}), 500








