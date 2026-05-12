# predict.py

import joblib
import numpy as np
from pipeline import prepare_dataset


# 🔥 BLOCKLIST / ALLOWLIST
BLOCKLIST = [
    "bad.ru",
    "phish.com",
    "malicious-site.net"
]

ALLOWLIST = [
    "company.com",
    "google.com"
]


# 🔥 USER RISK TRACKING
USER_RISK_HISTORY = {}


def load_model():
    return joblib.load("model.pkl")


# 🔥 EXTRACT DOMAIN
def extract_domain(sender):

    if "@" in sender:
        return sender.split("@")[-1].lower()

    return "unknown"


# 🔥 USER RISK PROFILING
def update_user_risk(user_id, prediction):

    if user_id not in USER_RISK_HISTORY:
        USER_RISK_HISTORY[user_id] = 0

    if prediction == 1:
        USER_RISK_HISTORY[user_id] += 1

    return USER_RISK_HISTORY[user_id]


# 🔥 RISK SCORING
def calculate_risk_level(confidence, reasons_count):

    risk_score = confidence * 100

    if reasons_count >= 3:
        risk_score += 10

    if risk_score >= 85:
        return "HIGH"

    elif risk_score >= 60:
        return "MEDIUM"

    return "LOW"


# 🔥 AUTO RESPONSE ENGINE
def generate_response(prediction, risk_level):

    if prediction == 1:

        if risk_level == "HIGH":
            return "Email quarantined and security team notified"

        elif risk_level == "MEDIUM":
            return "Warning issued to user"

        else:
            return "Suspicious email flagged"

    return "Email marked safe"


def predict_email(email, user_id="default_user"):

    model, vectorizer, feature_names = load_model()

    sender = email["headers"].get("From", "unknown")
    domain = extract_domain(sender)

    # 🔥 BLOCKLIST CHECK
    if domain in BLOCKLIST:

        user_risk = update_user_risk(user_id, 1)

        return (
            1,
            1.0,
            ["Sender is on blocklist"],
            "HIGH",
            "Email blocked automatically",
            user_risk
        )

    # 🔥 ALLOWLIST CHECK
    if domain in ALLOWLIST:

        user_risk = update_user_risk(user_id, 0)

        return (
            0,
            1.0,
            ["Trusted sender"],
            "LOW",
            "Email allowed",
            user_risk
        )

    text = email["body"]

    # TEXT FEATURE
    X_text = vectorizer.transform([text]).toarray()

    # STRUCTURED FEATURE
    X_struct = prepare_dataset([email])
    X_struct_matrix = [[X_struct[0][f] for f in feature_names]]

    # COMBINE
    X_final = np.hstack((X_text, X_struct_matrix))

    prediction = model.predict(X_final)
    proba = model.predict_proba(X_final)
    confidence = float(max(proba[0]))

    reasons = []

    if prediction[0] == 1:

        if X_struct[0]["num_links"] > 2:
            reasons.append("Contains multiple links")

        if X_struct[0]["suspicious_sender"] == 1:
            reasons.append("Suspicious sender domain")

        if X_struct[0]["is_html"] == 1:
            reasons.append("HTML email format")

        if X_struct[0]["body_length"] > 500:
            reasons.append("Unusually long email content")

    if not reasons:
        reasons.append("No strong phishing indicators")

    # 🔥 USER RISK UPDATE
    user_risk = update_user_risk(user_id, prediction[0])

    # 🔥 RISK LEVEL
    risk_level = calculate_risk_level(confidence, len(reasons))

    # 🔥 AUTO RESPONSE
    action = generate_response(prediction[0], risk_level)

    return (
        prediction[0],
        confidence,
        reasons,
        risk_level,
        action,
        user_risk
    )


if __name__ == "__main__":

    test_email = {
        "headers": {
            "From": "scammer@bad.ru",
            "Content-Type": "text/html"
        },
        "body": "URGENT! Click here now http://phish.com"
    }

    result = predict_email(test_email)

    print(result)