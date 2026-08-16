import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
from datetime import datetime, timedelta
import os

class DemandPredictor:
    """ML Model for Food Demand Prediction"""

    def __init__(self, model_path='ml/demand_model.pkl'):
        self.model_path = model_path
        self.model = None
        # Load existing model if available
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)

    def prepare_features(self, orders_data):
        """
        Convert raw order data into features for ML model
        Features: day_of_week, day_of_month, month, is_weekend, rolling_avg_7days
        """
        if not orders_data:
            return None, None

        # Convert to DataFrame
        df = pd.DataFrame(orders_data)
        df['_id'] = pd.to_datetime(df['_id'])
        df = df.sort_values('_id')

        # Create features
        df['day_of_week'] = df['_id'].dt.dayofweek  # 0=Monday, 6=Sunday
        df['day_of_month'] = df['_id'].dt.day
        df['month'] = df['_id'].dt.month
        df['is_weekend'] = df['day_of_week'].isin([5, 6]).astype(int)

        # Rolling average of last 7 days
        df['rolling_avg_7days'] = df['count'].rolling(window=7, min_periods=1).mean()

        # Features and target
        feature_cols = ['day_of_week', 'day_of_month', 'month', 'is_weekend', 'rolling_avg_7days']
        X = df[feature_cols].values
        y = df['count'].values

        return X, y, df

    def train(self, orders_data):
        """Train the ML model"""
        X, y, df = self.prepare_features(orders_data)

        if X is None or len(X) < 10:
            return {"error": "Not enough data to train. Need at least 10 days of data."}, 400

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train Random Forest model
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.model.predict(X_test)
        mae = mean_absolute_error(y_test, y_pred)

        # Save model
        joblib.dump(self.model, self.model_path)

        return {
            "message": "Model trained successfully",
            "mae": round(mae, 2),
            "samples_used": len(X),
            "model_path": self.model_path
        }, 200

    def predict_next_7_days(self, orders_data):
        """Predict demand for next 7 days"""
        if self.model is None:
            # Train if not trained
            self.train(orders_data)
            if self.model is None:
                return {"error": "Model not trained. Not enough data."}, 400

        X, y, df = self.prepare_features(orders_data)
        if X is None:
            return {"error": "No data available for prediction"}, 400

        # Get last 7 days average
        last_avg = df['count'].tail(7).mean() if len(df) >= 7 else df['count'].mean()

        predictions = []
        today = datetime.utcnow()

        for i in range(7):
            future_date = today + timedelta(days=i+1)

            # Create feature for prediction
            features = np.array([[
                future_date.weekday(),          # day_of_week
                future_date.day,                # day_of_month
                future_date.month,              # month
                1 if future_date.weekday() in [5, 6] else 0,  # is_weekend
                last_avg                        # rolling_avg_7days
            ]])

            predicted = self.model.predict(features)[0]
            predicted = max(0, round(predicted))  # No negative predictions

            predictions.append({
                "date": future_date.strftime("%Y-%m-%d"),
                "day": future_date.strftime("%A"),
                "predicted_orders": predicted
            })

        # Get actual data for comparison (last 7 days)
        actual_data = df.tail(7)[['_id', 'count']].copy()
        actual_data['_id'] = actual_data['_id'].dt.strftime('%Y-%m-%d')
        actual_list = actual_data.to_dict('records')

        return {
            "predictions": predictions,
            "actual_last_7_days": actual_list,
            "model_mae": getattr(self, 'last_mae', None)
        }, 200