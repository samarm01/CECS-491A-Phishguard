from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# VERY small demo dataset (expand later)
emails = [
    "Reset your password now",
    "Verify your account urgently",
    "Meeting scheduled tomorrow",
    "Lunch plans?"
]

labels = [1, 1, 0, 0]  # 1 = phishing, 0 = safe

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(emails)

model = LogisticRegression()
model.fit(X, labels)


def predict_email(text: str):
    vec = vectorizer.transform([text])
    prob = model.predict_proba(vec)[0][1]

    return {
        "phishing_probability": round(prob, 2),
        "is_phishing": prob > 0.6
    }