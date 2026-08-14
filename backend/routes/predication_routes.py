from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from ml.train_model import DemandPredictor
from models.analytics_model import AnalyticsModel
from services.prediction_service import PredictionService

prediction_bp = Blueprint('prediction', __name__)

def init_prediction_routes(mongo):
    """Initialize prediction routes with service layer"""

    # Create model and predictor instances
    analytics_model = AnalyticsModel(mongo.db)
    predictor = DemandPredictor()

    # Create service
    prediction_service = PredictionService(analytics_model, predictor)

    @prediction_bp.route('/train', methods=['POST'])
    @jwt_required()
    def train_model():
        """Train the ML model (Admin only)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = prediction_service.train_model(role)
        return jsonify(result), status

    @prediction_bp.route('/next-7-days', methods=['GET'])
    @jwt_required()
    def predict_demand():
        """Get demand prediction for next 7 days (Admin only)"""
        claims = get_jwt()
        role = claims.get("role", "customer")
        result, status = prediction_service.get_next_7_days_prediction(role)
        return jsonify(result), status

    return prediction_bp