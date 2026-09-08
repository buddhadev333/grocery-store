import os
from flask import Flask, render_template, request, jsonify, send_file
from config import PRODUCTS_FILE, PRICING_FILE, CATEGORY_RULES_FILE, SECRET_KEY, DEBUG
from services.product_service import ProductService
from services.pricing_engine import PricingEngine, ALLOWED_BADGES
from services.api_connector import ExternalApiPricingProvider

app = Flask(__name__)
app.secret_key = SECRET_KEY

# Initialize decoupled services
product_service = ProductService(PRODUCTS_FILE)
pricing_engine = PricingEngine(PRICING_FILE, CATEGORY_RULES_FILE)
api_connector = ExternalApiPricingProvider()

@app.context_processor
def inject_globals():
    return {
        "store_name": "FRESH NEST",
        "store_tagline": "Honest & Affordable Neighborhood Groceries",
        "currency_symbol": "₹",
        "allowed_badges": ALLOWED_BADGES
    }

# ==========================================
# CUSTOMER STOREFRONT ROUTES
# ==========================================

@app.route("/")
def index():
    categories = product_service.get_categories()
    products_raw = product_service.get_all()
    
    # Enrich products with live evaluated pricing
    products = []
    for p in products_raw:
        price_info = pricing_engine.calculate_price_info(p["id"], category=p.get("category"))
        products.append({
            **p,
            "pricing": price_info
        })
        
    rules = [r for r in pricing_engine.get_category_rules() if r.get("active", False)]
    return render_template("index.html", products=products, categories=categories, active_rules=rules)

@app.route("/api/products", methods=["GET"])
def api_get_products():
    category = request.args.get("category")
    search = request.args.get("search")
    products_raw = product_service.get_all(category=category, search=search)
    
    enriched = []
    for p in products_raw:
        price_info = pricing_engine.calculate_price_info(p["id"], category=p.get("category"))
        enriched.append({
            **p,
            "pricing": price_info
        })
    return jsonify({"products": enriched, "count": len(enriched)})

@app.route("/api/products/<product_id>", methods=["GET"])
def api_get_product(product_id):
    product = product_service.get_by_id(product_id)
    if not product:
        return jsonify({"error": "Product not found"}), 404
    price_info = pricing_engine.calculate_price_info(product_id, category=product.get("category"))
    return jsonify({
        "product": {
            **product,
            "pricing": price_info
        }
    })

# ==========================================
# STORE OWNER ADMIN DASHBOARD ROUTES
# ==========================================

@app.route("/admin")
def admin_dashboard():
    categories = product_service.get_categories()
    products_raw = product_service.get_all()
    
    products = []
    competitive_summary = {
        "beating_market": 0,
        "competitive": 0,
        "above_market": 0,
        "unbenchmarked": 0
    }
    
    for p in products_raw:
        price_info = pricing_engine.calculate_price_info(p["id"], category=p.get("category"))
        intel = pricing_engine.evaluate_competitive_intelligence(p, price_info)
        
        status = intel.get("status")
        if status in ["BEATING_MARKET", "BEST_MARKET_MATCH", "BEATING_ONLINE", "BEATING_LOCAL"]:
            competitive_summary["beating_market"] += 1
        elif status in ["COMPETITIVE", "ONLINE_PARITY"]:
            competitive_summary["competitive"] += 1
        elif status in ["ABOVE_MARKET", "ABOVE_ONLINE", "ABOVE_LOCAL", "SLIGHTLY_ABOVE_CHEAPEST"]:
            competitive_summary["above_market"] += 1
        else:
            competitive_summary["unbenchmarked"] += 1
            
        products.append({
            **p,
            "pricing": price_info,
            "competitive": intel
        })
        
    category_rules = pricing_engine.get_category_rules()
    connector_status = api_connector.get_status()
    
    return render_template(
        "admin.html",
        products=products,
        categories=categories,
        category_rules=category_rules,
        competitive_summary=competitive_summary,
        connector_status=connector_status,
        allowed_badges=ALLOWED_BADGES
    )

@app.route("/api/pricing", methods=["GET"])
def api_get_all_pricing():
    pricing_engine.load()
    return jsonify({
        "pricing": pricing_engine._pricing,
        "rules": pricing_engine._rules
    })

@app.route("/api/pricing/<product_id>", methods=["PUT", "POST"])
def api_update_product_pricing(product_id):
    data = request.get_json() or {}
    mrp = data.get("mrp")
    selling_price = data.get("sellingPrice")
    
    if mrp is None or selling_price is None:
        return jsonify({"error": "mrp and sellingPrice are required"}), 400
        
    try:
        mrp = float(mrp)
        selling_price = float(selling_price)
    except ValueError:
        return jsonify({"error": "mrp and sellingPrice must be valid numbers"}), 400

    promotional_badges = data.get("promotionalBadges")
    reference_prices = data.get("referencePrices")
    scheduled_sale = data.get("scheduledSale")
    
    updated = pricing_engine.update_product_pricing(
        product_id=product_id,
        mrp=mrp,
        selling_price=selling_price,
        promotional_badges=promotional_badges,
        reference_prices=reference_prices,
        scheduled_sale=scheduled_sale
    )
    
    # Return newly calculated price info
    product = product_service.get_by_id(product_id)
    cat = product.get("category") if product else None
    info = pricing_engine.calculate_price_info(product_id, category=cat)
    
    return jsonify({
        "message": f"Pricing updated for {product_id}",
        "pricing": updated,
        "calculated": info
    })

@app.route("/api/pricing/bulk", methods=["POST"])
def api_bulk_update_pricing():
    data = request.get_json() or {}
    product_ids = data.get("productIds", [])
    action = data.get("action")
    value = data.get("value")
    
    if not product_ids:
        return jsonify({"error": "No product IDs specified"}), 400
    if not action or value is None:
        return jsonify({"error": "Action and value are required"}), 400
        
    try:
        value = float(value)
    except ValueError:
        return jsonify({"error": "Value must be numeric"}), 400
        
    updated = pricing_engine.bulk_update_prices(product_ids, action, value)
    return jsonify({
        "message": f"Successfully updated pricing for {len(updated)} products",
        "updatedCount": len(updated)
    })

@app.route("/api/pricing/competitive-analysis", methods=["GET"])
def api_competitive_analysis():
    products_raw = product_service.get_all()
    analysis_list = []
    
    for p in products_raw:
        info = pricing_engine.calculate_price_info(p["id"], category=p.get("category"))
        intel = pricing_engine.evaluate_competitive_intelligence(p, info)
        analysis_list.append(intel)
        
    return jsonify({
        "analysis": analysis_list,
        "count": len(analysis_list)
    })

@app.route("/api/pricing/category-rules", methods=["POST"])
def api_save_category_rule():
    data = request.get_json() or {}
    category = data.get("category")
    discount_percent = data.get("discountPercent")
    active = data.get("active", True)
    description = data.get("description", "")
    
    if not category or discount_percent is None:
        return jsonify({"error": "Category and discountPercent are required"}), 400
        
    try:
        discount_percent = float(discount_percent)
    except ValueError:
        return jsonify({"error": "discountPercent must be numeric"}), 400
        
    rule = pricing_engine.set_category_rule(category, discount_percent, active, description)
    return jsonify({
        "message": f"Rule saved for category: {category}",
        "rule": rule
    })

@app.route("/api/pricing/category-rules/<rule_id>/toggle", methods=["POST"])
def api_toggle_category_rule(rule_id):
    rule = pricing_engine.toggle_category_rule(rule_id)
    if not rule:
        return jsonify({"error": "Rule not found"}), 404
    return jsonify({
        "message": f"Rule {rule_id} status updated",
        "rule": rule
    })

@app.route("/api/pricing/export", methods=["GET"])
def api_export_pricing():
    data = pricing_engine.export_pricing()
    return jsonify(data)

@app.route("/api/pricing/import", methods=["POST"])
def api_import_pricing():
    data = request.get_json() or {}
    count = pricing_engine.import_pricing(data)
    return jsonify({
        "message": f"Successfully imported pricing for {count} products",
        "count": count
    })

@app.route("/api/connector/status", methods=["GET"])
def api_connector_status():
    return jsonify(api_connector.get_status())

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=DEBUG)
