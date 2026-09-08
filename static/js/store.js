// Customer Storefront JavaScript
let cart = {};

document.addEventListener('DOMContentLoaded', () => {
  initCategoryFilters();
  initSearch();
  initCart();
});

// Category Filter Handling
function initCategoryFilters() {
  const chips = document.querySelectorAll('.category-chip');
  const cards = document.querySelectorAll('.product-card');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      const selectedCat = chip.getAttribute('data-category');
      cards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (selectedCat === 'all' || cardCat === selectedCat) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// Live Search Filter
function initSearch() {
  const searchInput = document.getElementById('storeSearchInput');
  if (!searchInput) return;

  const cards = document.querySelectorAll('.product-card');

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
      const title = card.querySelector('.card-title').textContent.toLowerCase();
      const pack = card.querySelector('.card-pack').textContent.toLowerCase();
      const cat = card.getAttribute('data-category').toLowerCase();

      if (!query || title.includes(query) || pack.includes(query) || cat.includes(query)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  });
}

// Product Details Modal
function openProductModal(productId) {
  const modal = document.getElementById('productDetailModal');
  if (!modal) return;

  // Fetch latest live calculated pricing
  fetch(`/api/products/${productId}`)
    .then(res => res.json())
    .then(data => {
      if (data.product) {
        const p = data.product;
        const pr = p.pricing;

        document.getElementById('modalProdTitle').textContent = p.name;
        document.getElementById('modalProdMeta').textContent = `${p.brand} • ${p.packSize} • ${p.category}`;
        document.getElementById('modalProdDesc').textContent = p.description;
        document.getElementById('modalProdImage').src = p.imageUrl;
        
        // Exact user requested price display format
        document.getElementById('modalSellingPrice').textContent = `₹${pr.effectivePrice}`;
        document.getElementById('modalMrpPrice').textContent = `₹${pr.mrp}`;
        document.getElementById('modalSavings').textContent = `₹${pr.savingsAmount} (${pr.discountPercent}% OFF)`;

        // Badges
        const badgeContainer = document.getElementById('modalBadges');
        badgeContainer.innerHTML = '';
        if (pr.badges && pr.badges.length > 0) {
          pr.badges.forEach(b => {
            const badgeSpan = document.createElement('span');
            badgeSpan.className = `badge ${getBadgeClass(b)}`;
            badgeSpan.textContent = b;
            badgeContainer.appendChild(badgeSpan);
          });
        }

        // Add to cart button binding
        const addBtn = document.getElementById('modalAddToCartBtn');
        addBtn.onclick = () => {
          addToCart(p.id, p.name, pr.effectivePrice, pr.mrp);
          closeProductModal();
        };

        modal.classList.add('open');
      }
    })
    .catch(err => console.error("Error loading product detail:", err));
}

function closeProductModal() {
  const modal = document.getElementById('productDetailModal');
  if (modal) modal.classList.remove('open');
}

function getBadgeClass(badge) {
  const b = badge.toLowerCase();
  if (b.includes('best')) return 'badge-best-price';
  if (b.includes('deal')) return 'badge-todays-deal';
  if (b.includes('special')) return 'badge-special-offer';
  return 'badge-great-value';
}

// Cart Functionality
function initCart() {
  const cartBtn = document.getElementById('cartToggleBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartClose = document.getElementById('cartCloseBtn');

  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', () => cartDrawer.classList.add('open'));
  }
  if (cartClose && cartDrawer) {
    cartClose.addEventListener('click', () => cartDrawer.classList.remove('open'));
  }
}

function addToCart(id, name, price, mrp) {
  if (cart[id]) {
    cart[id].qty += 1;
  } else {
    cart[id] = {
      id,
      name,
      price: Number(price),
      mrp: Number(mrp),
      qty: 1
    };
  }
  updateCartUI();
  
  // Open cart drawer briefly
  const cartDrawer = document.getElementById('cartDrawer');
  if (cartDrawer) cartDrawer.classList.add('open');
}

function updateCartQty(id, delta) {
  if (!cart[id]) return;
  cart[id].qty += delta;
  if (cart[id].qty <= 0) {
    delete cart[id];
  }
  updateCartUI();
}

function updateCartUI() {
  const countEl = document.getElementById('navCartCount');
  const itemsContainer = document.getElementById('cartItemsList');
  const mrpTotalEl = document.getElementById('cartMrpTotal');
  const finalTotalEl = document.getElementById('cartFinalTotal');
  const savingsBannerEl = document.getElementById('cartSavingsBanner');
  const savingsAmountEl = document.getElementById('cartTotalSavings');

  const items = Object.values(cart);
  const totalCount = items.reduce((acc, item) => acc + item.qty, 0);
  if (countEl) countEl.textContent = totalCount;

  if (!itemsContainer) return;

  if (items.length === 0) {
    itemsContainer.innerHTML = '<div style="text-align:center; padding: 40px 0; color: #64748b;">Your basket is empty.<br>Add items to see your savings!</div>';
    if (mrpTotalEl) mrpTotalEl.textContent = '₹0';
    if (finalTotalEl) finalTotalEl.textContent = '₹0';
    if (savingsBannerEl) savingsBannerEl.style.display = 'none';
    return;
  }

  let totalMrp = 0;
  let totalSelling = 0;

  itemsContainer.innerHTML = '';
  items.forEach(item => {
    const itemTotalMrp = item.mrp * item.qty;
    const itemTotalSelling = item.price * item.qty;
    totalMrp += itemTotalMrp;
    totalSelling += itemTotalSelling;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>₹${item.price} <span style="text-decoration: line-through; color: #94a3b8; font-size: 0.75rem;">₹${item.mrp}</span></p>
      </div>
      <div class="cart-item-qty">
        <button class="btn-qty" onclick="updateCartQty('${item.id}', -1)">-</button>
        <span style="font-weight: 700; min-width: 20px; text-align: center;">${item.qty}</span>
        <button class="btn-qty" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
    `;
    itemsContainer.appendChild(div);
  });

  const totalSavings = Math.max(0, totalMrp - totalSelling);

  if (mrpTotalEl) mrpTotalEl.textContent = `₹${totalMrp.toFixed(2)}`;
  if (finalTotalEl) finalTotalEl.textContent = `₹${totalSelling.toFixed(2)}`;
  
  if (savingsBannerEl) {
    if (totalSavings > 0) {
      savingsBannerEl.style.display = 'block';
      if (savingsAmountEl) savingsAmountEl.textContent = `₹${totalSavings.toFixed(2)}`;
    } else {
      savingsBannerEl.style.display = 'none';
    }
  }
}
