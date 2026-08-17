from flask import abort

class MenuService:
    def __init__(self, menu_model):
        self.menu_model = menu_model

    def add_item(self, data, user_role):
        if user_role != "admin":
            abort(403, description="Admin access required")

        if not data.get("name") or not data.get("price"):
            abort(400, description="Name and price are required")
        
        if float(data["price"]) <= 0:
            abort(400, description="Price must be positive")

        item_id = self.menu_model.create(data)
        return {"message": "Menu item added", "item_id": item_id}, 201

    def get_menu(self, restaurant_id=None, search=None, category=None):
        items = self.menu_model.get_all(restaurant_id, search, category)
        for item in items:
            item["_id"] = str(item["_id"])
        return {"items": items}, 200

    def get_categories(self, restaurant_id=None):
        categories = self.menu_model.get_categories(restaurant_id)
        return {"categories": categories}, 200

    def update_item(self, item_id, data, user_role):
        if user_role != "admin":
            abort(403, description="Admin access required")

        item = self.menu_model.get_by_id(item_id)
        if not item:
            abort(404, description="Item not found")

        self.menu_model.update(item_id, data)
        return {"message": "Item updated"}, 200

    def delete_item(self, item_id, user_role):
        if user_role != "admin":
            abort(403, description="Admin access required")

        if not self.menu_model.get_by_id(item_id):
            abort(404, description="Item not found")

        self.menu_model.delete(item_id)
        return {"message": "Item deleted"}, 200