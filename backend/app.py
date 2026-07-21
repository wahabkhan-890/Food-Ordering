import time
from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
import os

load_dotenv()


def is_placeholder_value(value):
    if not value:
        return True
    value = value.strip()
    return value.startswith("<") or value.endswith(">") or value.lower() in {"changeme", "your_uri_here"}


def build_mongo_uri():
    configured_uri = os.getenv("MONGO_URI", "").strip()
    if configured_uri and not is_placeholder_value(configured_uri):
        return configured_uri
    database_name = os.getenv("DATABASE_NAME", "food_ordering_db").strip() or "food_ordering_db"
    return f"mongodb://localhost:27017/{database_name}"


app = Flask(__name__)
CORS(app)

# Configuration
app.config["MONGO_URI"] = build_mongo_uri()
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "super-secret-key")
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)


class MongoWrapper:
    def __init__(self, db):
        self.db = db


# ✅ FIXED: Sirf EK definition, with retries!
def create_mongo_connection(retries=3):
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("⚠️  MONGO_URI not set. Running without database...")
        return None

    for attempt in range(1, retries + 1):
        try:
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=10000)
            client.admin.command("ping")
            print(f"✅ MongoDB connected on attempt {attempt}!")
            return client.get_database()
        except Exception as e:
            print(f"⚠️  Attempt {attempt}/{retries} failed: {e}")
            if attempt < retries:
                print(f"⏳ Retrying in 3 seconds...")
                time.sleep(3)

    print("❌ All connection attempts failed. Server will run without database.")
    return None


mongo_db = create_mongo_connection()
mongo = MongoWrapper(mongo_db)
jwt = JWTManager(app)

# Register blueprints
from routes.auth_routes import init_auth_routes

auth_bp = init_auth_routes(mongo)
app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
from routes.menu_routes import init_menu_routes
menu_bp = init_menu_routes(mongo)
app.register_blueprint(menu_bp, url_prefix='/api/v1/menu')


@app.route('/')
def home():
    db_status = "Connected" if mongo_db is not None else "Not Connected"
    return {
        "message": "Welcome to Food Ordering API! 🍔",
        "version": "v1",
        "database": db_status
    }


@app.route('/api/health')
def health_check():
    if mongo_db is None:
        return {"status": "healthy", "database": "not configured"}

    try:
        mongo_db.list_collection_names()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "healthy", "database": f"error - {str(e)}"}


if __name__ == '__main__':
    print("🚀 Starting server...")
    app.run(debug=True, port=5000)