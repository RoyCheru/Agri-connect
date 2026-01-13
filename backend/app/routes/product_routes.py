from flask import Blueprint, request, jsonify
from models import db, Product

product_bp = Blueprint("products", __name__, url_prefix="/products")


@product_bp.get("")
def get_products():
    products = Product.query.all()
    return jsonify([
        {
            "id": p.id,
            "name": p.name,
            "base_price": str(p.base_price)
        } for p in products
    ])


@product_bp.get("/<int:id>")
def get_product(id):
    product = Product.query.get_or_404(id)
    return jsonify({
        "id": product.id,
        "name": product.name,
        "description": product.description,
        "base_price": str(product.base_price)
    })


@product_bp.post("")
def create_product():
    data = request.get_json()
    product = Product(**data)
    db.session.add(product)
    db.session.commit()
    return jsonify({"id": product.id}), 201


@product_bp.put("/<int:id>")
def update_product(id):
    product = Product.query.get_or_404(id)
    data = request.get_json()
    for key, value in data.items():
        setattr(product, key, value)
    db.session.commit()
    return jsonify({"message": "Updated"})


@product_bp.delete("/<int:id>")
def delete_product(id):
    product = Product.query.get_or_404(id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Deleted"}), 204
