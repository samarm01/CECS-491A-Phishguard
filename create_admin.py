# For testing purposes, run this script to create an admin user
from api.db import SessionLocal
from api.models.models import User

# 1. Connect to DB
db = SessionLocal()

# 2. Define the user
email = "admin@phishguard.com"
password = "admin_password"  # <--- This is the password you will type in the UI

# 3. Check if exists
existing_user = db.query(User).filter_by(email=email).first()
if existing_user:
    print(f"User {email} already exists. Deleting to recreate...")
    db.delete(existing_user)
    db.commit()

# 4. Create new user with PROPER HASHING
new_user = User(email=email, role="admin")
new_user.set_password(password)  # <--- This generates the real hash

# 5. Save
db.add(new_user)
db.commit()
print(f"Success! Login with:\nEmail: {email}\nPassword: {password}")