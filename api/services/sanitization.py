import re

URL_SCHEME = re.compile(r'\bhttps?://', re.IGNORECASE)
WWW_PREFIX = re.compile(r'\bwww\.', re.IGNORECASE)
DOMAIN_DOTS = re.compile(r'(?<=\w)\.(?=\w)')

def normalize_text(text: str) -> str:
    # Normalize common obfuscations attackers use
    text = text.replace("hxxp", "http")
    text = text.replace("http[:]//", "http://")
    text = text.replace("[.]", ".")
    return text


def defang_text(text: str) -> str:
    text = normalize_text(text)

    # Remove script tags (basic HTML sanitization)
    text = re.sub(r'<script.*?>.*?</script>', '', text, flags=re.IGNORECASE)

    # Defang URLs
    text = re.sub(r'https?://', lambda m: m.group(0).replace('http', 'hxxp'), text)

    # Defang domains
    text = re.sub(r'\.', '[.]', text)

    # Defang emails
    text = re.sub(r'@', '[@]', text)

    return text

def remove_scripts(text: str) -> str:
    return re.sub(r'<script.*?>.*?</script>', '', text, flags=re.IGNORECASE)


def sanitize_email(text: str):
    clean = remove_scripts(text)
    defanged = defang_text(clean)

    return defanged

    