from datetime import datetime
from bson import ObjectId

class MenuModel:
    def __init__(self, db):
        self.collection = db.menu_items

    def create(self, data):
        item = {
            "name": data["name"],
            "description": data.get("description", ""),
            "price": float(data["price"]),
            "category": data["category"],
            "image": data.get("image", ""),  # URL or base64
            "restaurant_id": data.get("restaurant_id", "default"),
            "available": True,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = self.collection.insert_one(item)
        return str(result.inserted_id)

    def get_all(self, restaurant_id=None):
        query = {}
        if restaurant_id:
            query["restaurant_id"] = restaurant_id
        return list(self.collection.find(query).sort("created_at", -1))

    def get_by_id(self, item_id):
        return self.collection.find_one({"_id": ObjectId(item_id)})

    def update(self, item_id, data):
        data["updated_at"] = datetime.utcnow()
        self.collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": data}
        )
        return self.get_by_id(item_id)

    def delete(self, item_id):
        self.collection.delete_one({"_id": ObjectId(item_id)})