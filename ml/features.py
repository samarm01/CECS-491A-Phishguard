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

FEATURE_EXPLANATIONS = {
    "has_attachments": "Contains potentially risky file attachments.",
    "is_html": "Uses HTML formatting, which can hide malicious code or tracking pixels.",
    "num_links": "Contains an unusually high number of embedded links.",
    "suspicious_sender": "Sent from a high-risk or commonly abused top-level domain (.ru, .cn, .tk, etc.).",
    "body_length": "Abnormal message length often associated with automated spam."
}

def get_human_readable_reasons(feature_dict):
    """
    Takes a dictionary of extracted features and returns a list of human-readable warnings
    for any feature that triggered a '1' or a high count.
    """
    reasons = []

    if not feature_dict or not isinstance(feature_dict, dict):
        return ["Suspicious structural patterns detected by the model."]
    
    if feature_dict.get("suspicious_sender") == 1:
        reasons.append(FEATURE_EXPLANATIONS["suspicious_sender"])
        
    if feature_dict.get("has_attachments") == 1:
        reasons.append(FEATURE_EXPLANATIONS["has_attachments"])
        
    if feature_dict.get("num_links", 0) > 3: # Example threshold: flag if more than 3 links
        reasons.append(FEATURE_EXPLANATIONS["num_links"])
        
    if not reasons:
        reasons.append("Suspicious structural patterns detected by the model.")
        
    return reasons
