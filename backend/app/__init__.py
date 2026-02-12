import os
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=["http://localhost:5173"])

    db.init_app(app)

    os.makedirs(app.config.get('DATA_DIR', 'data'), exist_ok=True)
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    with app.app_context():
        db.create_all()

    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Serve frontend static build if available (production/docker)
    static_dir = os.path.join(os.path.dirname(__file__), '..', 'static')
    if os.path.isdir(static_dir):
        @app.route('/')
        def serve_index():
            return send_from_directory(static_dir, 'index.html')

        @app.route('/<path:path>')
        def serve_static(path):
            if path.startswith('api/'):
                return jsonify({'error': 'Not found'}), 404
            file_path = os.path.join(static_dir, path)
            if os.path.isfile(file_path):
                return send_from_directory(static_dir, path)
            return send_from_directory(static_dir, 'index.html')

    return app
