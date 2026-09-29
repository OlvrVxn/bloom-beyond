/* ============================================================
   BLOOM & BEYOND FLOWER SHOP — MAIN SCRIPT
   ============================================================ */

// ============ PRODUCT DATA ============
const products = [
  { id: 1, name: "Mini Bouquet", emoji: "🌹", price: 250, category: "bouquet", badge: "Best Seller",
    img: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
    desc: "A simple bouquet suitable for small gifts and casual occasions." },
  { id: 2, name: "Classic Bouquet", emoji: "💐", price: 450, category: "bouquet", badge: "",
    img: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80",
    desc: "A medium-sized bouquet with fresh flowers and simple wrapping." },
  { id: 3, name: "Premium Bouquet", emoji: "🌷", price: 850, category: "bouquet", badge: "Premium",
    img: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
    desc: "A larger arrangement with premium flowers and decorative packaging." },
  { id: 4, name: "Customized Bouquet", emoji: "🌸", price: 600, category: "bouquet", badge: "Custom",
    img: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&q=80",
    desc: "Personalized arrangement based on your preferred flowers and design." },
  { id: 5, name: "Flower & Chocolate Set", emoji: "🍫", price: 800, category: "gift", badge: "Gift",
    img: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=600&q=80",
    desc: "Fresh flowers paired with premium chocolates in a gift box." },
  { id: 6, name: "Flower Box Arrangement", emoji: "🎁", price: 1200, category: "gift", badge: "",
    img: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80",
    desc: "Elegant flowers arranged in a decorative box for a lasting impression." },
  { id: 7, name: "Graduation Flower Set", emoji: "🎓", price: 950, category: "gift", badge: "Seasonal",
    img: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&q=80",
    desc: "Celebratory arrangement perfect for graduates and milestone moments." },
  { id: 8, name: "Anniversary Package", emoji: "💕", price: 1500, category: "gift", badge: "Romantic",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=600&q=80",
    desc: "Romantic flower arrangement with personalized message card." },
  { id: 9, name: "Wedding Floral Package", emoji: "💒", price: 25000, category: "event", badge: "Event",
    img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80",
    desc: "Complete floral decoration for wedding ceremonies and receptions." },
  { id: 10, name: "Birthday Event Package", emoji: "🎂", price: 8000, category: "event", badge: "",
    img: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
    desc: "Floral decorations for birthday celebrations and parties." },
  { id: 11, name: "Store Opening Package", emoji: "🏪", price: 10000, category: "event", badge: "Business",
    img: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?w=600&q=80",
    desc: "Grand opening floral arrangements and decorative displays." },
  { id: 12, name: "Funeral Flower Service", emoji: "🕊️", price: 5000, category: "event", badge: "",
    img: "https://images.unsplash.com/photo-1599733589046-833caccbb4ae?w=600&q=80",
    desc: "Respectful floral arrangements for memorial services and condolences." }
];

// ============ STATE ============
let cart     = JSON.parse(localStorage.getItem('bb_cart'))     || [];
let orders   = JSON.parse(localStorage.getItem('bb_orders'))   || [];
let wishlist = JSON.parse(localStorage.getItem('bb_wishlist')) || [];

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('productGrid')) {
    renderProducts('all');
    updateCartCount();
    initDateInput();
    initFilterButtons();
  }
  if (document.getElementById('ordersTableBody')) {
    renderOrders();
  }
  initScrollEffects();
  initReveal();
  initSmoothScroll();
});

// ============ HELPERS ============
function initDateInput() {
  const dateInput = document.getElementById('custDate');
  if (!dateInput) return;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const iso = tomorrow.toISOString().split('T')[0];
  dateInput.min = iso;
  dateInput.value = iso;
}

function initScrollEffects() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });
}

function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 100;
      const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
      document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initFilterButtons() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.textContent.toLowerCase().includes('bouquet') ? 'bouquet'
                : btn.textContent.toLowerCase().includes('gift')    ? 'gift'
                : btn.textContent.toLowerCase().includes('event')   ? 'event'
                : 'all';
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(cat);
    });
  });
}

// ============ PRODUCTS ============
function renderProducts(filter) {
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
  grid.innerHTML = filtered.map((p, i) => `
    <div class="product-card reveal" style="transition-delay:${i * 0.05}s">
      <div class="product-image">
        ${p.img ? `<img src="${p.img}" alt="${p.name}" loading="lazy">` : p.emoji}
        ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
        <button class="wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}"
                onclick="toggleWishlist(${p.id}, event)"
                aria-label="Add to wishlist">
          ${wishlist.includes(p.id) ? '❤' : '♡'}
        </button>
      </div>
      <div class="product-info">
        <h4>${p.name}</h4>
        <p>${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">P${p.price.toLocaleString()}<small>per arrangement</small></div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Add</button>
        </div>
      </div>
    </div>
  `).join('');
  initReveal();
}

function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(cat);
}

// ============ WISHLIST ============
function toggleWishlist(id, e) {
  e.stopPropagation();
  const idx = wishlist.indexOf(id);
  if (idx > -1) { wishlist.splice(idx, 1); showToast('Removed from wishlist'); }
  else { wishlist.push(id); showToast('❤ Added to wishlist!'); }
  localStorage.setItem('bb_wishlist', JSON.stringify(wishlist));
  const activeBtn = document.querySelector('.filter-btn.active');
  let cat = 'all';
  if (activeBtn) {
    const t = activeBtn.textContent.toLowerCase();
    if (t.includes('bouquet')) cat = 'bouquet';
    else if (t.includes('gift')) cat = 'gift';
    else if (t.includes('event')) cat = 'event';
  }
  renderProducts(cat);
}

// ============ CART ============
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty++;
  else cart.push({ ...product, qty: 1 });
  saveCart();
  updateCartCount();
  showToast(`${product.emoji} ${product.name} added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  renderCartItems();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveCart();
  updateCartCount();
  renderCartItems();
}

function saveCart() { localStorage.setItem('bb_cart', JSON.stringify(cart)); }

function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function getCartTotal() {
  return cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
}

function openCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.classList.add('active');
  document.getElementById('cartView').style.display = 'block';
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('confirmView').style.display = 'none';
  renderCartItems();
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const modal = document.getElementById('cartModal');
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (!container) return;
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cart.length === 0) {
    container.innerHTML = `<div class="empty-cart"><span>🛒</span><h4>Your cart is empty</h4><p style="font-size:0.85rem;">Add some beautiful flowers to get started!</p></div>`;
    if (totalEl) totalEl.style.display = 'none';
    if (checkoutBtn) checkoutBtn.style.display = 'none';
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-emoji">${item.emoji}</div>
      <div class="cart-item-details">
        <h5>${item.name}</h5>
        <p>P${item.price.toLocaleString()} each</p>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateQty(${item.id}, -1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
      </div>
      <div class="cart-item-price">P${(item.price * item.qty).toLocaleString()}</div>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove">🗑</button>
    </div>
  `).join('');

  if (totalEl) totalEl.style.display = 'flex';
  if (checkoutBtn) checkoutBtn.style.display = 'flex';
  const amountEl = document.getElementById('totalAmount');
  if (amountEl) amountEl.textContent = `P${getCartTotal().toLocaleString()}`;
}

// ============ CHECKOUT ============
function showCheckout() {
  if (cart.length === 0) return;
  document.getElementById('cartView').style.display = 'none';
  document.getElementById('checkoutView').style.display = 'block';
  document.getElementById('checkoutTotal').textContent = `P${getCartTotal().toLocaleString()}`;
}

function backToCart() {
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('cartView').style.display = 'block';
}

function placeOrder(e) {
  e.preventDefault();
  const order = {
    ref: 'BB-' + Date.now().toString().slice(-6),
    name: document.getElementById('custName').value,
    phone: document.getElementById('custPhone').value,
    email: document.getElementById('custEmail').value,
    address: document.getElementById('custAddress').value,
    date: document.getElementById('custDate').value,
    payment: document.getElementById('custPayment').value,
    message: document.getElementById('custMessage').value,
    items: [...cart],
    total: getCartTotal(),
    status: 'Pending',
    createdAt: new Date().toLocaleString()
  };
  orders.unshift(order);
  localStorage.setItem('bb_orders', JSON.stringify(orders));
  document.getElementById('orderRef').textContent = order.ref;
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('confirmView').style.display = 'block';
}

function resetCart() {
  cart = [];
  saveCart();
  updateCartCount();
}

// ============ ADMIN DASHBOARD ============
function renderOrders() {
  const tbody = document.getElementById('ordersTableBody');
  if (!tbody) return;

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pending      = orders.filter(o => o.status === 'Pending').length;
  const processing   = orders.filter(o => o.status === 'Processing').length;
  const delivered    = orders.filter(o => o.status === 'Delivered').length;
  const avg          = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  setText('statOrders', orders.length);
  setText('statRevenue', 'P' + totalRevenue.toLocaleString());
  setText('statPending', pending);
  setText('statProcessing', processing);
  setText('statDelivered', delivered);
  setText('statAvg', 'P' + avg.toLocaleString());

  const search = (document.getElementById('adminSearch')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('adminStatusFilter')?.value || 'all';

  let visible = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false;
    if (!search) return true;
    return (o.ref.toLowerCase().includes(search) ||
            o.name.toLowerCase().includes(search) ||
            o.phone.toLowerCase().includes(search));
  });

  if (visible.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-row">${orders.length === 0 ? 'No orders yet — waiting for your first customer! 🌸' : 'No orders match your filter.'}</td></tr>`;
    return;
  }

  tbody.innerHTML = visible.map(o => `
    <tr>
      <td style="font-family:monospace; color:var(--deep-pink); font-weight:bold;">${o.ref}</td>
      <td>${o.name}<br><span style="color:#999; font-size:0.72rem;">${o.phone}</span></td>
      <td style="font-size:0.78rem;">${o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join('<br>')}</td>
      <td style="font-weight:bold; color:var(--green);">P${o.total.toLocaleString()}</td>
      <td style="font-size:0.75rem;">${o.date}</td>
      <td style="font-size:0.75rem;">${o.payment}</td>
      <td><span class="status-badge status-${o.status.toLowerCase()}">${o.status}</span></td>
      <td>
        <select class="status-select" onchange="updateOrderStatus('${o.ref}', this.value)">
          <option value="Pending"    ${o.status === 'Pending'    ? 'selected' : ''}>Pending</option>
          <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Delivered"  ${o.status === 'Delivered'  ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function updateOrderStatus(ref, status) {
  const order = orders.find(o => o.ref === ref);
  if (!order) return;
  order.status = status;
  localStorage.setItem('bb_orders', JSON.stringify(orders));
  renderOrders();
  showToast(`Order ${ref} → ${status}`);
}

function viewOrderDetail(ref) {
  const o = orders.find(x => x.ref === ref);
  if (!o) return;
  const modal = document.getElementById('detailModal');
  const content = document.getElementById('detailContent');
  if (!modal || !content) return;
  content.innerHTML = `
    <h3>Order ${o.ref}</h3>
    <div class="modal-sub">Placed on ${o.createdAt}</div>
    <div class="detail-section"><h5>Customer</h5><p><strong>${o.name}</strong><br>${o.phone}${o.email ? ' • ' + o.email : ''}</p></div>
    <div class="detail-section"><h5>Delivery Address</h5><p>${o.address}</p></div>
    <div class="detail-section"><h5>Delivery Date</h5><p>${o.date}</p></div>
    <div class="detail-section"><h5>Payment Method</h5><p>${o.payment}</p></div>
    ${o.message ? `<div class="detail-section"><h5>Special Message</h5><p>${o.message}</p></div>` : ''}
    <div class="detail-section">
      <h5>Items</h5>
      <div class="detail-items">
        ${o.items.map(i => `<div class="detail-item"><span>${i.emoji} ${i.name} × ${i.qty}</span><span>P${(i.price * i.qty).toLocaleString()}</span></div>`).join('')}
        <div class="detail-total"><span>Total</span><span>P${o.total.toLocaleString()}</span></div>
      </div>
    </div>
  `;
  modal.classList.add('active');
}

function closeDetail() {
  const modal = document.getElementById('detailModal');
  if (modal) modal.classList.remove('active');
}

function clearAllOrders() {
  if (!confirm('Are you sure you want to delete all orders? This cannot be undone.')) return;
  orders = [];
  localStorage.setItem('bb_orders', JSON.stringify(orders));
  renderOrders();
  showToast('All orders cleared');
}

function exportOrders() {
  if (orders.length === 0) { showToast('No orders to export'); return; }
  const headers = ['Reference', 'Customer', 'Phone', 'Email', 'Address', 'Delivery Date', 'Payment', 'Items', 'Total', 'Status'];
  const rows = orders.map(o => [
    o.ref, o.name, o.phone, o.email || '',
    o.address.replace(/\n/g, ' '), o.date, o.payment,
    o.items.map(i => `${i.name} x${i.qty}`).join('; '),
    o.total, o.status
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `bloom-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Orders exported as CSV');
}

function loadSampleOrders() {
  const samples = [
    { ref: 'BB-100001', name: 'Maria Josefa Reyes', phone: '0917 555 1234', email: 'maria@email.com',
      address: '123 Mabini St., Barangay San Roque, Quezon City',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      payment: 'GCash', message: 'Happy Birthday Mom! Love you!',
      items: [{ id: 3, name: 'Premium Bouquet', emoji: '🌷', price: 850, qty: 1 }],
      total: 850, status: 'Pending', createdAt: new Date().toLocaleString() },
    { ref: 'BB-100002', name: 'Carlo Mendoza', phone: '0928 777 8899', email: 'carlo@email.com',
      address: '456 Rizal Ave., Barangay Poblacion, Makati City',
      date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
      payment: 'Cash on Delivery', message: 'For our 5th anniversary 💕',
      items: [
        { id: 8, name: 'Anniversary Package', emoji: '💕', price: 1500, qty: 1 },
        { id: 5, name: 'Flower & Chocolate Set', emoji: '🍫', price: 800, qty: 1 }
      ],
      total: 2300, status: 'Processing', createdAt: new Date().toLocaleString() },
    { ref: 'BB-100003', name: 'Andrea Torres', phone: '0915 222 3344', email: 'andrea@email.com',
      address: '789 Katipunan Ave., Barangay Loyola Heights, Quezon City',
      date: new Date().toISOString().split('T')[0],
      payment: 'Bank Transfer', message: 'Congratulations on your graduation!',
      items: [{ id: 7, name: 'Graduation Flower Set', emoji: '🎓', price: 950, qty: 2 }],
      total: 1900, status: 'Delivered', createdAt: new Date().toLocaleString() }
  ];
  orders = [...samples, ...orders];
  localStorage.setItem('bb_orders', JSON.stringify(orders));
  renderOrders();
  showToast('✨ Sample orders loaded!');
}

// ============ NEWSLETTER ============
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = e.target.querySelector('input').value;
  showToast(`🌸 Thanks for subscribing, ${email}!`);
  e.target.reset();
}

// ============ TOAST ============
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

// ============ GLOBAL EVENTS ============
document.addEventListener('click', (e) => {
  const cartModal = document.getElementById('cartModal');
  if (cartModal && e.target.id === 'cartModal') closeCart();
  const detailModal = document.getElementById('detailModal');
  if (detailModal && e.target.id === 'detailModal') closeDetail();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeCart(); closeDetail(); }
});