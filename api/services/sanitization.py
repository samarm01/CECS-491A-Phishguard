import re

URL_SCHEME = re.compile(r'\bhttps?://', re.IGNORECASE)
WWW_PREFIX = re.compile(r'\bwww\.', re.IGNORECASE)
DOMAIN_DOTS = re.compile(r'(?<=\w)\.(?=\w)')

def defang_text(text: str) -> str:
    if not text:
        return text

    text = URL_SCHEME.sub(lambda m: 'hxxps://' if m.group(0).lower().startswith('https') else 'hxxp://', text)
    text = WWW_PREFIX.sub('www[.]', text)
    text = DOMAIN_DOTS.sub('[.]', text)
    text = text.replace('@', '[@]')
    return text
