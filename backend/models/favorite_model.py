from datetime import datetime
from bson import ObjectId

class FavoriteModel:
    """Favorite Model — MongoDB operations for customer favorites."""

    def __init__(self, db):
        self.collection = db.favorites

    def add(self, user_id, item_id):
        """Add a menu item to favorites."""
        favorite = {
            "user_id": user_id,
            "item_id": item_id,
            "created_at": datetime.utcnow()
        }
        # Avoid duplicates
        existing = self.collection.find_one({"user_id": user_id, "item_id": item_id})
        if existing:
            return str(existing["_id"])
        result = self.collection.insert_one(favorite)
        return str(result.inserted_id)

    def remove(self, user_id, item_id):
        """Remove a favorite."""
        self.collection.delete_one({"user_id": user_id, "item_id": item_id})

    def get_by_user(self, user_id):
        """Get all favorite item IDs for a user."""
        favorites = list(self.collection.find({"user_id": user_id}))
        return [fav["item_id"] for fav in favorites]

    def is_favorite(self, user_id, item_id):
        """Check if an item is favorite."""
        return self.collection.find_one({"user_id": user_id, "item_id": item_id}) is not None