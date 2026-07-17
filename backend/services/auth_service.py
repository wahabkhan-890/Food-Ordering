from datetime import timedelta
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token

bcrypt = Bcrypt()

class AuthService:
    """Authentication Service - Business Logic"""
    
    def __init__(self, user_model):
        self.user_model = user_model
    
    def register(self, data):
        """Register new user"""
        # Check if user exists
        if self.user_model.user_exists(data["email"]):
            return {"error": "Email already registered"}, 400
        
        # Hash password
        hashed_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8')
        
        # Create user
        user_data = {
            "name": data["name"],
            "email": data["email"],
            "password": hashed_password,
            "role": data.get("role", "customer")
        }
        
        user_id = self.user_model.create_user(user_data)
        
        return {
            "message": "User registered successfully!",
            "user_id": user_id
        }, 201
    
    def login(self, data):
        """Login user"""
        # Find user
        user = self.user_model.find_by_email(data["email"])
        
        if not user:
            return {"error": "Invalid email or password"}, 401
        
        # Check password
        if not bcrypt.check_password_hash(user["password"], data["password"]):
            return {"error": "Invalid email or password"}, 401
        
        # Generate tokens
        access_token = create_access_token(
            identity=str(user["_id"]),
            additional_claims={"role": user["role"], "email": user["email"]},
            expires_delta=timedelta(hours=1)
        )
        
        refresh_token = create_refresh_token(
            identity=str(user["_id"]),
            expires_delta=timedelta(days=30)
        )
        
        return {
            "message": "Login successful!",
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"]
            }
        }, 200
    
    def get_current_user(self, user_id):
        """Get current user profile"""
        user = self.user_model.find_by_id(user_id)
        
        if not user:
            return {"error": "User not found"}, 404
        
        return {
            "user": {
                "id": str(user["_id"]),
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
                "created_at": user["created_at"].isoformat()
            }
        }, 200