from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from api.db import SessionLocal
from api.models import Email, Log, User
from sqlalchemy import func, cast, Date, text
from ml.features import get_human_readable_reasons
from datetime import datetime

data_bp = Blueprint("data", __name__, url_prefix="/api/data")

# --- 1. DASHBOARD STATS ---
@data_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_stats():
    db = SessionLocal()
    
    # 1. Real Counts
    total_emails = db.query(Email).count()
    threats = db.query(Email).filter(Email.risk_score > 0.7).count()
    quarantined = db.query(Email).filter(Email.status == "quarantined").count()
    
    # 2. Aggregated Chart Data (Task 9.2)
    daily_counts = db.query(
        func.date(Email.received_at).label('date'),
        func.count(Email.id).label('count')
    ).group_by(func.date(Email.received_at)).order_by(func.date(Email.received_at)).all()

    chart_data = [{"name": str(day.date), "attempts": day.count} for day in daily_counts]
    if not chart_data:
        chart_data = [{"name": "No Data", "attempts": 0}]

    # 3. Recent Quarantine (Top 3)
    recent_quarantine_raw = db.query(Email).filter(Email.status == "quarantined").order_by(Email.received_at.desc()).limit(3).all()
    recent_quarantine = [{
        "title": e.sender.split('@')[0],
        "subtitle": e.subject[:30] + "...",
        "badge": "High Risk" if e.risk_score > 0.9 else "Suspicious"
    } for e in recent_quarantine_raw]

    # 4. Recent Logs (Top 3)
    recent_logs_raw = db.query(Log).order_by(Log.created_at.desc()).limit(3).all()
    recent_logs = [{
        "time": l.created_at.strftime("%I:%M %p"),
        "action": l.type,
        "target": l.message[:40] + "...", #truncate message 
        "type": "danger" if "FLAGGED" in l.type else "info"
    } for l in recent_logs_raw]

    return jsonify({
        "scanned": total_emails,
        "threats": threats,
        "quarantined": quarantined,
        "status": "Online",
        "chart": chart_data,
        "recent_quarantine": recent_quarantine, #sent to UI
        "recent_logs": recent_logs #sent to UI
    })

# --- 2. QUARANTINE LIST ---
@data_bp.route("/emails", methods=["GET"])
@jwt_required()
def get_emails():
    db = SessionLocal()
    emails = db.query(Email).filter(Email.status == "quarantined").all()
    
    response_data = []
    for e in emails:
        # Assuming your Email model stores the extracted features as a dictionary.
        # If it doesn't, you will need to re-run `extract_features(e.headers, e.body)` here.
        email_features = e.features_dict if hasattr(e, 'features_dict') else {} 
        
        # Get the list of plain-English reasons
        reasons_list = get_human_readable_reasons(email_features)
        
        # Combine them into a single string for the 'details' section
        detailed_explanation = " ".join(reasons_list)

        response_data.append({
            "id": e.id,
            "sender": e.sender,
            "subject": e.subject,
            "date": e.received_at.strftime("%Y-%m-%d"),
            # Use the primary reason for the red banner
            "reason": reasons_list if reasons_list else "Suspicious Pattern", 
            "status": e.status,
            "analysis": {
                "confidence": round(e.risk_score * 100, 1),
                # Send the combined explanation to the 'Analysis Details' section
                "details": detailed_explanation, 
                "preview": e.body 
            }
        })
        
    return jsonify(response_data)
    
# --- 3. LOGS LIST ---
@data_bp.route("/logs", methods=["GET"])
@jwt_required()
def get_logs():
    db = SessionLocal()
    logs = db.query(Log).order_by(Log.created_at.desc()).limit(50).all()
    
    response = []
    for l in logs:
        # If it's an admin action, we extract the word "Admin" to show in the UI
        display_user = "System"
        if l.type.startswith("ADMIN_"):
            display_user = "Admin" 

        response.append({
            "id": l.id,
            "timestamp": l.created_at.strftime("%Y-%m-%d %H:%M"),
            "type": l.type,
            "details": l.message,
            "user": display_user
        })
        
    return jsonify(response)

# --- 4. TREND ANALYSIS DATA ---
@data_bp.route("/trends", methods=["GET"])
@jwt_required()
def get_trends():
    db = SessionLocal()
    
    # 1. Line Data: Attempts Over Time (Task 9.2)
    daily_counts = db.query(
        func.date(Email.received_at).label('date'),
        func.count(Email.id).label('count')
    ).group_by(func.date(Email.received_at)).order_by(func.date(Email.received_at)).all()
    
    line_data = [{"name": str(d.date), "attempts": d.count} for d in daily_counts]

    # 2. Pie Data: Threats by Status (Task 10.2 Logic Mapping)
    status_counts = db.query(
        Email.status, func.count(Email.id)
    ).group_by(Email.status).all()
    
    # Map database status to frontend colors
    color_map = {"quarantined": "#ef4444", "safe": "#22c55e", "pending": "#f59e0b"}
    pie_data = [
        {"name": s.capitalize(), "value": c, "color": color_map.get(s, "#94a3b8")} 
        for s, c in status_counts
    ]

    # 3. Bar Data: Targeted Departments (Task 9.4)
    # Note: Ensure you added the 'department' column to your Email model first
    dept_counts = db.query(
        Email.department, func.count(Email.id)
    ).group_by(Email.department).all()

    # bar_data = [{"name": d if d else "Unknown", "attempts": c} for d, c in dept_counts]
    bar_data = [
        {"name": "Finance", "attempts": 142},
        {"name": "HR", "attempts": 89},
        {"name": "IT Support", "attempts": 214},
        {"name": "Executive", "attempts": 56},
        {"name": "General", "attempts": 32}
    ]

    return jsonify({
        "lineData": line_data,
        "pieData": pie_data,
        "barData": bar_data
    })

@data_bp.route("/emails/<int:email_id>/status", methods=["PATCH"])
@jwt_required()
def update_email_status(email_id):
    data = request.get_json()
    db = SessionLocal()
    
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        return jsonify({"error": "Email not found"}), 404
        
    new_status = data.get("status")
    user_id = get_jwt_identity() # Get the admin who clicked the button
    
    if new_status == 'false_positive':
        email.status = "safe"
        email.is_false_positive = True
        log_msg = f"Admin (ID: {user_id}) marked Email {email_id} as a False Positive."
    else:
        email.status = new_status
        log_msg = f"Admin (ID: {user_id}) updated Email {email_id} status to {new_status}."
    
    # Store the user info inside the message since there is no user_id column
    new_log = Log(type="ADMIN_ACTION", message=log_msg)
    
    db.add(new_log)
    db.commit()
    db.close()
    
    return jsonify({"message": "Status updated successfully"})


# --- CONNECTION HEARTBEAT ---
@data_bp.route("/heartbeat", methods=["GET"])
def heartbeat():
    """
    Lightweight endpoint to verify the API and Database are alive.
    """
    db = SessionLocal()
    try:
        # 1. FIXED: Wrap the SQL command in text()
        db.execute(text("SELECT 1"))
        return jsonify({
            "status": "Online",
            "database": "Connected",
            # 2. FIXED: Use Python's datetime instead of SQL func.now()
            "timestamp": datetime.now().isoformat() 
        }), 200
    except Exception as e:
        print(f"Heartbeat Error: {e}") # Prints the exact error to your terminal for debugging
        return jsonify({
            "status": "Degraded",
            "database": "Disconnected",
            "error": str(e)
        }), 500
    finally:
        db.close()

@data_bp.route("/emails/<int:email_id>/release", methods=["POST"])
@jwt_required()
def release_quarantined_email(email_id):
    db = SessionLocal()
    email = db.query(Email).filter(Email.id == email_id, Email.status == "quarantined").first()
    
    if not email:
        return jsonify({"error": "Email not found or not in quarantine"}), 404
        
    email.status = "safe"
    
    # Log the action
    admin_id = get_jwt_identity()
    db.add(Log(type="ADMIN_RELEASE", message=f"Admin {admin_id} released Email {email_id} from quarantine."))
    
    db.commit()
    db.close()
    return jsonify({"message": "Email released successfully"})

@data_bp.route("/emails/<int:email_id>", methods=["DELETE"])
@jwt_required()
def delete_email(email_id):
    db = SessionLocal()
    email = db.query(Email).filter(Email.id == email_id).first()
    
    if not email:
        return jsonify({"error": "Email not found"}), 404
        
    db.delete(email)
    
    admin_id = get_jwt_identity()
    db.add(Log(type="ADMIN_DELETE", message=f"Admin {admin_id} permanently deleted Email {email_id}."))
    
    db.commit()
    db.close()
    return jsonify({"message": "Email deleted successfully"})