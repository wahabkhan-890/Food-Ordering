from flask import abort

class OrderService:
    """Order Service - Business Logic"""
    
    def __init__(self, order_model):
        self.order_model = order_model

    def place_order(self, user_id, items, total):
        """Customer places a new order"""
        if not items or len(items) == 0:
            abort(400, "Cart is empty")
        if float(total) <= 0:
            abort(400, "Invalid total amount")

        order_id = self.order_model.create(user_id, items, total)
        return {"message": "Order placed successfully", "order_id": order_id}, 201

    def get_my_orders(self, user_id):
        """Customer views their own orders"""
        orders = self.order_model.get_by_user(user_id)
        # Convert ObjectId to string for JSON serialization
        for order in orders:
            order["_id"] = str(order["_id"])
        return {"orders": orders}, 200

    def get_all_orders(self, user_role):
        """Admin views all orders"""
        if user_role != "admin":
            abort(403, "Admin access required")
        orders = self.order_model.get_all()
        for order in orders:
            order["_id"] = str(order["_id"])
        return {"orders": orders}, 200

    def update_order_status(self, order_id, status, user_role):
        """Admin updates order status"""
        if user_role != "admin":
            abort(403, "Admin access required")
        
        valid_statuses = ["Pending", "Accepted", "Preparing", "Ready", "Delivered", "Cancelled"]
        if status not in valid_statuses:
            abort(400, f"Invalid status. Valid: {', '.join(valid_statuses)}")

        order = self.order_model.get_by_id(order_id)
        if not order:
            abort(404, "Order not found")

        self.order_model.update_status(order_id, status)
        return {"message": f"Order status updated to '{status}'"}, 200