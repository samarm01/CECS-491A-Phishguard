from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS  # <--- 1. ADD THIS IMPORT
from api.config import Config
from api.db import Base, engine

#Import Blueprints
from api.routes.auth import auth_bp
from api.routes.users import users_bp
from api.routes.admin import admin_bp
from api.routes.data import data_bp

def create_app():
  app = Flask(__name__)
  app.config.from_object(Config)

  # 2. ENABLE CORS (Allow your React app to talk to Flask)
  # This tells the browser: "It's okay to accept data from any frontend"
  CORS(app)

  JWTManager(app)

  Base.metadata.create_all(bind=engine)

  app.register_blueprint(auth_bp)
  app.register_blueprint(users_bp)
  app.register_blueprint(admin_bp)
  app.register_blueprint(data_bp)

  return app

app = create_app()

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)








