from flask import Blueprint, request, jsonify
from models import db, UserProduct

user_product_bp = Blueprint(
    "user_products",
    __name__,
    url_prefix="/user-products"
)


@user_product_bp.post("")
def add_user_product():
    data = request.get_json()
    up = UserProduct(**data)
    db.session.add(up)
    db.session.commit()
    return jsonify({"message": "Product added to user"}), 201


@user_product_bp.put("/<int:user_id>/<int:product_id>")
def update_user_product(user_id, product_id):
    up = UserProduct.query.get_or_404((user_id, product_id))
    data = request.get_json()
    for key, value in data.items():
        setattr(up, key, value)
    db.session.commit()
    return jsonify({"message": "Updated"})


@user_product_bp.delete("/<int:user_id>/<int:product_id>")
def delete_user_product(user_id, product_id):
    up = UserProduct.query.get_or_404((user_id, product_id))
    db.session.delete(up)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204
