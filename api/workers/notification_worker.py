import json
import time
from sqlalchemy import func
from api.db import SessionLocal
from models import Notification

POLL_SECONDS = 2

def deliver(n: Notification):
    print("\n[ALERT]", n.type)
    print("email_id:", n.email_id)
    print("payload:", json.dumps(n.payload, indent=2))

def run():
    while True:
        db = SessionLocal()
        try:
            pending = (
                db.query(Notification)
                .filter(Notification.delivered_at.is_(None))
                .order_by(Notification.created_at.asc())
                .limit(25)
                .all()
            )

            for n in pending:
                deliver(n)
                n.delivered_at = func.now()
                db.add(n)

            db.commit()
        finally:
            db.close()

        time.sleep(POLL_SECONDS)

if __name__ == "__main__":
    run()
