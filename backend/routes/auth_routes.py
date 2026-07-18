from flask import Blueprint, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from models.user_model import UserModel
from services.auth_service import AuthService
from utils.validators import validate_registration, validate_login
from utils.response import success_response, error_response


def init_auth_routes(mongo):
    """Initialize auth routes with database"""

    auth_bp = Blueprint('auth', __name__)
    user_model = UserModel(mongo.db) if getattr(mongo, "db", None) is not None else None
    auth_service = AuthService(user_model) if user_model is not None else None

    @auth_bp.route('/register', methods=['POST'])
    def register():
        """Register new user"""
        if auth_service is None:
            return error_response("Database unavailable. Configure MongoDB first.", 503)

        data = request.get_json()

        # Validate input
        errors = validate_registration(data)
        if errors:
            return error_response("Validation failed", 400, errors)

        # Register user
        result, status_code = auth_service.register(data)

        if status_code >= 400:
            return error_response(result["error"], status_code)

        return success_response(result, "Registration successful", status_code)

    @auth_bp.route('/login', methods=['POST'])
    def login():
        """Login user"""
        if auth_service is None:
            return error_response("Database unavailable. Configure MongoDB first.", 503)

        data = request.get_json()

        # Validate input
        errors = validate_login(data)
        if errors:
            return error_response("Validation failed", 400, errors)

        # Login user
        result, status_code = auth_service.login(data)

        if status_code >= 400:
            return error_response(result["error"], status_code)

        return success_response(result, "Login successful", status_code)

    @auth_bp.route('/me', methods=['GET'])
    @jwt_required()
    def get_profile():
        """Get current user profile"""
        if auth_service is None:
            return error_response("Database unavailable. Configure MongoDB first.", 503)

        user_id = get_jwt_identity()
        result, status_code = auth_service.get_current_user(user_id)

        if status_code >= 400:
            return error_response(result["error"], status_code)

        return success_response(result, "Profile retrieved", status_code)

    return auth_bp