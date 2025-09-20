from flask import Flask, jsonify , make_response
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager  # ✅ Correct import
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt
from flask import send_from_directory
import os
from flask_mail import Mail

# from dotenv import load_dotenv
# import os



# Optional: Load environment variables
# from dotenv import load_dotenv
# import os
# load_dotenv()

mongo = PyMongo()  # Initialize MongoDB
jwt = JWTManager()
mail = Mail()

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS with all origins allowed, no credentials
    #CORS(app, resources={r"/*": {"origins": ["*", "http://localhost:5173"]}}, supports_credentials=True)

    # Set a secret key for JWTs
    app.config['JWT_SECRET_KEY'] = 'your-super-secret-key'  # change this to a strong key
    #app.config["JWT_SECRET_KEY"] = "my_dev_secret_123"  # change this to a strong secret!
    jwt.init_app(app)
    # Initialize JWTManager
    #jwt = JWTManager(app)

    # MongoDB configuration

    # app.config["MONGO_URI"] = os.getenv("DB_URI")
    app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
    mongo.init_app(app)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.transaction_routes import transaction_bp
    from app.routes.session_routes import session_bp
    from app.routes.event_routes import event_bp
    from app.routes.user_routes import user_bp
    from app.routes.monitoringStudents_routes import monitoringstudent_bp
    from app.routes.user_event_routes import user_event_bp  
    from app.routes.course_routes import course_bp

    from app.routes.participant_routes import participant_bp
    from app.routes.notification import notify_bp
    from app.routes.feedback import feedback_bp
    from app.routes.profile_routes import profile_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(monitoringstudent_bp)

    app.register_blueprint(course_bp, url_prefix="/courses")

    app.register_blueprint(participant_bp)
    app.register_blueprint(notify_bp)
    app.register_blueprint(feedback_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(user_event_bp)  # Register user_event_bp with a URL prefix
    @app.route('/uploads/<path:filename>')
    def serve_uploaded_file(filename):
        return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)
    
    # Error Handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return jsonify({"error": "Not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed_error(error):
        return jsonify({"error": "Method not allowed"}), 405

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500


    return app
