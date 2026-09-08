import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_all():
    print("Testing Customer Storefront / ...")
    r = requests.get(f"{BASE_URL}/")
    assert r.status_code == 200
    assert "FRESH NEST" in r.text
    assert "₹599" in r.text
    assert "8% OFF" in r.text
    print("  Storefront OK.")

    print("Testing /api/products ...")
    r = requests.get(f"{BASE_URL}/api/products")
    assert r.status_code == 200
    data = r.json()
    assert "products" in data
    assert len(data["products"]) >= 20
    first_prod = data["products"][0]
    assert first_prod["pricing"]["mrp"] == 650
    assert first_prod["pricing"]["effectivePrice"] == 599
    assert first_prod["pricing"]["savingsAmount"] == 51
    assert first_prod["pricing"]["discountPercent"] == 8
    print("  /api/products OK.")

    print("Testing Admin Dashboard /admin ...")
    r = requests.get(f"{BASE_URL}/admin")
    assert r.status_code == 200
    assert "Competitive Pricing Intelligence" in r.text
    print("  /admin OK.")

    print("Testing /api/pricing/competitive-analysis ...")
    r = requests.get(f"{BASE_URL}/api/pricing/competitive-analysis")
    assert r.status_code == 200
    intel = r.json()
    assert "analysis" in intel
    assert len(intel["analysis"]) >= 20
    rice_intel = next(i for i in intel["analysis"] if i["productId"] == "prod_001")
    assert rice_intel["status"] == "BEATING_MARKET"
    assert rice_intel["diffVsOnline"] == -11.0
    assert rice_intel["diffVsLocal"] == -21.0
    print("  Competitive analysis OK.")

    print("Testing updating price via /api/pricing/prod_001 ...")
    update_payload = {
        "mrp": 650,
        "sellingPrice": 589,
        "promotionalBadges": ["Best Price", "Great Value"],
        "referencePrices": {
            "onlineMarketRef": 610,
            "localStoreRef": 620,
            "verified": False,
            "sourceNote": "Updated benchmark"
        }
    }
    r = requests.post(f"{BASE_URL}/api/pricing/prod_001", json=update_payload)
    assert r.status_code == 200
    res_data = r.json()
    assert res_data["calculated"]["effectivePrice"] == 589
    assert res_data["calculated"]["savingsAmount"] == 61
    assert res_data["calculated"]["discountPercent"] == 9
    print("  Price update OK.")

    # Revert prod_001 back to 599 for consistency
    revert_payload = {
        "mrp": 650,
        "sellingPrice": 599,
        "promotionalBadges": ["Best Price"],
        "referencePrices": {
            "onlineMarketRef": 610,
            "localStoreRef": 620,
            "verified": False,
            "sourceNote": "Neighborhood supermarket weekly survey"
        }
    }
    r = requests.post(f"{BASE_URL}/api/pricing/prod_001", json=revert_payload)
    assert r.status_code == 200
    assert r.json()["calculated"]["effectivePrice"] == 599
    print("  Reverted back to baseline 599 OK.")

    print("Testing Connector status /api/connector/status ...")
    r = requests.get(f"{BASE_URL}/api/connector/status")
    assert r.status_code == 200
    assert "provider" in r.json()
    print("  Connector status OK.")

    print("\nALL SYSTEM VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
