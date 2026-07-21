from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.menu_model import MenuModel
from services.menu_service import MenuService

menu_bp = Blueprint('menu', __name__)

def init_menu_routes(mongo):
    menu_model = MenuModel(mongo.db)
    menu_service = MenuService(menu_model)

    @menu_bp.route('', methods=['POST'])
    @jwt_required()
    def add_item():
        data = request.get_json()
        claims = get_jwt()
        user_role = claims.get("role", "customer")
        result, status = menu_service.add_item(data, user_role)
        return jsonify(result), status

    @menu_bp.route('', methods=['GET'])
    def get_menu():
        restaurant_id = request.args.get('restaurant_id')
        result, status = menu_service.get_menu(restaurant_id)
        return jsonify(result), status

    @menu_bp.route('/<item_id>', methods=['PUT'])
    @jwt_required()
    def update_item(item_id):
        data = request.get_json()
        claims = get_jwt()
        user_role = claims.get("role", "customer")
        result, status = menu_service.update_item(item_id, data, user_role)
        return jsonify(result), status

    @menu_bp.route('/<item_id>', methods=['DELETE'])
    @jwt_required()
    def delete_item(item_id):
        claims = get_jwt()
        user_role = claims.get("role", "customer")
        result, status = menu_service.delete_item(item_id, user_role)
        return jsonify(result), status

    return menu_bp