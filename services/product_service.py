import json
import os
from typing import List, Dict, Optional

class ProductService:
    def __init__(self, data_path: str):
        self.data_path = data_path
        self._products: List[Dict] = []
        self.load()

    def load(self):
        if os.path.exists(self.data_path):
            with open(self.data_path, "r", encoding="utf-8") as f:
                self._products = json.load(f)
        else:
            self._products = []

    def get_all(self, category: Optional[str] = None, search: Optional[str] = None) -> List[Dict]:
        self.load()
        results = self._products
        if category and category.lower() != "all":
            results = [p for p in results if p.get("category", "").lower() == category.lower()]
        if search:
            query = search.lower().strip()
            results = [
                p for p in results
                if query in p.get("name", "").lower()
                or query in p.get("brand", "").lower()
                or query in p.get("category", "").lower()
                or query in p.get("subcategory", "").lower()
            ]
        return results

    def get_by_id(self, product_id: str) -> Optional[Dict]:
        self.load()
        for p in self._products:
            if p.get("id") == product_id:
                return p
        return None

    def get_categories(self) -> List[str]:
        self.load()
        cats = sorted(list({p.get("category") for p in self._products if p.get("category")}))
        return cats

    def save_product(self, product_data: Dict) -> Dict:
        self.load()
        existing = False
        for i, p in enumerate(self._products):
            if p.get("id") == product_data.get("id"):
                self._products[i] = product_data
                existing = True
                break
        if not existing:
            self._products.append(product_data)
        with open(self.data_path, "w", encoding="utf-8") as f:
            json.dump(self._products, f, indent=2, ensure_ascii=False)
        return product_data
