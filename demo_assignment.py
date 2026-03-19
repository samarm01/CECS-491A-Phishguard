# demo_assignment.py
from sqlalchemy import func
from api.db import SessionLocal
from api.models.models import User, Email, Notification, init_db
from api.services.tagging import sanitize_and_tag

def run_demo():
    # 1. Initialize the Database
    init_db()

    # 2. Start a session
    db = SessionLocal()

    print("\n--- DEMO START: Saving Data ---")

    # 3. Create a Dummy User
    existing_user = db.query(User).filter_by(email="prof_demo@csulb.edu").first()

    if not existing_user:
        new_user = User(
            email="prof_demo@csulb.edu",
            password_hash="hashed_secret_123",
            role="admin"
        )
        db.add(new_user)
        db.commit()
        print(f"[SUCCESS] Saved User: {new_user.email}")
    else:
        print(f"[INFO] User already exists: {existing_user.email}")

    # 4. Content Sanitization + Tagging (#13)
    sample_body = (
        "Reset your password here: https://bad-domain.com/reset?token=123\n"
        "Contact: scammer@bad-domain.com\n"
        "Backup link: www.evil.com/login"
    )

    sanitized, tags = sanitize_and_tag(sample_body)

    print("\n--- USE CASE #13: Sanitization + Tagging ---")
    print("[RAW BODY]\n", sample_body)
    print("[SANITIZED BODY]\n", sanitized)
    print("[TAGS]", tags)

    # 5. Create a Dummy Email Scan (SAVE) with HIGH risk_score (Use Case #12)
    # Let the DB trigger auto-quarantine it based on risk_score.
    new_email = Email(
        sender="scammer@bad-domain.com",
        subject="Urgent: Update your password",
        risk_score=0.95,          # triggers auto-quarantine
        status="pending",         # trigger should flip this to quarantined
        body_raw=sample_body,
        body_sanitized=sanitized,
        warning_tags=tags
    )

    db.add(new_email)
    db.commit()
    db.refresh(new_email)

    print("\n--- USE CASE #12: Auto-Response Engine (DB Trigger) ---")
    print(f"[SAVED] Email Subject: {new_email.subject}")
    print(f"[AUTO STATUS] Email Status After Insert: {new_email.status}")

    # 6. Show that a notification was queued by DB trigger (Use Case #12)
    notif_count = db.query(Notification).count()
    latest_notif = db.query(Notification).order_by(Notification.id.desc()).first()

    print("\n--- USE CASE #12.4: Notifications Queue ---")
    print(f"[RETRIEVED] Total Notifications Queued: {notif_count}")
    if latest_notif:
        print(f"[LATEST] type={latest_notif.type} email_id={latest_notif.email_id}")
        print(f"[PAYLOAD] {latest_notif.payload}")

    # 7. Query the Data back
    print("\n--- DEMO START: Retrieving Data ---")
    user_retrieved = db.query(User).filter_by(email="prof_demo@csulb.edu").first()
    email_count = db.query(Email).count()

    print(f"[RETRIEVED] User Role: {user_retrieved.role}")
    print(f"[RETRIEVED] Total Emails Scanned: {email_count}")

    db.close()
    print("\n--- DEMO COMPLETE ---")

if __name__ == "__main__":
    run_demo()
