# db.py
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1. Load environment variables
load_dotenv()

# 2. Get the DB_URL from your .env file
DATABASE_URL = os.getenv("DB_URL")

# Safety check: Ensure the URL exists
if not DATABASE_URL:
    raise ValueError("DB_URL is missing! Check your .env file.")

# 3. Create the SQLAlchemy Engine
engine = create_engine(DATABASE_URL)

# 4. Create a Session factory (This is the missing part causing your error!)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 5. Base class for our models
Base = declarative_base()

# Helper function to get a DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()