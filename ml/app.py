# app.py

from fastapi import FastAPI
from pydantic import BaseModel
from predict import predict_email

app = FastAPI()


class EmailInput(BaseModel):
    headers: dict
    body: str
    user_id: str = "default_user"


@app.get("/")
def home():
    return {"message": "PhishGuard API is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(data: EmailInput):

    (
        result,
        confidence,
        reasons,
        risk_level,
        action,
        user_risk
    ) = predict_email(
        {
            "headers": data.headers,
            "body": data.body
        },
        data.user_id
    )

    return {
        "prediction": "phishing" if result == 1 else "safe",
        "confidence": round(confidence, 2),
        "risk_level": risk_level,
        "user_risk_score": user_risk,
        "reasons": reasons,
        "recommended_action": action
    }