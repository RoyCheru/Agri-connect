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


app = create_app()