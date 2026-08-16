from datetime import datetime
from bson import ObjectId

class RestaurantModel:
    """Restaurant Model — MongoDB operations for restaurants."""

    def __init__(self, db):
        self.collection = db.restaurants

    def create(self, data):
        """Create a new restaurant."""
        restaurant = {
            "name": data["name"],
            "cuisine": data.get("cuisine", ""),
            "address": data.get("address", ""),
            "phone": data.get("phone", ""),
            "rating": data.get("rating", 0.0),
            "image": data.get("image", ""),
            "owner_id": data.get("owner_id", None),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(restaurant)
        return str(result.inserted_id)

    def get_all(self):
        """Get all restaurants."""
        return list(self.collection.find().sort("created_at", -1))

    def get_by_id(self, restaurant_id):
        """Get restaurant by ID."""
        return self.collection.find_one({"_id": ObjectId(restaurant_id)})

    def update(self, restaurant_id, data):
        """Update restaurant details."""
        data["updated_at"] = datetime.utcnow()
        self.collection.update_one(
            {"_id": ObjectId(restaurant_id)},
            {"$set": data}
        )
        return self.get_by_id(restaurant_id)

    def delete(self, restaurant_id):
        """Delete restaurant."""
        self.collection.delete_one({"_id": ObjectId(restaurant_id)})