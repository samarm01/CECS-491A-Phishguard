from preprocessing import clean_text
from features import extract_features


def prepare_dataset(email_samples):
    """
    Converts raw email samples into feature dictionaries
    ready for model training.
    """

    dataset = []

    for email in email_samples:
        headers = email["headers"]
        body = email["body"]

        # Clean body text
        cleaned = clean_text(body)

        # Extract metadata features
        features = extract_features(headers, body)

        # Add additional simple feature
        features["cleaned_length"] = len(cleaned)

        dataset.append(features)

    return dataset
