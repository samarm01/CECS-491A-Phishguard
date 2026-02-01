import re
import string

def clean_text(text: str) -> str:
    """
    Cleans and normalizes email body text.
    """
    text = text.lower()
    text = re.sub(r"http\S+", "", text)   # remove URLs
    text = re.sub(r"\d+", "", text)        # remove numbers
    text = text.translate(str.maketrans("", "", string.punctuation))
    text = re.sub(r"\s+", " ", text).strip()
    return text

def tokenize(text: str):
    """
    Splits cleaned text into tokens.
    """
    return text.split()
git add ml/features.py ml/preprocessing.py
