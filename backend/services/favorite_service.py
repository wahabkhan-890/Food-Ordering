from flask import abort
from models.menu_model import MenuModel

class FavoriteService:
    """Favorite Service — Business logic for favorites."""

    def __init__(self, favorite_model, menu_model):
        self.favorite_model = favorite_model
        self.menu_model = menu_model

    def add_favorite(self, user_id, item_id):
        """Add favorite (Customer only)."""
        # Check if item exists
        if not self.menu_model.get_by_id(item_id):
            abort(404, "Menu item not found")
        favorite_id = self.favorite_model.add(user_id, item_id)
        return {"message": "Added to favorites", "favorite_id": favorite_id}, 201

    def remove_favorite(self, user_id, item_id):
        """Remove favorite (Customer only)."""
        self.favorite_model.remove(user_id, item_id)
        return {"message": "Removed from favorites"}, 200

    def get_my_favorites(self, user_id):
        """Get all favorite menu items for customer."""
        item_ids = self.favorite_model.get_by_user(user_id)
        items = []
        for item_id in item_ids:
            item = self.menu_model.get_by_id(item_id)
            if item:
                item["_id"] = str(item["_id"])
                items.append(item)
        return {"favorites": items}, 200

    def check_favorite(self, user_id, item_id):
        """Check if an item is favorite."""
        is_fav = self.favorite_model.is_favorite(user_id, item_id)
        return {"is_favorite": is_fav}, 200