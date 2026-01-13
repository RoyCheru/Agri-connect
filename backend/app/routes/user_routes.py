from flask import Blueprint, jsonify
from models import User, UserProduct, Order

user_bp = Blueprint("users", __name__, url_prefix="/users")


@user_bp.get("/<int:id>")
def get_user(id):
    user = User.query.get_or_404(id)
    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "user_type": user.user_type.name
    })


@user_bp.get("/<int:id>/products")
def get_user_products(id):
    products = UserProduct.query.filter_by(user_id=id).all()
    return jsonify([
        {
            "product_id": p.product_id,
            "price": str(p.price),
            "stock_quantity": p.stock_quantity
        } for p in products
    ])


@user_bp.get("/<int:id>/orders")
def get_user_orders(id):
    orders = Order.query.filter_by(user_id=id).all()
    return jsonify([
        {
            "id": o.id,
            "total_price": str(o.total_price),
            "status": o.status,
            "created_at": o.created_at
        } for o in orders
    ])
