from flask import Flask, request, jsonify, session
from flask_migrate import Migrate
from werkzeug.security import check_password_hash
from flask_cors import CORS

from app.models import (
    db,
    User,
    UserType,
    Product,
    UserProduct,
    Order,
    OrderItem
)

def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///agri_connect.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.secret_key = "super-secret-key"

    app.config.update(
        SESSION_COOKIE_SAMESITE="Lax",
        SESSION_COOKIE_SECURE=False,
    )

    db.init_app(app)
    Migrate(app, db)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type"]
    )


    @app.post("/login")
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data["email"]).first()

        if not user or not check_password_hash(user.password, data["password"]):
            return jsonify({"error": "Invalid credentials"}), 401

        session["user_id"] = user.id

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type_id": user.user_type_id
        })

    @app.post("/logout")
    def logout():
        session.pop("user_id", None)
        return jsonify({"message": "Logged out"})

    @app.get("/me")
    def me():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401

        user = User.query.get_or_404(user_id)
        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type_id": user.user_type_id
        })


    @app.post("/products")
    def create_product():
        data = request.get_json()
        product = Product(**data)
        db.session.add(product)
        db.session.commit()
        return jsonify({"id": product.id}), 201

    @app.get("/products")
    def get_products():
        products = Product.query.all()
        return jsonify([
            {
                "id": p.id,
                "name": p.name,
                "base_price": str(p.base_price)
            } for p in products
        ])


    @app.post("/user-products")
    def create_user_product():
        data = request.get_json()
        up = UserProduct(**data)
        db.session.add(up)
        db.session.commit()
        return jsonify({"message": "User product created"}), 201

    @app.get("/user-products")
    def get_user_products():
        ups = UserProduct.query.all()
        return jsonify([
            {
                "user_id": up.user_id,
                "product_id": up.product_id,
                "price": str(up.price),
                "stock_quantity": up.stock_quantity
            } for up in ups
        ])


    @app.get("/orders")
    def get_orders():
        orders = Order.query.all()
        return jsonify([
            {
                "id": o.id,
                "user_id": o.user_id,
                "status": o.status,
                "total_price": str(o.total_price)
            } for o in orders
        ])


    @app.get("/order-items")
    def get_order_items():
        items = OrderItem.query.all()
        return jsonify([
            {
                "order_id": i.order_id,
                "product_id": i.product_id,
                "quantity": i.quantity,
                "price": str(i.price_at_purchase)
            } for i in items
        ])


    @app.post("/orders-with-items")
    def create_order_with_items():
        user_id = session.get("user_id")
        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401

        data = request.get_json()
        items = data.get("items", [])

        if not items:
            return jsonify({"error": "No items provided"}), 400

        total_price = 0
        order_items = []

        try:
            for item in items:
                product_id = item["product_id"]
                quantity = int(item["quantity"])

                user_product = UserProduct.query.filter_by(
                    product_id=product_id
                ).first()

                if not user_product or user_product.stock_quantity < quantity:
                    return jsonify({"error": "Insufficient stock"}), 400

                price = float(user_product.price)
                total_price += price * quantity

                order_items.append((user_product, product_id, quantity, price))

            order = Order(
                user_id=user_id,
                total_price=total_price,
                status="pending"
            )

            db.session.add(order)
            db.session.flush()

            for up, pid, qty, price in order_items:
                db.session.add(OrderItem(
                    order_id=order.id,
                    product_id=pid,
                    quantity=qty,
                    price_at_purchase=price
                ))
                up.stock_quantity -= qty

            db.session.commit()
            return jsonify({"order_id": order.id}), 201

        except Exception as e:
            db.session.rollback()
            return jsonify({"error": str(e)}), 500


    @app.get("/farmer-orders")
    def farmer_orders():
        farmer_id = session.get("user_id")
        if not farmer_id:
            return jsonify({"error": "Not authenticated"}), 401

        orders = (
            db.session.query(Order)
            .join(OrderItem, OrderItem.order_id == Order.id)
            .join(UserProduct, UserProduct.product_id == OrderItem.product_id)
            .filter(UserProduct.user_id == farmer_id)
            .distinct()
            .all()
        )

        return jsonify([
            {
                "id": o.id,
                "buyer_id": o.user_id,
                "status": o.status,
                "total_price": str(o.total_price)
            } for o in orders
        ])


    @app.put("/farmer-orders/<int:order_id>/accept")
    def accept_order(order_id):
        farmer_id = session.get("user_id")
        if not farmer_id:
            return jsonify({"error": "Not authenticated"}), 401

        order = Order.query.get_or_404(order_id)

        valid = (
            db.session.query(OrderItem)
            .join(UserProduct, UserProduct.product_id == OrderItem.product_id)
            .filter(
                OrderItem.order_id == order_id,
                UserProduct.user_id == farmer_id
            )
            .first()
        )

        if not valid:
            return jsonify({"error": "Unauthorized"}), 403

        order.status = "accepted"
        db.session.commit()
        return jsonify({"status": "accepted"})


    @app.put("/farmer-orders/<int:order_id>/reject")
    def reject_order(order_id):
        farmer_id = session.get("user_id")
        if not farmer_id:
            return jsonify({"error": "Not authenticated"}), 401

        order = Order.query.get_or_404(order_id)

        items = (
            db.session.query(OrderItem)
            .join(UserProduct, UserProduct.product_id == OrderItem.product_id)
            .filter(
                OrderItem.order_id == order_id,
                UserProduct.user_id == farmer_id
            )
            .all()
        )

        if not items:
            return jsonify({"error": "Unauthorized"}), 403

        for item in items:
            up = UserProduct.query.filter_by(
                user_id=farmer_id,
                product_id=item.product_id
            ).first()
            if up:
                up.stock_quantity += item.quantity

        order.status = "rejected"
        db.session.commit()
        return jsonify({"status": "rejected"})


    @app.put("/orders/<int:order_id>/pay")
    def pay_for_order(order_id):
        buyer_id = session.get("user_id")
        if not buyer_id:
            return jsonify({"error": "Not authenticated"}), 401

        order = Order.query.get_or_404(order_id)

        if order.user_id != buyer_id:
            return jsonify({"error": "Unauthorized"}), 403

        if order.status != "accepted":
            return jsonify({"error": "Order not payable"}), 400

        order.status = "paid"
        db.session.commit()
        return jsonify({"status": "paid"})

    return app

app = create_app()
