from flask import abort

class AnalyticsService:
    """Analytics Service — Business Logic"""

    def __init__(self, analytics_model):
        self.analytics_model = analytics_model

    def get_daily_orders(self, days=7, user_role=None):
        if user_role != "admin":
            abort(403, "Admin access required")
        data = self.analytics_model.get_daily_orders(days)
        return {"daily_orders": data}, 200

    def get_top_items(self, limit=5, user_role=None):
        if user_role != "admin":
            abort(403, "Admin access required")
        data = self.analytics_model.get_top_items(limit)
        return {"top_items": data}, 200

    def get_peak_hours(self, user_role=None):
        if user_role != "admin":
            abort(403, "Admin access required")
        data = self.analytics_model.get_peak_hours()
        hour_map = {item["_id"]: item["count"] for item in data}
        full_data = [{"hour": h, "count": hour_map.get(h, 0)} for h in range(24)]
        return {"peak_hours": full_data}, 200

    def get_category_stats(self, user_role=None):
        if user_role != "admin":
            abort(403, "Admin access required")
        data = self.analytics_model.get_category_stats()
        return {"categories": data}, 200

    def get_today_summary(self, user_role=None):
        """Get today's summary (Admin only)."""
        if user_role != "admin":
            abort(403, "Admin access required")
        summary = self.analytics_model.get_today_summary()
        return {"summary": summary}, 200