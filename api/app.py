from api.routes.auth import auth_bp
app.register_blueprint(auth_bp)
from api.routes.users import user_bp
app.register_blueprint(users_bp)

