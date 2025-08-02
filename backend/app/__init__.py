from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask import send_from_directory
import os

# Load variables from .env file
#load_dotenv()

mongo = PyMongo()
jwt = JWTManager()



def create_app():
    app = Flask(__name__)
    CORS(app)

    #app.config["MONGO_URI"] = os.getenv("DB_URI")
    app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
    mongo.init_app(app)

    app.config["JWT_SECRET_KEY"] = "my_dev_secret_123"  # change this to a strong secret!
    jwt.init_app(app)
    
    
    
    from app.routes.auth_routes import auth_bp
    from app.routes.transaction_routes import transaction_bp
    from app.routes.session_routes import session_bp
    from app.routes.event_routes import event_bp  # New event Blueprint
    from app.routes.user_routes import user_bp
    from app.routes.monitoringStudents_routes import monitoringstudent_bp
    from app.routes.profile_routes import profile_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(monitoringstudent_bp)
    app.register_blueprint(profile_bp)
    
    
    @app.route('/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)

    return app
