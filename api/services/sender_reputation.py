from sqlalchemy import text
from api.db import SessionLocal

FREE_EMAIL_DOMAINS = {"gmail.com", "yahoo.com", "outlook.com"}

def analyze_sender(sender: str) -> dict:
    db = SessionLocal()

    domain = sender.split("@")[-1].lower()

    record = db.execute(
        text("""
            SELECT reputation_score, is_blacklisted, is_whitelisted
            FROM sender_reputation
            WHERE domain = :domain
        """),
        {"domain": domain}
    ).fetchone()

    score = 0
    reasons = []

    if record:
        rep_score, blacklisted, whitelisted = record

        if blacklisted:
            score += 0.8
            reasons.append("Blacklisted domain")

        if whitelisted:
            score -= 0.3
            reasons.append("Trusted domain")

    # heuristic checks
    if domain in FREE_EMAIL_DOMAINS:
        score += 0.2
        reasons.append("Free email provider")

    if any(char.isdigit() for char in domain):
        score += 0.2
        reasons.append("Suspicious domain pattern")

    if "micros0ft" in domain or "googIe" in domain:
        score += 0.4
        reasons.append("Lookalike domain")

    db.close()

    return {
        "domain": domain,
        "score": round(min(max(score, 0), 1), 2),
        "reasons": reasons
    }