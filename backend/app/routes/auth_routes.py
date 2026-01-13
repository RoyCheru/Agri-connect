from flask import Blueprint, request, jsonify
from models import db, User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.post("/register")
def register():
    data = request.get_json()
    user = User(**data)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201


@auth_bp.post("/login")
def login():
    data = request.get_json()
    return jsonify({"message": "Logged in"}), 200


@auth_bp.post("/logout")
def logout():
    return jsonify({"message": "Logged out"}), 200
