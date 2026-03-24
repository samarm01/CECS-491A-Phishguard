from flask import Blueprint, jsonify, request
from api.services.auth import role_required
from api.db import SessionLocal
from api.models import User
from api.models.models import Email # Update import based on your actual model name
from ml.train import retrain_model
from flask_jwt_extended import jwt_required

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

@admin_bp.route("/retrain", methods=["POST"])
@jwt_required()
def trigger_retraining():
    db = SessionLocal()
    try:
        # 1. Fetch all emails that have been manually corrected by an admin
        # (You might want to add a 'retrained' boolean column to your DB later 
        # so you don't retrain on the same data twice).
        feedback_emails = db.query(Email).filter(
            Email.status.in_(['false_positive', 'confirmed_phish'])
        ).all()

        if not feedback_emails:
            return jsonify({"message": "No new feedback data available for retraining."}), 200

        # 2. Trigger the ML pipeline
        success, result = retrain_model(feedback_emails)

        if success:
            # Optional: Log this action in your DetectionLog table for the dashboard
            return jsonify({"message": "Model successfully retrained!", "details": result}), 200
        else:
            return jsonify({"error": "Failed to retrain model."}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()


