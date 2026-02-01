def extract_features(email_headers: dict, email_body: str) -> dict:
    """
    Extracts metadata features from email headers and body.
    """
    features = {
        "has_attachments": int("attachment" in email_headers.get("Content-Type", "").lower()),
        "is_html": int("html" in email_headers.get("Content-Type", "").lower()),
        "body_length": len(email_body),
        "num_links": email_body.count("http"),
        "suspicious_sender": int(
            email_headers.get("From", "").endswith((".ru", ".cn", ".tk"))
        ),
    }
    return features
