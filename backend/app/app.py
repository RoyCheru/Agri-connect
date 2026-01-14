from flask import Flask, request, jsonify
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from flask import session
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

    db.init_app(app)
    Migrate(app, db)

    app.secret_key = "super-secret-key"  
    
    app.config.update(
    SESSION_COOKIE_SAMESITE="None",
    SESSION_COOKIE_SECURE=False,
)

    CORS(
        app,
        supports_credentials=True,
        origins=["http://localhost:3000"]
    )

    @app.post("/user-types")
    def create_user_type():
        data = request.get_json()
        user_type = UserType(**data)
        db.session.add(user_type)
        db.session.commit()
        return jsonify({"id": user_type.id}), 201
    
    @app.get("/user-types")
    def get_user_types():
        types = UserType.query.all()
        return jsonify([
            {"id": t.id, "name": t.name} for t in types
        ])

    @app.get("/user-types/<int:id>")
    def get_user_type(id):
        t = UserType.query.get_or_404(id)
        return jsonify({"id": t.id, "name": t.name})


    @app.put("/user-types/<int:id>")
    def update_user_type(id):
        t = UserType.query.get_or_404(id)
        data = request.get_json()
        t.name = data.get("name", t.name)
        db.session.commit()
        return jsonify({"message": "User type updated"})


    @app.delete("/user-types/<int:id>")
    def delete_user_type(id):
        t = UserType.query.get_or_404(id)
        db.session.delete(t)
        db.session.commit()
        return "", 204


    @app.post("/users")
    def create_user():
        data = request.get_json()

        hashed_password = generate_password_hash(data["password"])

        user = User(
            name=data["name"],
            email=data["email"],
            password=hashed_password,
            user_type_id=data["user_type_id"]
        )

        db.session.add(user)
        db.session.commit()

        return jsonify({
            "id": user.id,
            "email": user.email,
            "user_type_id": user.user_type_id
        }), 201
    
    
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
    def get_current_user():
        user_id = session.get("user_id")

        if not user_id:
            return jsonify({"error": "Not authenticated"}), 401

        user = User.query.get(user_id)

        return jsonify({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "user_type_id": user.user_type_id
        })


    @app.get("/users")
    def get_users():
        users = User.query.all()
        return jsonify([
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "user_type_id": u.user_type_id
            } for u in users
        ])


    @app.get("/users/<int:id>")
    def get_user(id):
        u = User.query.get_or_404(id)
        return jsonify({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "user_type_id": u.user_type_id
        })


    @app.put("/users/<int:id>")
    def update_user(id):
        u = User.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(u, key, value)
        db.session.commit()
        return jsonify({"message": "User updated"})


    @app.delete("/users/<int:id>")
    def delete_user(id):
        u = User.query.get_or_404(id)
        db.session.delete(u)
        db.session.commit()
        return "", 204

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


    @app.get("/products/<int:id>")
    def get_product(id):
        p = Product.query.get_or_404(id)
        return jsonify({
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "base_price": str(p.base_price)
        })


    @app.put("/products/<int:id>")
    def update_product(id):
        p = Product.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(p, key, value)
        db.session.commit()
        return jsonify({"message": "Product updated"})


    @app.delete("/products/<int:id>")
    def delete_product(id):
        p = Product.query.get_or_404(id)
        db.session.delete(p)
        db.session.commit()
        return "", 204

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


    @app.get("/user-products/<int:user_id>/<int:product_id>")
    def get_user_product(user_id, product_id):
        up = UserProduct.query.get_or_404((user_id, product_id))
        return jsonify({
            "user_id": up.user_id,
            "product_id": up.product_id,
            "price": str(up.price),
            "stock_quantity": up.stock_quantity
        })


    @app.put("/user-products/<int:user_id>/<int:product_id>")
    def update_user_product(user_id, product_id):
        up = UserProduct.query.get_or_404((user_id, product_id))
        data = request.get_json()
        for key, value in data.items():
            setattr(up, key, value)
        db.session.commit()
        return jsonify({"message": "User product updated"})


    @app.delete("/user-products/<int:user_id>/<int:product_id>")
    def delete_user_product(user_id, product_id):
        up = UserProduct.query.get_or_404((user_id, product_id))
        db.session.delete(up)
        db.session.commit()
        return "", 204
    
    
    @app.post("/orders")
    def create_order():
        data = request.get_json()
        order = Order(**data)
        db.session.add(order)
        db.session.commit()
        return jsonify({"id": order.id}), 201


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


    @app.get("/orders/<int:id>")
    def get_order(id):
        o = Order.query.get_or_404(id)
        return jsonify({
            "id": o.id,
            "user_id": o.user_id,
            "status": o.status,
            "total_price": str(o.total_price)
        })


    @app.put("/orders/<int:id>")
    def update_order(id):
        o = Order.query.get_or_404(id)
        data = request.get_json()
        for key, value in data.items():
            setattr(o, key, value)
        db.session.commit()
        return jsonify({"message": "Order updated"})


    @app.delete("/orders/<int:id>")
    def delete_order(id):
        o = Order.query.get_or_404(id)
        db.session.delete(o)
        db.session.commit()
        return "", 204

    @app.post("/order-items")
    def create_order_item():
        data = request.get_json()
        item = OrderItem(**data)
        db.session.add(item)
        db.session.commit()
        return jsonify({"message": "Order item created"}), 201


    @app.get("/order-items")
    def get_order_items():
        items = OrderItem.query.all()
        return jsonify([
            {
                "order_id": i.order_id,
                "product_id": i.product_id,
                "quantity": i.quantity,
                "price": str(i.price)
            } for i in items
        ])


    @app.get("/order-items/<int:order_id>/<int:product_id>")
    def get_order_item(order_id, product_id):
        i = OrderItem.query.get_or_404((order_id, product_id))
        return jsonify({
            "order_id": i.order_id,
            "product_id": i.product_id,
            "quantity": i.quantity,
            "price": str(i.price)
        })


    @app.put("/order-items/<int:order_id>/<int:product_id>")
    def update_order_item(order_id, product_id):
        i = OrderItem.query.get_or_404((order_id, product_id))
        data = request.get_json()
        for key, value in data.items():
            setattr(i, key, value)
        db.session.commit()
        return jsonify({"message": "Order item updated"})


    @app.delete("/order-items/<int:order_id>/<int:product_id>")
    def delete_order_item(order_id, product_id):
        i = OrderItem.query.get_or_404((order_id, product_id))
        db.session.delete(i)
        db.session.commit()
        return "", 204

    return app

app = create_app()