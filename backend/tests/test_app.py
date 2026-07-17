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


if __name__ == "__main__":
    unittest.main()
