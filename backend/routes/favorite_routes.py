from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.favorite_model import FavoriteModel
from models.menu_model import MenuModel
from services.favorite_service import FavoriteService

favorite_bp = Blueprint('favorite', __name__)

def init_favorite_routes(mongo):
    """Initialize favorite routes."""
    favorite_model = FavoriteModel(mongo.db)
    menu_model = MenuModel(mongo.db)
    favorite_service = FavoriteService(favorite_model, menu_model)

    @favorite_bp.route('', methods=['POST'])
    @jwt_required()
    def add_favorite():
        user_id = get_jwt_identity()
        data = request.get_json()
        item_id = data.get("item_id")
        if not item_id:
            return jsonify({"error": "item_id is required"}), 400
        result, status = favorite_service.add_favorite(user_id, item_id)
        return jsonify(result), status

    @favorite_bp.route('/<item_id>', methods=['DELETE'])
    @jwt_required()
    def remove_favorite(item_id):
        user_id = get_jwt_identity()
        result, status = favorite_service.remove_favorite(user_id, item_id)
        return jsonify(result), status

    @favorite_bp.route('', methods=['GET'])
    @jwt_required()
    def get_favorites():
        user_id = get_jwt_identity()
        result, status = favorite_service.get_my_favorites(user_id)
        return jsonify(result), status

    @favorite_bp.route('/check/<item_id>', methods=['GET'])
    @jwt_required()
    def check_favorite(item_id):
        user_id = get_jwt_identity()
        result, status = favorite_service.check_favorite(user_id, item_id)
        return jsonify(result), status

    return favorite_bp