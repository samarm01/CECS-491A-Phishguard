import re

SUSPICIOUS_PATTERNS = {
    "auto_exec": re.compile(r'\b(AutoOpen|Workbook_Open|Document_Open)\b', re.IGNORECASE),
    "process_exec": re.compile(r'\b(Shell|WScript\.Shell|CreateObject\()\b', re.IGNORECASE),
    "powershell": re.compile(r'\b(powershell|cmd\.exe|bitsadmin|certutil)\b', re.IGNORECASE),
    "downloader": re.compile(r'\b(MSXML2\.XMLHTTP|WinHttp\.WinHttpRequest|ADODB\.Stream)\b', re.IGNORECASE),
    "base64": re.compile(r'\b(FromBase64String|base64)\b', re.IGNORECASE),
}

def scan_macro_text(text: str):
    if not text:
        return 0.0, []

    hits = [tag for tag, rx in SUSPICIOUS_PATTERNS.items() if rx.search(text)]
    score = min(1.0, 0.2 * len(hits))
    return score, hits
