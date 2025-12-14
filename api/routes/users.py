from flask import Blueprint, jsonify, request
from flask_jwt extended import jwt_required, get_jwt,identity
from api.db import SessionLocal
from api.models import User

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("/me", methods-["GET"])
