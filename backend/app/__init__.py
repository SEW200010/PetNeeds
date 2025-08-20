from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_mail import Mail


# Optional: Load environment variables
# from dotenv import load_dotenv
# import os
# load_dotenv()

mongo = PyMongo()  # Initialize MongoDB
mail = Mail() 

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS with all origins allowed, no credentials

    # Configure MongoDB
    # app.config["MONGO_URI"] = os.getenv("DB_URI")
    app.config["MONGO_URI"] = "mongodb://localhost:27017/lifeskill"
    app.config["MAIL_SERVER"] = "smtp.gmail.com"
    app.config["MAIL_PORT"] = 587
    app.config["MAIL_USE_TLS"] = True
    app.config["MAIL_USERNAME"] = "pebalbubulu@gmail.com"  
    app.config["MAIL_PASSWORD"] = "wcuh gknz vhri mfdn"          
    app.config["MAIL_DEFAULT_SENDER"] = "pebalbubulu@gmail.com"
    mail.init_app(app) 
    mongo.init_app(app)

    # Register Blueprints
    from app.routes.auth_routes import auth_bp
    from app.routes.transaction_routes import transaction_bp
    from app.routes.session_routes import session_bp
    from app.routes.event_routes import event_bp
    from app.routes.user_routes import user_bp
    from app.routes.monitoringStudents_routes import monitoringstudent_bp
    from app.routes.participant_routes import participant_bp
    from app.routes.notification import notify_bp
    from app.routes.feedback import feedback_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(transaction_bp)
    app.register_blueprint(session_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(monitoringstudent_bp)
    app.register_blueprint(participant_bp)
    app.register_blueprint(notify_bp)
    app.register_blueprint(feedback_bp)

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
