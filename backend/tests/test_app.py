import importlib
import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))


class AppStartupTest(unittest.TestCase):
    def test_app_imports_without_database(self):
        os.environ["MONGO_URI"] = "mongodb+srv://bad:bad@cluster0.xxxxx.mongodb.net/food_ordering"
        sys.modules.pop("app", None)

        app_module = importlib.import_module("app")

        self.assertTrue(hasattr(app_module, "app"))
        self.assertIsNone(app_module.mongo.db)

    def test_local_fallback_uri_is_used_when_uri_is_missing(self):
        os.environ.pop("MONGO_URI", None)
        os.environ["DATABASE_NAME"] = "food_ordering_db"
        sys.modules.pop("app", None)

        app_module = importlib.import_module("app")

        self.assertEqual(app_module.build_mongo_uri(), "mongodb://localhost:27017/food_ordering_db")


if __name__ == "__main__":
    unittest.main()
