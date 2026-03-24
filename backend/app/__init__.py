import os
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from app.config import Config

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # CORS_ORIGINS env var: comma-separated list of allowed origins.
    # Defaults to localhost for local development.
    cors_origins_env = os.environ.get(
        'CORS_ORIGINS',
        'http://localhost:5173'
    )
    cors_origins = [o.strip() for o in cors_origins_env.split(',')]
    CORS(app, origins=cors_origins)

    db.init_app(app)

    os.makedirs(app.config.get('DATA_DIR', 'data'), exist_ok=True)
    os.makedirs(app.config.get('UPLOAD_FOLDER', 'uploads'), exist_ok=True)

    with app.app_context():
        from . import models  # noqa: F401 — ensures all models are registered before create_all
        db.create_all()

    from app.routes.api import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Frontend is now hosted separately (tgarttattoo.hu).
    # Static file serving kept here for reference if reverting to monolithic setup:
    #
    # from flask import send_from_directory, jsonify
    # static_dir = os.path.join(os.path.dirname(__file__), '..', 'static')
    # if os.path.isdir(static_dir):
    #     @app.route('/')
    #     def serve_index():
    #         return send_from_directory(static_dir, 'index.html')
    #
    #     @app.route('/<path:path>')
    #     def serve_static(path):
    #         if path.startswith('api/'):
    #             return jsonify({'error': 'Not found'}), 404
    #         file_path = os.path.join(static_dir, path)
    #         if os.path.isfile(file_path):
    #             return send_from_directory(static_dir, path)
    #         return send_from_directory(static_dir, 'index.html')

    return app
