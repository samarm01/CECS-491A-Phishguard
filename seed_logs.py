from api.db import SessionLocal
from api.models.models import Log
from datetime import datetime, timedelta
import random

def seed_detection_logs():
    db = SessionLocal()
    
    # Sample data for variety
    log_types = ["ALERT", "SYSTEM", "DETECTION", "ADMIN_FEEDBACK"]
    actions = [
        "High-risk email quarantined", 
        "User login successful", 
        "Model retraining started", 
        "Suspicious attachment defanged",
        "False positive marked by Admin"
    ]
    
    print("Populating dummy logs...")
    
    try:
        for i in range(20):
            # Create a spread of timestamps over the last 7 days
            random_days = random.randint(0, 7)
            random_minutes = random.randint(0, 1440)
            timestamp = datetime.now() - timedelta(days=random_days, minutes=random_minutes)
            
            log_entry = Log(
                type=random.choice(log_types),
                message=f"{random.choice(actions)} - ID: {random.randint(1000, 9999)}",
                created_at=timestamp
            )
            db.add(log_entry)
        
        db.commit()
        print(f"Successfully added {i+1} dummy logs to the database.")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding logs: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_detection_logs()