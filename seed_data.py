# seed_data.py
from api.db import SessionLocal
from api.models.models import Email
from datetime import datetime, timedelta
import random

db = SessionLocal()

# Samples for testing logic mapping (Task 10.2)
phishing_samples = [
    {
        "subject": "Urgent: Unusual sign-in activity",
        "body": "We detected a sign-in from a new device in Moscow, Russia. If this was not you, please click here to secure your account immediately: http://secure-login-check.xyz/verify",
        "score": 0.98
    },
    {
        "subject": "Invoice #88291 is Overdue",
        "body": "Your payment for invoice #88291 is 3 days past due. Please download the attached PDF to review the charges and avoid service interruption.",
        "score": 0.85
    }
]

safe_samples = [
    {
        "subject": "Weekly Team Sync",
        "body": "Hi team, just a reminder that our sync is moving to 2 PM today. See you then!",
        "score": 0.02
    }
]

# Generate 10 random emails
for i in range(10):
    is_phish = random.random() > 0.4
    sample = random.choice(phishing_samples if is_phish else safe_samples)
    
    new_email = Email(
        sender="attacker@phish.net" if is_phish else "boss@company.com",
        subject=sample["subject"],
        body=sample["body"],
        risk_score=sample["score"],
        status="quarantined" if is_phish else "safe",
        received_at=datetime.utcnow() - timedelta(days=random.randint(0, 5))
    )
    db.add(new_email)

db.commit()
print("Database seeded with body text for modal testing!")