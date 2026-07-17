from datetime import datetime
from bson import ObjectId

class UserModel:
    """User Model - MongoDB schema and operations"""
    
    def __init__(self, db):
        self.collection = db.users
    
    def create_user(self, user_data):
        """Create a new user"""
        user = {
            "name": user_data["name"],
            "email": user_data["email"].lower(),
            "password": user_data["password"],  # Already hashed from service
            "role": user_data.get("role", "customer"),  # customer or admin
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(user)
        return str(result.inserted_id)
    
    def find_by_email(self, email):
        """Find user by email"""
        return self.collection.find_one({"email": email.lower()})
    
    def find_by_id(self, user_id):
        """Find user by ID"""
        return self.collection.find_one({"_id": ObjectId(user_id)})
    
    def user_exists(self, email):
        """Check if user already exists"""
        return self.collection.find_one({"email": email.lower()}) is not None