# models.py
from sqlalchemy import Boolean, Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.sql import func
from api.db import Base, engine
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import ARRAY, JSONB

# --- TABLE 1: USERS ---
# Matches Developer Guide: id, email, password_hash, role, created_at [cite: 229]
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="user")  # admin, user, etc.
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)


# --- TABLE 2: EMAILS ---
# Matches Developer Guide: id, sender, subject, body_hash, risk_score, status [cite: 230]
class Email(Base):
    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String, nullable=False)
    subject = Column(String)
    body = Column(Text)  # for the modal preview
    body_hash = Column(String)  # Storing hash for efficiency
    risk_score = Column(Float, default=0.0)
    status = Column(String, default="pending")  # pending, safe, quarantined
    is_false_positive = Column(Boolean, default=False) # <--- ADD THIS for Feedback Task
    received_at = Column(DateTime(timezone=True), server_default=func.now())
    department = Column(String, default="General") # <--- Add this for Task 9.4
    features_dict = Column(JSONB, default=dict) # Store ML features as JSONB for flexibility

 # NEW: sanitization + tags
    body_raw = Column(Text)
    body_sanitized = Column(Text)
    warning_tags = Column(ARRAY(String), default=list)  # Postgres text[]
# --- TABLE 3: LOGS ---
# Essential for "View Detection Logs" requirement [cite: 420]
class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String, nullable=False) # e.g., "ALERT", "SYSTEM"
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True)
    type = Column(String, nullable=False)
    email_id = Column(Integer)
    payload = Column(JSONB, nullable=False)
    delivered_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())



class EmailAction(Base):
    __tablename__ = "email_actions"

    id = Column(Integer, primary_key=True)
    email_id = Column(Integer, nullable=False)
    action = Column(String, nullable=False)
    reason = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# --- INITIALIZE DATABASE ---
# This command actually creates the tables in Neon
def init_db():
    print("Creating tables in the database...")
    Base.metadata.create_all(bind=engine)
    print("Tables created successfully!")

if __name__ == "__main__":
    init_db()
