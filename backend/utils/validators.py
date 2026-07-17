import re

def validate_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_registration(data):
    """Validate registration data"""
    errors = []
    
    # Name validation
    if not data.get("name") or len(data["name"].strip()) < 3:
        errors.append("Name must be at least 3 characters")
    
    # Email validation
    if not data.get("email") or not validate_email(data["email"]):
        errors.append("Valid email is required")
    
    # Password validation
    password = data.get("password", "")
    if len(password) < 6:
        errors.append("Password must be at least 6 characters")
    
    return errors

def validate_login(data):
    """Validate login data"""
    errors = []
    
    if not data.get("email"):
        errors.append("Email is required")
    
    if not data.get("password"):
        errors.append("Password is required")
    
    return errors