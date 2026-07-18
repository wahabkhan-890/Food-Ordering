import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/food_ordering_db")
database_name = os.getenv("DATABASE_NAME", "food_ordering_db")

print(f"Trying URI: {mongo_uri}")

try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    result = client.admin.command("ping")
    print("✅ MongoDB connection successful")
    print(result)
    print(f"Database name: {database_name}")
    client.close()
except Exception as exc:
    print(f"❌ MongoDB connection failed: {exc}")
