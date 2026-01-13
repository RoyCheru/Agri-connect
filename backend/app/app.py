from flask import Flask
from flask_migrate import Migrate

from app.models import db
from app.routes import register_routes   


def create_app():
    app = Flask(__name__)

    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///agri_connect.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    Migrate(app, db)

    register_routes(app)   

    return app


app = create_app()
