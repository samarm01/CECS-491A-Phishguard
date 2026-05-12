import re
import base64

SUSPICIOUS_PATTERNS = {
    "auto_exec": re.compile(r'\b(AutoOpen|Workbook_Open|Document_Open)\b', re.IGNORECASE),
    "process_exec": re.compile(r'\b(Shell|WScript\.Shell|CreateObject\()\b', re.IGNORECASE),
    "powershell": re.compile(r'\b(powershell|cmd\.exe|bitsadmin|certutil)\b', re.IGNORECASE),
    "downloader": re.compile(r'\b(MSXML2\.XMLHTTP|WinHttp\.WinHttpRequest|ADODB\.Stream)\b', re.IGNORECASE),
    "base64": re.compile(r'\b(FromBase64String|base64)\b', re.IGNORECASE),
}


def scan_macro_text(text: str) -> dict:
    score = 0
    findings = []

    keywords = [
        "AutoOpen",
        "Shell",
        "CreateObject",
        "powershell",
        "cmd.exe",
        "WScript",
        "DownloadFile"
    ]

    # Keyword detection
    for word in keywords:
        if word.lower() in text.lower():
            findings.append(word)
            score += 0.2

    # Regex pattern detection (your SUSPICIOUS_PATTERNS)
    for name, pattern in SUSPICIOUS_PATTERNS.items():
        if pattern.search(text):
            findings.append(name)
            score += 0.2

    # Detect base64 encoded payloads
    base64_pattern = r'[A-Za-z0-9+/=]{20,}'
    if re.search(base64_pattern, text):
        findings.append("Possible Base64 payload")
        score += 0.3

    # Detect suspicious execution chains
    if "powershell" in text.lower() and "download" in text.lower():
        findings.append("Download + execute pattern")
        score += 0.4

    # Long encoded blob
    if len(text) > 500 and re.search(r'[A-Za-z0-9+/=]{100,}', text):
        findings.append("possible_base64_blob")
        score += 0.3

    return {
        "score": round(min(score, 1.0), 2),
        "findings": findings
    }