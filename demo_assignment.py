# demo_assignment.py
from db import SessionLocal
from models import User, Email, init_db

def run_demo():
    # 1. Initialize the Database (Create tables if they don't exist)
    init_db()
    
    # 2. Start a session
    db = SessionLocal()
    
    print("\n--- DEMO START: Saving Data ---")
    
    # 3. Create a Dummy User (SAVE)
    # Using 'test_user' to avoid unique constraint errors on re-runs
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

    # 4. Create a Dummy Email Scan (SAVE)
    new_email = Email(
        sender="scammer@bad-domain.com",
        subject="Urgent: Update your password",
        risk_score=0.95,
        status="quarantined"
    )
    db.add(new_email)
    db.commit()
    print(f"[SUCCESS] Saved Email Log: {new_email.subject}")

    print("\n--- DEMO START: Retrieving Data ---")

    # 5. Query the Data back (RETRIEVE)
    user_retrieved = db.query(User).filter_by(email="prof_demo@csulb.edu").first()
    email_count = db.query(Email).count()
    
    print(f"[RETRIEVED] User Role: {user_retrieved.role}")
    print(f"[RETRIEVED] Total Emails Scanned: {email_count}")
    
    db.close()
    print("\n--- DEMO COMPLETE ---")

if __name__ == "__main__":
    run_demo()