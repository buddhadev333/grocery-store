import json
import os
import re
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple, Any

FORBIDDEN_PHRASES = [
    "cheaper than amazon",
    "cheaper than flipkart",
    "lowest price in india",
    "guaranteed cheapest",
    "cheapest anywhere",
    "beat any price",
    "unbeatable price in india"
]

ALLOWED_BADGES = [
    "Best Price",
    "Today's Deal",
    "Great Value",
    "Special Offer"
]

class PricingEngine:
    def __init__(self, pricing_path: str, rules_path: str):
        self.pricing_path = pricing_path
        self.rules_path = rules_path
        self._pricing: Dict[str, Dict] = {}
        self._rules: List[Dict] = []
        self.load()

    def load(self):
        if os.path.exists(self.pricing_path):
            with open(self.pricing_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._pricing = data.get("pricing", {})
        else:
            self._pricing = {}

        if os.path.exists(self.rules_path):
            with open(self.rules_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self._rules = data.get("rules", [])
        else:
            self._rules = []

    def save_pricing(self):
        with open(self.pricing_path, "w", encoding="utf-8") as f:
            json.dump({"pricing": self._pricing}, f, indent=2, ensure_ascii=False)

    def save_rules(self):
        with open(self.rules_path, "w", encoding="utf-8") as f:
            json.dump({"rules": self._rules}, f, indent=2, ensure_ascii=False)

    def validate_badges(self, badges: List[str]) -> List[str]:
        cleaned = []
        for badge in badges:
            b_lower = badge.strip().lower()
            # Reject forbidden phrases
            if any(forbidden in b_lower for forbidden in FORBIDDEN_PHRASES):
                continue
            # Match against allowed neutral badges or clean custom neutral badge
            matched = False
            for allowed in ALLOWED_BADGES:
                if b_lower == allowed.lower():
                    cleaned.append(allowed)
                    matched = True
                    break
            if not matched and badge.strip():
                # Clean and keep neutral custom tag if it doesn't make exaggerated claims
                cleaned.append(badge.strip())
        return list(dict.fromkeys(cleaned))

    def _is_sale_active(self, scheduled_sale: Optional[Dict], now: Optional[datetime] = None) -> bool:
        if not scheduled_sale or not scheduled_sale.get("active", False):
            return False
        if now is None:
            now = datetime.now(timezone.utc)
        
        start_str = scheduled_sale.get("startDate")
        end_str = scheduled_sale.get("endDate")
        
        if not start_str or not end_str:
            return scheduled_sale.get("active", False)
            
        try:
            # Handle ISO timestamps
            start_dt = datetime.fromisoformat(start_str.replace("Z", "+00:00"))
            end_dt = datetime.fromisoformat(end_str.replace("Z", "+00:00"))
            return start_dt <= now <= end_dt
        except Exception:
            return scheduled_sale.get("active", False)

    def calculate_price_info(self, product_id: str, category: Optional[str] = None, now: Optional[datetime] = None) -> Dict[str, Any]:
        """
        Calculates effective selling price, MRP, discount percentage, savings amount,
        and active badges for a product.
        """
        self.load()
        price_record = self._pricing.get(product_id)
        if not price_record:
            return {
                "productId": product_id,
                "mrp": 0,
                "sellingPrice": 0,
                "effectivePrice": 0,
                "savingsAmount": 0,
                "discountPercent": 0,
                "badges": [],
                "hasActiveSale": False,
                "saleName": None,
                "isCompetitive": False,
                "referencePrices": {}
            }

        mrp = float(price_record.get("mrp", 0))
        standard_selling = float(price_record.get("sellingPrice", mrp))
        effective_price = standard_selling
        badges = list(price_record.get("promotionalBadges", []))
        has_active_sale = False
        sale_name = None

        # 1. Check Scheduled Sale
        scheduled = price_record.get("scheduledSale")
        if self._is_sale_active(scheduled, now):
            sale_price = float(scheduled.get("salePrice", standard_selling))
            if sale_price < effective_price:
                effective_price = sale_price
                has_active_sale = True
                sale_name = scheduled.get("name", "Flash Sale")
                if "Today's Deal" not in badges:
                    badges.append("Today's Deal")

        # 2. Check Category-Level Rule if category provided
        if category:
            cat_rule = next((r for r in self._rules if r.get("category", "").lower() == category.lower() and r.get("active", False)), None)
            if cat_rule:
                cat_disc = float(cat_rule.get("discountPercent", 0))
                if cat_disc > 0 and mrp > 0:
                    cat_price = round(mrp * (1 - (cat_disc / 100.0)), 2)
                    if cat_price < effective_price:
                        effective_price = cat_price
                        if "Special Offer" not in badges:
                            badges.append("Special Offer")

        # Sanitize effective price
        effective_price = max(1.0, round(effective_price, 2))
        mrp = max(effective_price, round(mrp, 2))
        savings_amount = round(mrp - effective_price, 2)
        discount_percent = int(round((savings_amount / mrp) * 100)) if mrp > 0 else 0

        # Validate badges to ensure no fake claims
        clean_badges = self.validate_badges(badges)

        return {
            "productId": product_id,
            "mrp": mrp,
            "sellingPrice": standard_selling,
            "effectivePrice": effective_price,
            "savingsAmount": savings_amount,
            "discountPercent": discount_percent,
            "badges": clean_badges,
            "hasActiveSale": has_active_sale,
            "saleName": sale_name,
            "referencePrices": price_record.get("referencePrices", {}),
            "updatedAt": price_record.get("updatedAt")
        }

    def update_product_pricing(
        self,
        product_id: str,
        mrp: float,
        selling_price: float,
        promotional_badges: Optional[List[str]] = None,
        reference_prices: Optional[Dict] = None,
        scheduled_sale: Optional[Dict] = None
    ) -> Dict[str, Any]:
        """
        Updates pricing details for a single product without modifying product catalog metadata.
        """
        self.load()
        existing = self._pricing.get(product_id, {
            "productId": product_id,
            "promotionalBadges": [],
            "referencePrices": {},
            "scheduledSale": None
        })

        clean_badges = self.validate_badges(promotional_badges if promotional_badges is not None else existing.get("promotionalBadges", []))

        updated_record = {
            "productId": product_id,
            "mrp": round(float(mrp), 2),
            "sellingPrice": round(float(selling_price), 2),
            "promotionalBadges": clean_badges,
            "scheduledSale": scheduled_sale if scheduled_sale is not None else existing.get("scheduledSale"),
            "referencePrices": reference_prices if reference_prices is not None else existing.get("referencePrices", {}),
            "updatedAt": datetime.now(timezone.utc).isoformat()
        }

        self._pricing[product_id] = updated_record
        self.save_pricing()
        return updated_record

    def evaluate_competitive_intelligence(self, product: Dict, pricing_info: Dict) -> Dict[str, Any]:
        """
        Analyzes FRESH NEST price against internal benchmarks (Online Reference & Local Store Reference).
        Generates guidance for store owner to ensure prices feel affordable and competitive.
        """
        selling = pricing_info["effectivePrice"]
        mrp = pricing_info["mrp"]
        ref = pricing_info.get("referencePrices", {})
        
        online_ref = ref.get("onlineMarketRef")
        local_ref = ref.get("localStoreRef")

        analysis = {
            "productId": product.get("id"),
            "productName": product.get("name"),
            "packSize": product.get("packSize"),
            "category": product.get("category"),
            "mrp": mrp,
            "freshNestPrice": selling,
            "onlineMarketRef": online_ref,
            "localStoreRef": local_ref,
            "diffVsOnline": round(selling - online_ref, 2) if online_ref is not None else None,
            "diffVsLocal": round(selling - local_ref, 2) if local_ref is not None else None,
            "status": "UNBENCHMARKED",
            "statusLabel": "No Reference Data",
            "statusClass": "badge-neutral",
            "recommendation": "Add reference prices to evaluate competitive standing."
        }

        if online_ref is not None and local_ref is not None:
            min_ref = min(online_ref, local_ref)
            avg_ref = round((online_ref + local_ref) / 2.0, 2)
            max_ref = max(online_ref, local_ref)

            if selling < min_ref:
                analysis["status"] = "BEATING_MARKET"
                analysis["statusLabel"] = "Highly Competitive (Beats Both)"
                analysis["statusClass"] = "badge-success"
                diff = round(min_ref - selling, 2)
                analysis["recommendation"] = f"Great position! Price is ₹{diff} lower than the cheapest market reference. Fosters strong customer trust."
            elif selling == min_ref:
                analysis["status"] = "BEST_MARKET_MATCH"
                analysis["statusLabel"] = "Matches Lowest Benchmark"
                analysis["statusClass"] = "badge-success"
                analysis["recommendation"] = "Matched to the most competitive benchmark. Perfect for staple essentials."
            elif selling <= avg_ref:
                analysis["status"] = "COMPETITIVE"
                analysis["statusLabel"] = "Fair & Competitive"
                analysis["statusClass"] = "badge-info"
                analysis["recommendation"] = f"Price is below the market average (₹{avg_ref}). Healthy balance of margin and value."
            elif selling <= max_ref:
                analysis["status"] = "SLIGHTLY_ABOVE_CHEAPEST"
                analysis["statusLabel"] = "Moderate"
                analysis["statusClass"] = "badge-warning"
                target_match = min_ref
                analysis["recommendation"] = f"Price is above the lowest reference (₹{min_ref}). Consider matching ₹{target_match} if this is a high-volume traffic driver."
            else:
                analysis["status"] = "ABOVE_MARKET"
                analysis["statusLabel"] = "Higher Than Reference"
                analysis["statusClass"] = "badge-danger"
                excess = round(selling - avg_ref, 2)
                analysis["recommendation"] = f"Warning: Price is ₹{excess} above market average. Review to avoid appearing overpriced."
        elif online_ref is not None:
            diff = round(selling - online_ref, 2)
            if diff < 0:
                analysis["status"] = "BEATING_ONLINE"
                analysis["statusLabel"] = "Beats Online Market"
                analysis["statusClass"] = "badge-success"
                analysis["recommendation"] = f"Price is ₹{abs(diff)} below online reference. Great customer appeal."
            elif diff == 0:
                analysis["status"] = "ONLINE_PARITY"
                analysis["statusLabel"] = "Online Parity"
                analysis["statusClass"] = "badge-info"
                analysis["recommendation"] = "Matches online market reference price."
            else:
                analysis["status"] = "ABOVE_ONLINE"
                analysis["statusLabel"] = "Above Online Benchmark"
                analysis["statusClass"] = "badge-warning"
                analysis["recommendation"] = f"Price is ₹{diff} above online reference. Adjust toward ₹{online_ref} to stay competitive."
        elif local_ref is not None:
            diff = round(selling - local_ref, 2)
            if diff < 0:
                analysis["status"] = "BEATING_LOCAL"
                analysis["statusLabel"] = "Beats Local Kirana/Supermarket"
                analysis["statusClass"] = "badge-success"
                analysis["recommendation"] = f"Price is ₹{abs(diff)} below local store benchmark."
            else:
                analysis["status"] = "ABOVE_LOCAL"
                analysis["statusLabel"] = "Above Local Store"
                analysis["statusClass"] = "badge-warning"
                analysis["recommendation"] = f"Price is ₹{diff} above local store benchmark."

        return analysis

    def bulk_update_prices(
        self,
        product_ids: List[str],
        action: str,
        value: float
    ) -> List[Dict]:
        """
        Bulk updates prices for specified product IDs.
        action:
          - "percent_off_mrp": sets selling price to (1 - value/100) * MRP
          - "percent_change_selling": adjusts selling price by +value% or -value%
          - "flat_discount_off_mrp": sets selling price to MRP - value
        """
        self.load()
        updated = []
        for pid in product_ids:
            if pid in self._pricing:
                rec = self._pricing[pid]
                mrp = float(rec.get("mrp", 0))
                current_selling = float(rec.get("sellingPrice", mrp))
                
                new_selling = current_selling
                if action == "percent_off_mrp" and mrp > 0:
                    new_selling = round(mrp * (1 - (value / 100.0)), 2)
                elif action == "percent_change_selling":
                    new_selling = round(current_selling * (1 + (value / 100.0)), 2)
                elif action == "flat_discount_off_mrp" and mrp > 0:
                    new_selling = max(1.0, round(mrp - value, 2))

                # Ensure selling price doesn't exceed MRP
                if new_selling > mrp and mrp > 0:
                    new_selling = mrp
                new_selling = max(1.0, new_selling)

                rec["sellingPrice"] = new_selling
                rec["updatedAt"] = datetime.now(timezone.utc).isoformat()
                self._pricing[pid] = rec
                updated.append(rec)

        self.save_pricing()
        return updated

    def get_category_rules(self) -> List[Dict]:
        self.load()
        return self._rules

    def set_category_rule(self, category: str, discount_percent: float, active: bool, description: str = "") -> Dict:
        self.load()
        rule = next((r for r in self._rules if r.get("category", "").lower() == category.lower()), None)
        if not rule:
            rule = {
                "id": f"rule_{len(self._rules) + 1}",
                "category": category,
                "discountPercent": discount_percent,
                "active": active,
                "description": description,
                "updatedAt": datetime.now(timezone.utc).isoformat()
            }
            self._rules.append(rule)
        else:
            rule["discountPercent"] = discount_percent
            rule["active"] = active
            if description:
                rule["description"] = description
            rule["updatedAt"] = datetime.now(timezone.utc).isoformat()
            
        self.save_rules()
        return rule

    def toggle_category_rule(self, rule_id: str) -> Optional[Dict]:
        self.load()
        rule = next((r for r in self._rules if r.get("id") == rule_id), None)
        if rule:
            rule["active"] = not rule.get("active", False)
            rule["updatedAt"] = datetime.now(timezone.utc).isoformat()
            self.save_rules()
            return rule
        return None

    def export_pricing(self) -> Dict:
        self.load()
        return {
            "exportedAt": datetime.now(timezone.utc).isoformat(),
            "pricing": self._pricing,
            "rules": self._rules
        }

    def import_pricing(self, import_data: Dict) -> int:
        imported_pricing = import_data.get("pricing", {})
        count = 0
        if isinstance(imported_pricing, dict):
            for pid, pdata in imported_pricing.items():
                if "mrp" in pdata and "sellingPrice" in pdata:
                    self._pricing[pid] = pdata
                    count += 1
            self.save_pricing()

        if "rules" in import_data and isinstance(import_data["rules"], list):
            self._rules = import_data["rules"]
            self.save_rules()

        return count
