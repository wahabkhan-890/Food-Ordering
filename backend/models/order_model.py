from datetime import datetime
from bson import ObjectId

class OrderModel:
    """Order Model - MongoDB operations for orders"""
    
    def __init__(self, db):
        self.collection = db.orders

    def create(self, user_id, items, total):
        """Create a new order"""
        order = {
            "user_id": user_id,
            "items": items,
            "total": float(total),
            "status": "Pending",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(order)
        return str(result.inserted_id)

    def get_by_id(self, order_id):
        """Get a single order by ID"""
        return self.collection.find_one({"_id": ObjectId(order_id)})

    def get_by_user(self, user_id):
        """Get all orders for a specific customer"""
        return list(self.collection.find({"user_id": user_id}).sort("created_at", -1))

    def get_all(self):
        """Get all orders (for admin)"""
        return list(self.collection.find().sort("created_at", -1))

    def update_status(self, order_id, status, cancellation_reason=None):
        """Update order status with optional cancellation reason"""
        update_data = {
            "status": status,
            "updated_at": datetime.utcnow()
        }
        if status == "Cancelled" and cancellation_reason:
            update_data["cancellation_reason"] = cancellation_reason
        self.collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )