from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.db import SessionLocal
from api.models import User

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_profile():
  db = SessionLocal()
  user = db.query(User).get(get_jwt_identity())

  return jsonify({
    "id": user.id,
    "email": user.email,
    "role": user.role,
    "created_at": user.created_at.isoformat()
  })

@users_bp.route("/me", methods=["PATCH"])
@jwt_required()
def update_profile():
  data = request.get_json()
  db = SessionLocal()
  user = db.query(User).get(get_jwt_identity())

  if "email" in data:
    user.email =  data["email"]

  db.commit()
  return jsonify({"message": "Profile updated"})

