import re
import string


def clean_text(text: str) -> str:
    """
    Cleans and normalizes email body text.
    Designed specifically for phishing detection preprocessing.
    """

    if not text:
        return ""

    # Convert to lowercase
    text = text.lower()

    # Replace URLs with special token instead of removing them
    text = re.sub(r"http\S+|www\S+", " URL ", text)

    # Remove numbers
    text = re.sub(r"\d+", "", text)

    # Remove punctuation
    text = text.translate(str.maketrans("", "", string.punctuation))

    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()

    return text


def tokenize(text: str):
    """
    Splits cleaned text into tokens.
    """

    return text.split()
