from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from api.db import SessionLocal
from api.models import Email, Log, User
from sqlalchemy import func, cast, Date

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
    # Fetch only quarantined emails
    emails = db.query(Email).filter(Email.status == "quarantined").all()
    
    # Task 10.2: Map technical scores to descriptive strings and include the body
    return jsonify([{
        "id": e.id,
        "sender": e.sender,
        "subject": e.subject,
        "date": e.received_at.strftime("%Y-%m-%d"),
        "reason": "High Risk Score" if e.risk_score > 0.8 else "Suspicious Pattern",
        "status": e.status,
        "analysis": {
            "confidence": round(e.risk_score * 100, 1),
            "details": f"Flagged with {round(e.risk_score * 100, 1)}% confidence due to suspicious content structure and risk indicators.",
            "preview": e.body # <--- This sends the real body text to the UI
        }
    } for e in emails])
    
# --- 3. LOGS LIST ---
@data_bp.route("/logs", methods=["GET"])
@jwt_required()
def get_logs():
    db = SessionLocal()
    logs = db.query(Log).order_by(Log.created_at.desc()).limit(50).all()
    
    return jsonify([{
        "id": l.id,
        "timestamp": l.created_at.strftime("%Y-%m-%d %H:%M"),
        "type": l.type,
        "details": l.message,
        "user": "System" # Simplify for now
    } for l in logs])

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

    bar_data = [{"name": d if d else "Unknown", "attempts": c} for d, c in dept_counts]

    return jsonify({
        "lineData": line_data,
        "pieData": pie_data,
        "barData": bar_data
    })

@data_bp.route("/emails/<int:email_id>/feedback", methods=["POST"])
@jwt_required()
def submit_feedback(email_id):
    data = request.get_json()
    db = SessionLocal()
    
    email = db.query(Email).filter(Email.id == email_id).first()
    if not email:
        return jsonify({"error": "Email not found"}), 404
        
    # Task 11.2: Update status and mark for retraining
    is_false_positive = data.get("is_false_positive", False)
    email.status = "safe" if is_false_positive else "deleted"
    email.is_false_positive = is_false_positive
    
    # Create an audit log for the action
    new_log = Log(
        type="ADMIN_FEEDBACK",
        message=f"Email {email_id} marked as {'False Positive' if is_false_positive else 'Confirmed Threat'}.",
        user_id=get_jwt_identity()
    )
    
    db.add(new_log)
    db.commit()
    return jsonify({"message": "Feedback recorded successfully"})