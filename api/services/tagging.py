import re
from .sanitization import defang_text

HAS_URL = re.compile(r'\bhttps?://|\bwww\.', re.IGNORECASE)
HAS_IP = re.compile(r'\b\d{1,3}(\.\d{1,3}){3}\b')
HAS_SHORTENER = re.compile(r'\b(bit\.ly|tinyurl\.com|t\.co)\b', re.IGNORECASE)

def sanitize_and_tag(body: str):
    tags = []
    if not body:
        return body, tags

    if HAS_URL.search(body):
        tags.append("contains_url")
    if HAS_IP.search(body):
        tags.append("contains_ip")
    if HAS_SHORTENER.search(body):
        tags.append("contains_link_shortener")

    sanitized = defang_text(body)
    if sanitized != body:
        tags.append("defanged")

    return sanitized, tags
