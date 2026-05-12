# seed_data.py
from api.db import SessionLocal
from api.models.models import Email
from datetime import datetime, timedelta
import random

db = SessionLocal()

# Samples that perfectly match the existing ml/features.py logic
phishing_samples = [
    {
        "subject": "Urgent: Unusual sign-in activity",
        "body": "We detected a sign-in from a new device in Moscow, Russia. If this was not you, please click here to secure your account immediately: http://secure-login-check.xyz/verify",
        "score": 0.98,
        "features": {
            "suspicious_sender": 1,  # Triggers the sender warning
            "has_attachments": 0,
            "num_links": 5           # Triggers the num_links > 3 warning
        }
    },
    {
        "subject": "Invoice #88291 is Overdue",
        "body": "Your payment for invoice #88291 is 3 days past due. Please download the attached PDF to review the charges and avoid service interruption.",
        "score": 0.85,
        "features": {
            "suspicious_sender": 0,
            "has_attachments": 1,    # Triggers the attachment warning
            "num_links": 1
        }
    }
]

safe_samples = [
    {
        "subject": "Weekly Team Sync",
        "body": "Hi team, just a reminder that our sync is moving to 2 PM today. See you then!",
        "score": 0.02,
        "features": {
            "suspicious_sender": 0,
            "has_attachments": 0,
            "num_links": 0
        }
    }
]

# Optional: Clear existing emails to see a fresh batch
db.query(Email).delete()

# Generate 20 random emails
for i in range(20):
    is_phish = random.random() > 0.4
    sample = random.choice(phishing_samples if is_phish else safe_samples)
    
    new_email = Email(
        sender="attacker@phish.net" if is_phish else "boss@company.com",
        subject=sample["subject"],
        body=sample["body"],
        risk_score=sample["score"],
        status="quarantined" if is_phish else "safe",
        # Pass the correctly mapped features to the database
        features_dict=sample["features"], 
        received_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
    )
    db.add(new_email)

db.commit()
print("Database seeded with ML features compatible with the existing pipeline!")