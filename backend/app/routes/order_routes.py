from flask import Blueprint, request, jsonify
from models import db, Order, OrderItem

order_bp = Blueprint("orders", __name__)


@order_bp.post("/orders")
def create_order():
    data = request.get_json()
    order = Order(**data)
    db.session.add(order)
    db.session.commit()
    return jsonify({"order_id": order.id}), 201


@order_bp.get("/orders/<int:id>")
def get_order(id):
    order = Order.query.get_or_404(id)
    return jsonify({
        "id": order.id,
        "status": order.status,
        "total_price": str(order.total_price)
    })


@order_bp.post("/orders/<int:order_id>/items")
def add_order_item(order_id):
    data = request.get_json()
    item = OrderItem(order_id=order_id, **data)
    db.session.add(item)
    db.session.commit()
    return jsonify({"message": "Item added"}), 201


@order_bp.put("/orders/<int:order_id>/items/<int:product_id>")
def update_order_item(order_id, product_id):
    item = OrderItem.query.get_or_404((order_id, product_id))
    data = request.get_json()
    for key, value in data.items():
        setattr(item, key, value)
    db.session.commit()
    return jsonify({"message": "Updated"})


@order_bp.delete("/orders/<int:order_id>/items/<int:product_id>")
def remove_order_item(order_id, product_id):
    item = OrderItem.query.get_or_404((order_id, product_id))
    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Item removed"}), 204
