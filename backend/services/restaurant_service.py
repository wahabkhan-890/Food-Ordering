from flask import abort

class RestaurantService:
    """Restaurant Service — Business logic for restaurants."""

    def __init__(self, restaurant_model):
        self.restaurant_model = restaurant_model

    def add_restaurant(self, data, user_role):
        """Add new restaurant (Admin only)."""
        if user_role != "admin":
            abort(403, "Admin access required")
        if not data.get("name"):
            abort(400, "Restaurant name is required")
        restaurant_id = self.restaurant_model.create(data)
        return {"message": "Restaurant added", "restaurant_id": restaurant_id}, 201

    def get_all_restaurants(self):
        """Get all restaurants (Public)."""
        restaurants = self.restaurant_model.get_all()
        for r in restaurants:
            r["_id"] = str(r["_id"])
        return {"restaurants": restaurants}, 200

    def update_restaurant(self, restaurant_id, data, user_role):
        """Update restaurant (Admin only)."""
        if user_role != "admin":
            abort(403, "Admin access required")
        restaurant = self.restaurant_model.get_by_id(restaurant_id)
        if not restaurant:
            abort(404, "Restaurant not found")
        self.restaurant_model.update(restaurant_id, data)
        return {"message": "Restaurant updated"}, 200

    def delete_restaurant(self, restaurant_id, user_role):
        """Delete restaurant (Admin only)."""
        if user_role != "admin":
            abort(403, "Admin access required")
        if not self.restaurant_model.get_by_id(restaurant_id):
            abort(404, "Restaurant not found")
        self.restaurant_model.delete(restaurant_id)
        return {"message": "Restaurant deleted"}, 200