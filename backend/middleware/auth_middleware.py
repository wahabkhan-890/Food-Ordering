from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from flask import jsonify

def admin_required():
    """Middleware: Only admin can access"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != "admin":
                return jsonify({"error": "Admin access required"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def customer_required():
    """Middleware: Only customer can access"""
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()
            if claims.get("role") != "customer":
                return jsonify({"error": "Customer access required"}), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper

def login_required(fn):
    """Middleware: Any logged-in user can access"""
    @wraps(fn)
    def decorator(*args, **kwargs):
        verify_jwt_in_request()
        return fn(*args, **kwargs)
    return decorator