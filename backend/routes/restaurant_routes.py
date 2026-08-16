from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.restaurant_model import RestaurantModel
from services.restaurant_service import RestaurantService

restaurant_bp = Blueprint('restaurant', __name__)

def init_restaurant_routes(mongo):
    """Initialize restaurant routes."""
    
    restaurant_model = RestaurantModel(mongo.db)
    restaurant_service = RestaurantService(restaurant_model)

    @restaurant_bp.route('', methods=['POST'])
    @jwt_required()
    def add_restaurant():
        """Add new restaurant (Admin)."""
        claims = get_jwt()
        role = claims.get("role", "customer")
        data = request.get_json()
        result, status = restaurant_service.add_restaurant(data, role)
        return jsonify(result), status

    @restaurant_bp.route('', methods=['GET'])
    def get_all_restaurants():
        """Get all restaurants (Public)."""
        result, status = restaurant_service.get_all_restaurants()
        return jsonify(result), status

    @restaurant_bp.route('/<restaurant_id>', methods=['PUT'])
    @jwt_required()
    def update_restaurant(restaurant_id):
        """Update restaurant (Admin)."""
        claims = get_jwt()
        role = claims.get("role", "customer")
        data = request.get_json()
        result, status = restaurant_service.update_restaurant(restaurant_id, data, role)
        return jsonify(result), status

    @restaurant_bp.route('/<restaurant_id>', methods=['DELETE'])
    @jwt_required()
    def delete_restaurant(restaurant_id):
        """Delete restaurant (Admin)."""
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = restaurant_service.delete_restaurant(restaurant_id, role)
        return jsonify(result), status

    return restaurant_bp