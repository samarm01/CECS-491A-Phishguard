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
    
    # 1. Counts
    total_emails = db.query(Email).count()
    threats = db.query(Email).filter(Email.risk_score > 0.7).count()
    quarantined = db.query(Email).filter(Email.status == "quarantined").count()
    
    # 2. Chart Data (Keep dummy or calculate real if you have enough data)
    chart_data = [
        {"name": "Jun 01", "attempts": 4},
        {"name": "Jun 02", "attempts": 7},
        {"name": "Jun 03", "attempts": 2}
    ]

    # 3. RECENT QUARANTINE (Fetch top 3)
    recent_quarantine_raw = db.query(Email).filter(Email.status == "quarantined").order_by(Email.received_at.desc()).limit(3).all()
    recent_quarantine = [{
        "title": e.sender.split('@')[0], # Use sender name as title
        "subtitle": e.subject[:30] + "...",
        "badge": "High Risk" if e.risk_score > 0.9 else "Suspicious"
    } for e in recent_quarantine_raw]

    # 4. RECENT LOGS (Fetch top 3)
    recent_logs_raw = db.query(Log).order_by(Log.created_at.desc()).limit(3).all()
    recent_logs = [{
        "time": l.created_at.strftime("%I:%M %p"),
        "action": l.type,
        "target": l.message[:40] + "...", # Truncate message
        "type": "danger" if "FLAGGED" in l.type else "info"
    } for l in recent_logs_raw]

    return jsonify({
        "scanned": total_emails,
        "threats": threats,
        "quarantined": quarantined,
        "status": "Online",
        "chart": chart_data,
        "recent_quarantine": recent_quarantine, # <--- Sending this to UI
        "recent_logs": recent_logs              # <--- Sending this to UI
    })

# --- 2. QUARANTINE LIST ---
@data_bp.route("/emails", methods=["GET"])
@jwt_required()
def get_emails():
    db = SessionLocal()
    # Fetch only quarantined or high-risk emails
    emails = db.query(Email).filter(Email.status == "quarantined").all()
    
    return jsonify([{
        "id": e.id,
        "sender": e.sender,
        "subject": e.subject,
        "date": e.received_at.strftime("%Y-%m-%d"),
        "reason": "High Risk Score" if e.risk_score > 0.8 else "Suspicious Pattern",
        "status": e.status
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

    # A. LINE CHART: Count emails per day (Real DB Data)
    # This queries the database to count how many emails were received each day
    daily_counts = db.query(
        func.date(Email.received_at).label('date'),
        func.count(Email.id).label('count')
    ).group_by(func.date(Email.received_at)).all()

    line_data = [
        {"name": str(day.date), "attempts": day.count} 
        for day in daily_counts
    ]
    # If DB is empty, provide at least one empty point to prevent chart crash
    if not line_data:
        line_data = [{"name": "No Data", "attempts": 0}]

    # B. PIE CHART: Threat Status Distribution (Real DB Data)
    # Counts how many are "quarantined", "safe", or "pending"
    status_counts = db.query(
        Email.status, 
        func.count(Email.id)
    ).group_by(Email.status).all()

    # Map database statuses to colors
    color_map = {
        "quarantined": "#ef4444", # Red
        "safe": "#22c55e",        # Green
        "pending": "#f59e0b"      # Orange
    }

    pie_data = [
        {
            "name": status.capitalize(), 
            "value": count, 
            "color": color_map.get(status, "#94a3b8")
        } 
        for status, count in status_counts
    ]

    # C. BAR CHART: Departments (Mock Data from API)
    # Since we don't have 'Department' in the DB yet, we send this from the backend
    # so the frontend is ready for it later.
    bar_data = [
        { "name": 'Sales', "Plant1": 15, "Plant2": 78, "Plant3": 45 },
        { "name": 'HR', "Plant1": 22, "Plant2": 56, "Plant3": 32 },
        { "name": 'IT', "Plant1": 56, "Plant2": 32, "Plant3": 55 },
    ]

    return jsonify({
        "lineData": line_data,
        "pieData": pie_data,
        "barData": bar_data
    })