from flask import abort
from ml.train_model import DemandPredictor
from models.analytics_model import AnalyticsModel

class PredictionService:
    """Prediction Service — Business Logic for ML operations"""

    def __init__(self, analytics_model: AnalyticsModel, predictor: DemandPredictor):
        self.analytics_model = analytics_model
        self.predictor = predictor

    def train_model(self, user_role: str):
        """Train the demand prediction model (Admin only)"""
        if user_role != "admin":
            abort(403, "Admin access required")

        # Get last 30 days order data
        orders_data = self.analytics_model.get_daily_orders(days=30)
        result, status = self.predictor.train(orders_data)
        if status >= 400:
            abort(status, result.get("error", "Training failed"))
        return result, status

    def get_next_7_days_prediction(self, user_role: str):
        """Get demand prediction for next 7 days (Admin only)"""
        if user_role != "admin":
            abort(403, "Admin access required")

        # Get data needed for prediction
        orders_data = self.analytics_model.get_daily_orders(days=30)
        result, status = self.predictor.predict_next_7_days(orders_data)
        if status >= 400:
            abort(status, result.get("error", "Prediction failed"))
        return result, status