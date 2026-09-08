import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

PRODUCTS_FILE = os.path.join(DATA_DIR, "products.json")
PRICING_FILE = os.path.join(DATA_DIR, "pricing.json")
CATEGORY_RULES_FILE = os.path.join(DATA_DIR, "category_rules.json")

SECRET_KEY = os.environ.get("SECRET_KEY", "fresh-nest-secret-key-2026")
DEBUG = True
