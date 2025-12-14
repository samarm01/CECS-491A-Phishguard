from flash import Blueprint, request, jsonify
from flask_jwt extended import create_access_token
from api.db import SessionLocal
from api.models import User


auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.route("/login", methods=["POST"])
def login():
  data = request.get_json()

  if not data or not data.get("email") or not data.get("password"):
    return jsonify({"error": "Missing email or password"}), 400

  db = SessionLocal()
  user = db.query(User).filter(User.email == data["email"].first()

  if not user or not user.check_password(data["password"]):
    return jsonify({"error": "Invalid credentials"}), 401

  token = create_access_token(
    identify=user.id,
    additional_claims={"role": user.role}
  )

  return jsonify({
    "access_token": token,
    "user": {
      "id": user.id,
      "email": user.email
      "role": user.role
    }
  }), 200
  



