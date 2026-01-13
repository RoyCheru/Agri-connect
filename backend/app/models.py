from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class UserType(db.Model):
    __tablename__ = "user_type"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)

    users = db.relationship("User", backref="user_type", lazy=True)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)

    user_type_id = db.Column(
        db.Integer,
        db.ForeignKey("user_type.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    products = db.relationship("UserProduct", backref="user", lazy=True)
    orders = db.relationship("Order", backref="user", lazy=True)

class Product(db.Model):
    __tablename__ = "product"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    description = db.Column(db.String(255))
    base_price = db.Column(db.Numeric(10, 2), nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    listings = db.relationship("UserProduct", backref="product", lazy=True)
    order_items = db.relationship("OrderItem", backref="product", lazy=True)

class UserProduct(db.Model):
    __tablename__ = "user_product"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("product.id"),
        nullable=False
    )

    price = db.Column(db.Numeric(10, 2), nullable=False)
    stock_quantity = db.Column(db.Integer, nullable=False)

    order_items = db.relationship("OrderItem", backref="user_product", lazy=True)

class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total_price = db.Column(db.Numeric(10, 2), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="pending")

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # Relationships
    items = db.relationship(
        "OrderItem",
        backref="order",
        lazy=True,
        cascade="all, delete-orphan"
    )
class OrderItem(db.Model):
    __tablename__ = "order_item"

    id = db.Column(db.Integer, primary_key=True)

    order_id = db.Column(
        db.Integer,
        db.ForeignKey("order.id"),
        nullable=False
    )

    product_id = db.Column(
        db.Integer,
        db.ForeignKey("product.id"),
        nullable=False
    )

    user_product_id = db.Column(
        db.Integer,
        db.ForeignKey("user_product.id"),
        nullable=False
    )

    price_at_purchase = db.Column(db.Numeric(10, 2), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
