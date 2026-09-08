import os
import unittest
import json
import tempfile
from datetime import datetime, timezone, timedelta
from services.pricing_engine import PricingEngine
from services.product_service import ProductService

class TestPricingEngine(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.pricing_file = os.path.join(self.temp_dir.name, "pricing.json")
        self.rules_file = os.path.join(self.temp_dir.name, "category_rules.json")

        # Initial test pricing
        initial_pricing = {
            "pricing": {
                "prod_test_1": {
                    "productId": "prod_test_1",
                    "mrp": 650,
                    "sellingPrice": 599,
                    "promotionalBadges": ["Best Price"],
                    "scheduledSale": None,
                    "referencePrices": {
                        "onlineMarketRef": 610,
                        "localStoreRef": 620
                    }
                }
            }
        }
        with open(self.pricing_file, "w", encoding="utf-8") as f:
            json.dump(initial_pricing, f)

        with open(self.rules_file, "w", encoding="utf-8") as f:
            json.dump({"rules": []}, f)

        self.engine = PricingEngine(self.pricing_file, self.rules_file)

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_pricing_calculation_and_savings(self):
        # MRP: 650, Selling Price: 599 -> Savings: 51, Discount: 8%
        info = self.engine.calculate_price_info("prod_test_1")
        self.assertEqual(info["mrp"], 650.0)
        self.assertEqual(info["sellingPrice"], 599.0)
        self.assertEqual(info["effectivePrice"], 599.0)
        self.assertEqual(info["savingsAmount"], 51.0)
        self.assertEqual(info["discountPercent"], 8)
        self.assertIn("Best Price", info["badges"])

    def test_scheduled_sale_activation(self):
        now = datetime.now(timezone.utc)
        yesterday = (now - timedelta(days=1)).isoformat()
        tomorrow = (now + timedelta(days=1)).isoformat()

        # Update with active scheduled sale
        self.engine.update_product_pricing(
            product_id="prod_test_1",
            mrp=650,
            selling_price=599,
            promotional_badges=["Best Price"],
            scheduled_sale={
                "name": "Weekend Bonanza",
                "salePrice": 575,
                "startDate": yesterday,
                "endDate": tomorrow,
                "active": True
            }
        )

        info = self.engine.calculate_price_info("prod_test_1", now=now)
        self.assertEqual(info["effectivePrice"], 575.0)
        self.assertEqual(info["savingsAmount"], 75.0)
        self.assertEqual(info["discountPercent"], 12) # 75 / 650 = 11.53% -> 12%
        self.assertTrue(info["hasActiveSale"])
        self.assertIn("Today's Deal", info["badges"])

    def test_scheduled_sale_expiration(self):
        now = datetime.now(timezone.utc)
        past_start = (now - timedelta(days=5)).isoformat()
        past_end = (now - timedelta(days=1)).isoformat()

        self.engine.update_product_pricing(
            product_id="prod_test_1",
            mrp=650,
            selling_price=599,
            promotional_badges=["Best Price"],
            scheduled_sale={
                "name": "Expired Deal",
                "salePrice": 550,
                "startDate": past_start,
                "endDate": past_end,
                "active": True
            }
        )

        info = self.engine.calculate_price_info("prod_test_1", now=now)
        # Should fallback to standard selling price
        self.assertEqual(info["effectivePrice"], 599.0)
        self.assertFalse(info["hasActiveSale"])

    def test_category_rule_discount(self):
        # Set a 10% discount rule for "Staples & Grains"
        self.engine.set_category_rule("Staples & Grains", 10.0, active=True)
        # MRP 650 * 0.90 = 585 < standard selling 599
        info = self.engine.calculate_price_info("prod_test_1", category="Staples & Grains")
        self.assertEqual(info["effectivePrice"], 585.0)
        self.assertEqual(info["savingsAmount"], 65.0)
        self.assertEqual(info["discountPercent"], 10)

    def test_competitive_intelligence_evaluation(self):
        product = {
            "id": "prod_test_1",
            "name": "Basmati Rice 5kg",
            "category": "Staples & Grains"
        }
        info = self.engine.calculate_price_info("prod_test_1")
        intel = self.engine.evaluate_competitive_intelligence(product, info)
        
        # FRESH NEST: 599 vs Online: 610, Local: 620
        self.assertEqual(intel["status"], "BEATING_MARKET")
        self.assertEqual(intel["diffVsOnline"], -11.0)
        self.assertEqual(intel["diffVsLocal"], -21.0)
        self.assertIn("lower than the cheapest market reference", intel["recommendation"])

    def test_rejection_of_forbidden_unverified_claims(self):
        # Test that forbidden phrases cannot be injected
        badges = [
            "Cheaper than Amazon",
            "Lowest price in India",
            "Guaranteed cheapest",
            "Best Price",
            "Today's Deal"
        ]
        cleaned = self.engine.validate_badges(badges)
        self.assertNotIn("Cheaper than Amazon", cleaned)
        self.assertNotIn("Lowest price in India", cleaned)
        self.assertNotIn("Guaranteed cheapest", cleaned)
        self.assertIn("Best Price", cleaned)
        self.assertIn("Today's Deal", cleaned)

    def test_bulk_update_percentage_off_mrp(self):
        self.engine.bulk_update_prices(["prod_test_1"], "percent_off_mrp", 15.0)
        info = self.engine.calculate_price_info("prod_test_1")
        # 650 * 0.85 = 552.5
        self.assertEqual(info["sellingPrice"], 552.5)
        self.assertEqual(info["savingsAmount"], 97.5)

if __name__ == "__main__":
    unittest.main()
