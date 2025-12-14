# api/db.py
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv, find_dotenv # <--- Import find_dotenv

# 1. Load environment variables (Automatically finds .env in api/ or root)
load_dotenv(find_dotenv()) 

# Fallback: If find_dotenv didn't work, try explicit path
if not os.getenv("DB_URL"):
    load_dotenv("api/.env")

# 2. Get the DB_URL
DATABASE_URL = os.getenv("DB_URL")

# Safety check
if not DATABASE_URL:
    raise ValueError("DB_URL is missing! Ensure .env is in the 'api' folder or root directory.")

# 3. Create Engine
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()