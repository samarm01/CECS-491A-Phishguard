from flask import Blueprint, jsonify, request
from api.services.auth import role_required
from api.db import SessionLocal
from api.models import User

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

@admin_bp.route("/users", methods=["GET"])
@role_required("admin")
def list_users():
  db = SessionLocal()
  users = db.query(User).all()

  return jsonify([
    {"id": u.id, "email": u.email, "role": u.role}
    for u in users
                 ])
@admin_bp.route("/users/<int:user_id>/role", methods=["PATCH"])
@role_required("admin")
def update_role(user_id):
  data = request.get_json()
  db = SessionLocal()
  user = db.query(User).get(user_id)

  user.role = data["role"]
  db.commit()

  return jsonify({"message": "Role updated"})



