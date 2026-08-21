from datetime import datetime, timedelta

class AnalyticsModel:
    """Analytics Model — MongoDB aggregation queries"""

    def __init__(self, db):
        self.db = db

    def get_daily_orders(self, days=7):
        """Get order count per day for last N days"""
        pipeline = [
            {
                "$match": {
                    "created_at": {
                        "$gte": datetime.utcnow() - timedelta(days=days)
                    }
                }
            },
            {
                "$group": {
                    "_id": {
                        "$dateToString": {
                            "format": "%Y-%m-%d",
                            "date": "$created_at"
                        }
                    },
                    "count": {"$sum": 1},
                    "revenue": {"$sum": "$total"}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        return list(self.db.orders.aggregate(pipeline))

    def get_top_items(self, limit=5):
        """Get most ordered items"""
        pipeline = [
            {"$unwind": "$items"},
            {
                "$group": {
                    "_id": "$items.name",
                    "total_quantity": {"$sum": "$items.quantity"},
                    "total_revenue": {
                        "$sum": {"$multiply": ["$items.price", "$items.quantity"]}
                    }
                }
            },
            {"$sort": {"total_quantity": -1}},
            {"$limit": limit}
        ]
        return list(self.db.orders.aggregate(pipeline))

    def get_peak_hours(self):
        """Get orders by hour of day"""
        pipeline = [
            {
                "$group": {
                    "_id": {"$hour": "$created_at"},
                    "count": {"$sum": 1}
                }
            },
            {"$sort": {"_id": 1}}
        ]
        return list(self.db.orders.aggregate(pipeline))

    def get_category_stats(self):
        """Get orders by food category"""
        pipeline = [
            {"$unwind": "$items"},
            {
                "$lookup": {
                    "from": "menu_items",
                    "localField": "items.name",
                    "foreignField": "name",
                    "as": "menu_item"
                }
            },
            {"$unwind": {"path": "$menu_item", "preserveNullAndEmptyArrays": True}},
            {
                "$group": {
                    "_id": {"$ifNull": ["$menu_item.category", "Uncategorized"]},
                    "count": {"$sum": "$items.quantity"}
                }
            },
            {"$sort": {"count": -1}}
        ]
        return list(self.db.orders.aggregate(pipeline))

    def get_today_summary(self):
    """Get today's orders summary."""
    from datetime import datetime, timedelta
    
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    # Today's orders count + revenue
    today_orders_pipeline = [
        {
            "$match": {
                "created_at": {"$gte": today_start, "$lt": today_end}
            }
        },
        {
            "$group": {
                "_id": None,
                "total_orders": {"$sum": 1},
                "total_revenue": {"$sum": "$total"}
            }
        }
    ]
    today_result = list(self.db.orders.aggregate(today_orders_pipeline))
    
    # Pending orders count
    pending_pipeline = [
        {"$match": {"status": "Pending"}},
        {"$count": "pending_count"}
    ]
    pending_result = list(self.db.orders.aggregate(pending_pipeline))
    
    # Total customers
    total_customers = self.db.users.count_documents({"role": "customer"})
    
    return {
        "today_orders": today_result[0]["total_orders"] if today_result else 0,
        "today_revenue": today_result[0]["total_revenue"] if today_result else 0,
        "pending_orders": pending_result[0]["pending_count"] if pending_result else 0,
        "total_customers": total_customers
    }    