# demo_assignment.py
from sqlalchemy import func
from api.db import SessionLocal
from api.models.models import User, Email, Notification, init_db
from api.services.tagging import sanitize_and_tag
from api.services.sender_reputation import analyze_sender
from api.services.url_reputation import check_urls
from api.services.macro_scan import scan_macro_text


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

    print("\n==============================")
    print(" USE CASE #13: CONTENT SANITIZATION")
    print("==============================")

    print("\n[RAW EMAIL]")
    print(sample_body)

    print("\n[SANITIZED EMAIL]")
    print(sanitized)

    print("\n[WARNING TAGS]")
    for tag in tags:
        print(f"- {tag}")
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
    print("\n[AUTO RESPONSE RESULT]")
    print(f"→ Final Status: {new_email.status.upper()}")

    # 6. Show that a notification was queued by DB trigger (Use Case #12)
    notif_count = db.query(Notification).count()
    latest_notif = db.query(Notification).order_by(Notification.id.desc()).first()

    print("\n==============================")
    print(" USE CASE #12.4: NOTIFICATIONS")
    print("==============================")

    print(f"\nTotal Notifications: {notif_count}")

    if latest_notif:
        print("\n[Latest Notification]")
        print(f"- Type: {latest_notif.type}")
        print(f"- Email ID: {latest_notif.email_id}")
        print(f"- Payload: {latest_notif.payload}")

    # 7. Query the Data back
    print("\n--- DEMO START: Retrieving Data ---")
    user_retrieved = db.query(User).filter_by(email="prof_demo@csulb.edu").first()
    email_count = db.query(Email).count()

    print(f"[RETRIEVED] User Role: {user_retrieved.role}")
    print(f"[RETRIEVED] Total Emails Scanned: {email_count}")

    db.close()
    print("\n--- DEMO COMPLETE ---")

def run_full_analysis():
    print("\n--- FULL THREAT ANALYSIS DEMO ---")

    sample_body = """
    Urgent: Verify your account at https://bad-domain.com/login
    Backup link: http://192.168.1.1/reset
    Contact: support@micros0ft-login.xyz
    """

    sender = "alert@micros0ft-login.xyz"

    # 1. Sanitization + Tagging
    sanitized, tags = sanitize_and_tag(sample_body)

    # 2. URL Analysis
    url_result = check_urls(sample_body)

    # 3. Sender Analysis
    sender_result = analyze_sender(sender)


    macro_result = scan_macro_text("AutoOpen powershell download base64")


    total_score = (
        url_result["score"] +
        sender_result["score"] +
        macro_result["score"]
    )

    print("\n[RAW EMAIL BODY]\n", sample_body)
    print("\n[SANITIZED BODY]\n", sanitized)
    print("\n[TAGS]\n", tags)

    print("\n==============================")
    print(" THREAT ANALYSIS BREAKDOWN")
    print("==============================")

    print("\n[URL ANALYSIS]")
    print(f"- URLs Found: {url_result['urls_found']}")
    print(f"- Flagged: {url_result['flagged_urls']}")
    print(f"- Score: {url_result['score']}")

    print("\n[SENDER ANALYSIS]")
    print(f"- Score: {sender_result['score']}")
    print(f"- Reasons:")
    for r in sender_result["reasons"]:
        print(f"  • {r}")

    print("\n[MACRO ANALYSIS]")
    print(f"- Score: {macro_result['score']}")
    print(f"- Findings:")
    for f in macro_result["findings"]:
        print(f"  • {f}")

    print(f"\n[FINAL RISK SCORE] {round(total_score, 2)}")

    print("\n==============================")
    print(" FINAL DECISION ENGINE")
    print("==============================")

    print(f"Total Risk Score: {round(total_score, 2)}")

    if total_score >= 0.8:
        print("→ ACTION: QUARANTINE")
    elif total_score >= 0.4:
        print("→ ACTION: FLAG FOR REVIEW")
    else:
        print("→ ACTION: SAFE")


def run_security_pipeline():
    print("\n==============================")
    print(" FULL SECURITY PIPELINE DEMO ")
    print("==============================")

    sample_body = """
    Urgent: Verify your account at https://bad-domain.com/login
    Backup link: http://192.168.1.1/reset
    Contact: support@micros0ft-login.xyz
    """

    sender = "alert@micros0ft-login.xyz"

    print("\n[STEP 1: RAW EMAIL]")
    print(sample_body)

    # 1. Sanitization
    sanitized, tags = sanitize_and_tag(sample_body)

    print("\n[STEP 2: SANITIZATION]")
    print(sanitized)
    print("Tags:", tags)

    # 2. URL Reputation
    url_result = check_urls(sample_body)
    print("\n[STEP 3: URL REPUTATION]")
    print(url_result)

    # 3. Sender Reputation
    sender_result = analyze_sender(sender)
    print("\n[STEP 4: SENDER REPUTATION]")
    print(sender_result)

    # 4. Attachment / Macro Scan
    macro_result = scan_macro_text("AutoOpen powershell download base64")
    print("\n[STEP 5: ATTACHMENT SCAN]")
    print(macro_result)

    # 5. NLP (simple placeholder)
    nlp_score = 0.4  # simulate model output
    print("\n[STEP 6: NLP DETECTION]")
    print({"score": nlp_score})

    # FINAL SCORE
    total_score = (
        url_result["score"] +
        sender_result["score"] +
        macro_result["score"] +
        nlp_score
    )

    total_score = min(total_score, 1.0)

    print("\n[FINAL RISK SCORE]", round(total_score, 2))

    if total_score > 0.8:
        print("[ACTION] QUARANTINE EMAIL")
    else:
        print("[ACTION] MARK AS SAFE")






if __name__ == "__main__":
    run_security_pipeline()
