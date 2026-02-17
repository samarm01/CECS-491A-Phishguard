"""
evaluate.py

Evaluates phishing detection model performance.
"""

from sklearn.metrics import accuracy_score, classification_report


def evaluate_model(model, feature_matrix, labels):
    """
    Evaluate trained model.

    Parameters:
        model: trained sklearn model
        feature_matrix: numeric feature matrix (list of lists)
        labels: true labels

    Returns:
        dict of evaluation results
    """

    predictions = model.predict(feature_matrix)

    accuracy = accuracy_score(labels, predictions)
    report = classification_report(labels, predictions)

    results = {
        "accuracy": accuracy,
        "report": report
    }

    print("\n--- MODEL EVALUATION ---")
    print(f"Accuracy: {accuracy:.4f}")
    print("\nClassification Report:\n")
    print(report)

    return results
