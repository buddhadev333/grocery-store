// Store Owner Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initSearchAndFilters();
  initLiveCalculator();
});

// Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

// Search and Table Filters
function initSearchAndFilters() {
  const searchInput = document.getElementById('adminSearchInput');
  const catFilter = document.getElementById('adminCategoryFilter');
  const rows = document.querySelectorAll('.pricing-row');

  function filterRows() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const cat = catFilter ? catFilter.value.toLowerCase() : 'all';

    rows.forEach(row => {
      const name = row.getAttribute('data-name').toLowerCase();
      const rowCat = row.getAttribute('data-category').toLowerCase();

      const matchesSearch = !query || name.includes(query);
      const matchesCat = cat === 'all' || rowCat === cat;

      if (matchesSearch && matchesCat) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  if (searchInput) searchInput.addEventListener('input', filterRows);
  if (catFilter) catFilter.addEventListener('change', filterRows);
}

// Live Discount & Savings Calculator
function initLiveCalculator() {
  const mrpInput = document.getElementById('editMrp');
  const sellingInput = document.getElementById('editSellingPrice');

  function updateCalc() {
    const mrp = parseFloat(mrpInput.value) || 0;
    const selling = parseFloat(sellingInput.value) || 0;

    const savings = Math.max(0, mrp - selling);
    const percent = mrp > 0 ? Math.round((savings / mrp) * 100) : 0;

    const previewEl = document.getElementById('calcSavingsPreview');
    if (previewEl) {
      previewEl.textContent = `You Save: ₹${savings.toFixed(2)} (${percent}% OFF)`;
    }
  }

  if (mrpInput && sellingInput) {
    mrpInput.addEventListener('input', updateCalc);
    sellingInput.addEventListener('input', updateCalc);
  }
}

// Open Price Edit Modal
function openEditPriceModal(productId) {
  const modal = document.getElementById('editPriceModal');
  if (!modal) return;

  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      if (data.product) {
        const p = data.product;
        const pr = p.pricing;

        document.getElementById('editProductId').value = p.id;
        document.getElementById('editProductName').textContent = p.name;
        document.getElementById('editProductPack').textContent = `${p.brand} • ${p.packSize} • ${p.category}`;
        document.getElementById('editMrp').value = pr.mrp;
        document.getElementById('editSellingPrice').value = pr.sellingPrice;

        // Badges checkboxes
        const allowedBadges = ["Best Price", "Today's Deal", "Great Value", "Special Offer"];
        allowedBadges.forEach(b => {
          const chk = document.getElementById(`badge_${b.replace(/[^a-zA-Z]/g, '')}`);
          if (chk) {
            chk.checked = pr.badges && pr.badges.includes(b);
          }
        });

        // Reference Prices
        const ref = pr.referencePrices || {};
        document.getElementById('editOnlineRef').value = ref.onlineMarketRef !== undefined ? ref.onlineMarketRef : '';
        document.getElementById('editLocalRef').value = ref.localStoreRef !== undefined ? ref.localStoreRef : '';

        // Scheduled sale inputs
        const sale = pr.scheduledSale || {};
        document.getElementById('editSalePrice').value = sale.salePrice || '';
        document.getElementById('editSaleName').value = sale.name || '';
        document.getElementById('editSaleActive').checked = sale.active || false;

        // Trigger live calc
        const mrpInput = document.getElementById('editMrp');
        mrpInput.dispatchEvent(new Event('input'));

        modal.classList.add('open');
      }
    })
    .catch(err => console.error("Error fetching product pricing:", err));
}

function closeEditPriceModal() {
  const modal = document.getElementById('editPriceModal');
  if (modal) modal.classList.remove('open');
}

// Save Product Price Changes
function saveProductPrice(e) {
  if (e) e.preventDefault();
  const productId = document.getElementById('editProductId').value;
  const mrp = parseFloat(document.getElementById('editMrp').value);
  const sellingPrice = parseFloat(document.getElementById('editSellingPrice').value);

  if (isNaN(mrp) || isNaN(sellingPrice)) {
    showToast("Please enter valid numerical prices.", "error");
    return;
  }

  // Gather Badges
  const badges = [];
  const allowedBadges = ["Best Price", "Today's Deal", "Great Value", "Special Offer"];
  allowedBadges.forEach(b => {
    const chk = document.getElementById(`badge_${b.replace(/[^a-zA-Z]/g, '')}`);
    if (chk && chk.checked) badges.push(b);
  });

  // Reference Prices
  const onlineRefVal = document.getElementById('editOnlineRef').value;
  const localRefVal = document.getElementById('editLocalRef').value;
  const referencePrices = {
    onlineMarketRef: onlineRefVal ? parseFloat(onlineRefVal) : null,
    localStoreRef: localRefVal ? parseFloat(localRefVal) : null,
    verified: false,
    sourceNote: "Admin manual benchmark entry"
  };

  // Scheduled Sale
  const salePriceVal = document.getElementById('editSalePrice').value;
  const saleNameVal = document.getElementById('editSaleName').value;
  const saleActive = document.getElementById('editSaleActive').checked;
  let scheduledSale = null;

  if (salePriceVal) {
    scheduledSale = {
      name: saleNameVal || "Special Sale",
      salePrice: parseFloat(salePriceVal),
      startDate: "2026-09-01T00:00:00Z",
      endDate: "2026-10-31T23:59:59Z",
      active: saleActive
    };
  }

  const payload = {
    mrp,
    sellingPrice,
    promotionalBadges: badges,
    referencePrices,
    scheduledSale
  };

  fetch(`/api/pricing/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showToast(`Error: ${data.error}`, "error");
      } else {
        showToast("Price updated successfully! Reloading live view...");
        closeEditPriceModal();
        setTimeout(() => window.location.reload(), 700);
      }
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to save price.", "error");
    });
}

// Category Rules Toggle
function toggleCategoryRule(ruleId) {
  fetch(`/api/pricing/category-rules/${ruleId}/toggle`, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      showToast("Category rule updated!");
      setTimeout(() => window.location.reload(), 600);
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to toggle rule", "error");
    });
}

// Add / Save Category Rule
function saveCategoryRule(e) {
  if (e) e.preventDefault();
  const category = document.getElementById('newRuleCategory').value;
  const discountPercent = parseFloat(document.getElementById('newRuleDiscount').value);
  const description = document.getElementById('newRuleDesc').value;

  if (!category || isNaN(discountPercent)) {
    showToast("Please select category and discount percent", "error");
    return;
  }

  fetch('/api/pricing/category-rules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, discountPercent, active: true, description })
  })
    .then(res => res.json())
    .then(data => {
      showToast("Category discount rule created!");
      setTimeout(() => window.location.reload(), 600);
    })
    .catch(err => {
      console.error(err);
      showToast("Failed to save category rule", "error");
    });
}

// Bulk Price Update
function applyBulkPriceUpdate(e) {
  if (e) e.preventDefault();
  const targetCategory = document.getElementById('bulkCategorySelect').value;
  const action = document.getElementById('bulkActionSelect').value;
  const value = parseFloat(document.getElementById('bulkValueInput').value);

  if (isNaN(value)) {
    showToast("Please enter a valid numeric value.", "error");
    return;
  }

  // Collect Product IDs
  const rows = document.querySelectorAll('.pricing-row');
  const productIds = [];
  rows.forEach(row => {
    const cat = row.getAttribute('data-category');
    if (targetCategory === 'all' || cat === targetCategory) {
      productIds.push(row.getAttribute('data-id'));
    }
  });

  if (productIds.length === 0) {
    showToast("No matching products found for bulk update.", "error");
    return;
  }

  fetch('/api/pricing/bulk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds, action, value })
  })
    .then(res => res.json())
    .then(data => {
      showToast(`Bulk updated ${data.updatedCount} products!`);
      setTimeout(() => window.location.reload(), 700);
    })
    .catch(err => {
      console.error(err);
      showToast("Bulk update failed.", "error");
    });
}

// Export Pricing Data
function exportPricingData() {
  fetch('/api/pricing/export')
    .then(res => res.json())
    .then(data => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fresh_nest_pricing_${new Date().toISOString().slice(0,10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast("Pricing data exported successfully!");
    })
    .catch(err => showToast("Export failed.", "error"));
}

// Import Pricing Data
function triggerImportPricing() {
  const fileInput = document.getElementById('importPricingFile');
  if (fileInput) fileInput.click();
}

function handlePricingFileSelected(input) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      fetch('/api/pricing/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(resData => {
          showToast(`Imported pricing for ${resData.count} products!`);
          setTimeout(() => window.location.reload(), 800);
        });
    } catch (err) {
      showToast("Invalid JSON file.", "error");
    }
  };
  reader.readAsText(file);
}

// Toast notification helper
function showToast(message, type = "success") {
  let toast = document.getElementById('adminToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'adminToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.background = type === "error" ? "#dc2626" : "#0f172a";
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}
