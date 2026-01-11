// Offline-first POS frontend
const DB_NAME = 'pos-db';
const DB_VERSION = 1;

let db;
let state = {
  categories: [],
  products: [],
  variants: [],
  ingredients: [],
  stocks: [],
  recipes: [],
  cart: [],
};

async function initDB() {
  db = await IDB.open(DB_NAME, DB_VERSION, (db) => {
    db.createObjectStore('categories', { keyPath: 'id' });
    db.createObjectStore('products',   { keyPath: 'id' });
    db.createObjectStore('variants',   { keyPath: 'id' });
    db.createObjectStore('ingredients',{ keyPath: 'id' });
    db.createObjectStore('stocks',     { keyPath: 'id' });
    db.createObjectStore('recipes',    { keyPath: 'id' });

    db.createObjectStore('sales_local',{ keyPath: 'id' });     // local sales
    db.createObjectStore('sync_events',{ keyPath: 'eventId' }); // pending events
  });
}

async function bootstrap() {
  try {
    const res = await fetch('/api/bootstrap', { cache: 'no-store' });
    const data = await res.json();

    await IDB.putAll(db, 'categories', data.categories);
    await IDB.putAll(db, 'products',   data.products);
    await IDB.putAll(db, 'variants',   data.variants);
    await IDB.putAll(db, 'ingredients',data.ingredients);
    await IDB.putAll(db, 'stocks',     data.stocks);
    await IDB.putAll(db, 'recipes',    data.recipes);

    console.log('Bootstrap from server');
  } catch (e) {
    console.log('Bootstrap offline—loading from IndexedDB');
  }

  // load from local DB either way
  state.categories = await IDB.getAll(db, 'categories');
  state.products   = await IDB.getAll(db, 'products');
  state.variants   = await IDB.getAll(db, 'variants');
  state.ingredients= await IDB.getAll(db, 'ingredients');
  state.stocks     = await IDB.getAll(db, 'stocks');
  state.recipes    = await IDB.getAll(db, 'recipes');

  render();
  approxInventoryUI();
}

function render() {
  const catEl = document.getElementById('categories');
  catEl.innerHTML = '<h2>Categories</h2>' + state.categories.map(c =>
    `<button class="chip" onclick="showProducts(${c.id})">${c.name}</button>`).join(' ');

  document.getElementById('products').innerHTML = '';
  document.getElementById('variants').innerHTML = '';
  document.getElementById('cart-items').innerHTML = '';
  document.getElementById('cart-total').innerText = '₱0.00';
}

function showProducts(categoryId) {
  const prods = state.products.filter(p => p.category.id === categoryId);
  const el = document.getElementById('products');
  el.innerHTML = '<h2>Products</h2>' + prods.map(p =>
    `<button class="chip" onclick="showVariants(${p.id})">${p.name}</button>`).join(' ');
}

function showVariants(productId) {
  const vars = state.variants.filter(v => v.product.id === productId);
  const el = document.getElementById('variants');
  el.innerHTML = '<h2>Variants</h2>' + vars.map(v =>
    `<button class="chip" onclick="addToCart(${v.id})">${v.name} (₱${(+v.price).toFixed(2)})</button>`).join(' ');
}

function addToCart(variantId) {
  const v = state.variants.find(x => x.id === variantId);
  const existing = state.cart.find(ci => ci.variantId === variantId);
  if (existing) existing.qty += 1;
  else state.cart.push({ variantId: v.id, name: `${v.product.name} - ${v.name}`, qty: 1, price: +v.price });

  renderCart();
}

function renderCart() {
  const ul = document.getElementById('cart-items');
  ul.innerHTML = state.cart.map(ci => `<li>
    ${ci.name} x ${ci.qty} — ₱${(ci.qty * ci.price).toFixed(2)}
    <button onclick="decItem(${ci.variantId})">-</button>
    <button onclick="incItem(${ci.variantId})">+</button>
    <button onclick="removeItem(${ci.variantId})">x</button>
  </li>`).join('');

  const total = state.cart.reduce((s, x) => s + x.qty * x.price, 0);
  document.getElementById('cart-total').innerText = `₱${total.toFixed(2)}`;
}

function incItem(variantId) {
  const it = state.cart.find(ci => ci.variantId === variantId);
  if (it) { it.qty += 1; renderCart(); }
}
function decItem(variantId) {
  const it = state.cart.find(ci => ci.variantId === variantId);
  if (it) { it.qty = Math.max(1, it.qty - 1); renderCart(); }
}
function removeItem(variantId) {
  state.cart = state.cart.filter(ci => ci.variantId !== variantId);
  renderCart();
}

document.getElementById('commit-sale').addEventListener('click', async () => {
  if (!state.cart.length) return;
  const saleId = crypto.randomUUID();
  const total = state.cart.reduce((s, x) => s + x.qty * x.price, 0);

  const sale = {
    id: saleId,
    createdAt: new Date().toISOString(),
    items: state.cart.map(ci => ({
      variantId: ci.variantId,
      name: ci.name,
      qty: ci.qty,
      price: ci.price
    })),
    total
  };

  // 1) save locally
  await IDB.put(db, 'sales_local', sale);

  // 2) queue sync event
  const evt = { eventId: crypto.randomUUID(), type: 'SALE_CREATED', payload: { total, items: sale.items } };
  await IDB.put(db, 'sync_events', evt);

  // 3) optimistic inventory deduction (approx for UI)
  approxDeductFromLocalStocks(sale);

  // 4) fire-and-forget sync
  syncEvents();

  // Clear cart
  state.cart = [];
  renderCart();
  approxInventoryUI();
});

async function syncEvents() {
  const pending = await IDB.getAll(db, 'sync_events');
  const unsynced = pending.filter(e => !e.synced);
  if (!unsynced.length) return;

  try {
    await fetch('/api/sync/events', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(unsynced)
    });
    // mark as synced
    for (const ev of unsynced) {
      ev.synced = true;
      await IDB.put(db, 'sync_events', ev);
    }
    document.getElementById('net-status').innerText = 'Synced';
  } catch (e) {
    document.getElementById('net-status').innerText = 'Offline (queued)';
  }
}

window.addEventListener('online', syncEvents);
setInterval(syncEvents, 10000);

// ---- Approx inventory for UI (local snapshot from recipes) ----
function approxDeductFromLocalStocks(sale) {
  for (const item of sale.items) {
    const recipes = state.recipes.filter(r => r.variant.id === item.variantId);
    for (const r of recipes) {
      const stock = state.stocks.find(s => s.ingredient.id === r.ingredient.id);
      if (stock) {
        stock.quantity = (+stock.quantity) - (+r.amount) * item.qty;
      }
    }
  }
}

function approxInventoryUI() {
  const list = document.getElementById('inventory-list');
  list.innerHTML = state.stocks
    .slice(0, 10) // show a subset for UI
    .map(s => `<li>${s.ingredient.name}: ${(+s.quantity).toFixed(2)} ${s.ingredient.unit}</li>`)
    .join('');
}

(async function main(){
  await initDB();
  await bootstrap();
})();
