from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from models.analytics_model import AnalyticsModel
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__)

def init_analytics_routes(mongo):
    """Initialize analytics routes"""
    
    analytics_model = AnalyticsModel(mongo.db)
    analytics_service = AnalyticsService(analytics_model)

    @analytics_bp.route('/daily-orders', methods=['GET'])
    @jwt_required()
    def daily_orders():
        """Get daily order counts (Admin)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        days = request.args.get('days', 7, type=int)
        result, status = analytics_service.get_daily_orders(days, role)
        return jsonify(result), status

    @analytics_bp.route('/top-items', methods=['GET'])
    @jwt_required()
    def top_items():
        """Get top selling items (Admin)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        limit = request.args.get('limit', 5, type=int)
        result, status = analytics_service.get_top_items(limit, role)
        return jsonify(result), status

    @analytics_bp.route('/peak-hours', methods=['GET'])
    @jwt_required()
    def peak_hours():
        """Get peak order hours (Admin)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = analytics_service.get_peak_hours(role)
        return jsonify(result), status

    @analytics_bp.route('/categories', methods=['GET'])
    @jwt_required()
    def categories():
        """Get category popularity (Admin)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = analytics_service.get_category_stats(role)
        return jsonify(result), status

    return analytics_bp