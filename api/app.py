from flask import Flask
from flask_jwt extended import JWTManager
from api.config import Config
from api.db import Base, engine

#Import Blueprints
from api.routes.auth import auth_bp
from api.routes.users import user_bp
from api.routes.admin import admin_bp

def create_app():
  app = Flask(__name__)
  app.config.from_object(Config)

  JMTManager(app)

  Base.metadata.create_all(bind=engine)

  app.register_blueprint(auth_bp)
  app.register_blueprint(users_bp)
  app.register_blueprint(admin_bp)

  return app

app = create_app()

if __name__ == "__main__":
  app.run(debug=True)


