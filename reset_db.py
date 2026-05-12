# reset_db.py
from api.db import engine, Base
from api.models.models import Email

print("Dropping old 'emails' table...")
# checkfirst=True prevents it from crashing if the table is already gone
Email.__table__.drop(engine, checkfirst=True) 

print("Recreating tables with new columns...")
# This reads your updated models.py and creates the table with features_dict
Base.metadata.create_all(bind=engine)

print("✅ Success! The database schema is updated.")