from sqlalchemy import text
from api.db import SessionLocal

def mark_false_positive(email_id: int):
    db = SessionLocal()

    db.execute(
        text("UPDATE emails SET is_false_positive = TRUE WHERE id = :id"),
        {"id": email_id}
    )

    db.commit()
    db.close()

    return {"status": "marked_false_positive"}


def adjust_reputation(domain: str, delta: float):
    db = SessionLocal()

    db.execute(
        text("""
        UPDATE sender_reputation
        SET reputation_score = GREATEST(0, reputation_score - :delta)
        WHERE domain = :domain
        """),
        {"delta": delta, "domain": domain}
    )

    db.commit()
    db.close()

    return {"status": "reputation_adjusted"}