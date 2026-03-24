"""
train.py

Trains phishing detection model and evaluates performance.
"""
import joblib
import pandas as pd
from sklearn.linear_model import LogisticRegression

# Import your feature extraction from the pipeline you already built
from ml.pipeline import prepare_dataset, extract_features 
from ml.evaluate import evaluate_model

# Define a strict feature order so training and retraining always align perfectly
# (Update these strings to match the exact keys returned by extract_features)
FEATURE_COLUMNS = [
    "url_count", "urgency_score", "sender_history", 
    "suspicious_domains", "attachment_risk" 
]

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

    # Convert dicts → numeric matrix using STRICT feature ordering
    X_matrix = [[email.get(feature, 0) for feature in FEATURE_COLUMNS] for email in X]

    # Train model
    model = LogisticRegression(max_iter=1000)
    model.fit(X_matrix, labels)
    
    # Save the initial baseline model! 
    joblib.dump(model, 'ml/saved_models/phish_model.pkl')
    print("Training complete and model saved.")

    # Evaluate model
    evaluate_model(model, X_matrix, labels)


def retrain_model(feedback_data):
    """
    Takes a list of corrected emails from the database, combines them with 
    the base dataset, and retrains the model.
    """
    try:
        # 1. Load historical data (Update this path to where your actual training data lives)
        try:
            historical_data = pd.read_csv('ml/data/historical_training_data.csv')
            X_train = historical_data[FEATURE_COLUMNS].values.tolist()
            y_train = historical_data['label'].tolist()
        except FileNotFoundError:
            # Fallback if no CSV exists yet
            X_train = []
            y_train = []
        
        # 2. Process the new feedback data
        for email in feedback_data:
            features_dict = extract_features(email.headers, email.body)
            
            # Use strict feature ordering to prevent misalignment
            feature_vector = [features_dict.get(feature, 0) for feature in FEATURE_COLUMNS]
            X_train.append(feature_vector)
            
            # Determine label
            label = 0 if email.status == 'false_positive' else 1
            y_train.append(label)

        # 3. Retrain the model on the COMBINED dataset
        model = LogisticRegression(max_iter=1000)
        model.fit(X_train, y_train)

        # 4. Save the updated model (overwriting the old one)
        joblib.dump(model, 'ml/saved_models/phish_model.pkl')
        
        # 5. Save the new combined dataset
        new_df = pd.DataFrame(X_train, columns=FEATURE_COLUMNS)
        new_df['label'] = y_train
        # Create the ml/data/ directory if it doesn't exist to avoid errors
        import os
        os.makedirs('ml/data', exist_ok=True)
        new_df.to_csv('ml/data/historical_training_data.csv', index=False)

        return True, {"status": "success", "new_samples_added": len(feedback_data), "total_samples": len(X_train)}
        
    except Exception as e:
        print(f"Retraining error: {e}")
        return False, {"error": str(e)}