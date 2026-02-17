"""
features.py

Feature engineering module for PhishGuard.
Extracts structured metadata features from email headers and body text
to be used by the machine learning model.
"""

def extract_features(email_headers: dict, email_body: str) -> dict:
    """
    Extract metadata-based features from an email.

    Parameters:
        email_headers (dict): Dictionary of email header fields.
        email_body (str): Cleaned email body text.

    Returns:
        dict: Numerical feature dictionary.
    """

    # Normalize header values safely
    content_type = email_headers.get("Content-Type", "").lower()
    sender = email_headers.get("From", "").lower()

    features = {
        # Attachment detection
        "has_attachments": int("attachment" in content_type),

        # HTML content detection
        "is_html": int("html" in content_type),

        # Body length feature
        "body_length": len(email_body),

        # Number of links
        "num_links": email_body.count("http"),

        # Suspicious sender domain check
        "suspicious_sender": int(
            sender.endswith((".ru", ".cn", ".tk", ".xyz", ".top"))
        ),
    }

    return features
