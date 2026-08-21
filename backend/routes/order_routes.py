from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from models.order_model import OrderModel
from services.order_service import OrderService

order_bp = Blueprint('order', __name__)

def init_order_routes(mongo):
    """Initialize order routes with database connection"""
    
    order_model = OrderModel(mongo.db)
    order_service = OrderService(order_model)

    @order_bp.route('', methods=['POST'])
    @jwt_required()
    def place_order():
        user_id = get_jwt_identity()
        data = request.get_json()
        items = data.get("items", [])
        total = data.get("total", 0)
        result, status = order_service.place_order(user_id, items, total)
        return jsonify(result), status

    @order_bp.route('/my', methods=['GET'])
    @jwt_required()
    def my_orders():
        user_id = get_jwt_identity()
        result, status = order_service.get_my_orders(user_id)
        return jsonify(result), status

    @order_bp.route('/all', methods=['GET'])
    @jwt_required()
    def all_orders():
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = order_service.get_all_orders(role)
        return jsonify(result), status

    @order_bp.route('/<order_id>/status', methods=['PUT'])
    @jwt_required()
    def update_status(order_id):
        claims = get_jwt()
        role = claims.get("role", "customer")
        data = request.get_json()
        new_status = data.get("status")
        cancellation_reason = data.get("cancellation_reason")
        result, status = order_service.update_order_status(order_id, new_status, role, cancellation_reason)
        return jsonify(result), status

    return order_bp