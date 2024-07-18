from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import subprocess

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    with app.app_context():
        from .routes import init_routes
        init_routes(app)
        db.create_all()

        # JSONデータをSQLiteにインポートする別スクリプトを実行
        subprocess.run(['python', 'json_to_sqlite.py'], check=True)

    return app