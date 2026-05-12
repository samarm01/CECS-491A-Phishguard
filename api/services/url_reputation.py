import re
from sqlalchemy import text
from api.db import SessionLocal

SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl"}

def check_urls(content) -> dict:
    db = SessionLocal()

    urls = re.findall(r'(https?://[^\s]+|www\.[^\s]+)', content)

    flagged = []
    reasons = []
    score = 0

    for url in urls:
        domain = re.sub(r'https?://|www\.', '', url).split('/')[0].lower()

        # --- DB reputation lookup (SAFE: optional) ---
        result = db.execute(
            text("SELECT reputation_score FROM url_reputation WHERE domain = :d"),
            {"d": domain}
        ).fetchone()

        if result:
            rep_score = result[0]
            score += rep_score
            reasons.append(f"DB reputation score: {rep_score}")

        # --- heuristics ---
        if domain in SHORTENERS:
            score += 0.2
            flagged.append(url)
            reasons.append("URL shortener used")

        if re.match(r'\d+\.\d+\.\d+\.\d+', domain):
            score += 0.3
            flagged.append(url)
            reasons.append("IP-based URL")

        if not result and domain not in SHORTENERS:
            score += 0.1
            reasons.append("Unknown URL domain")

    db.close()

    return {
        "urls_found": urls,
        "flagged_urls": flagged,
        "score": round(min(score, 1.0), 2),
        "reasons": reasons
    }