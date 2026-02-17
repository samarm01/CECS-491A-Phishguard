"""
train.py

Trains phishing detection model and evaluates performance.
"""

from pipeline import prepare_dataset
from sklearn.linear_model import LogisticRegression
from evaluate import evaluate_model


if __name__ == "__main__":
    print("Starting training...")

    # Example dataset
    emails = [
        {"headers": {"From": "scammer@bad.ru", "Content-Type": "text/html"},
         "body": "Click here to reset your password http://badlink.com"},
        {"headers": {"From": "admin@company.com", "Content-Type": "text/plain"},
         "body": "Team meeting tomorrow at 10am"}
    ]

    labels = [1, 0]  # 1 = phishing, 0 = legitimate

    # Prepare dataset
    X = prepare_dataset(emails)

    # Convert dicts → numeric matrix
    feature_names = list(X[0].keys())
    X_matrix = [[email[feature] for feature in feature_names] for email in X]

    # Train model
    model = LogisticRegression()
    model.fit(X_matrix, labels)

    print("Training complete.")

    # Evaluate model
    evaluate_model(model, X_matrix, labels)
