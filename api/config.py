import os

class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret")

    # JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-jwt-secret")

    DB_URL = os.getenv("DB_URL")
