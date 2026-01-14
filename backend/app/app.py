from flask import Flask, request, jsonify
from flask_migrate import Migrate

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
        user = User(**data)
        db.session.add(user)
        db.session.commit()
        return jsonify({"id": user.id}), 201


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

app = create_app()