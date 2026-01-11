// TODO: replace with backend data; for now we’ll bootstrap from server/DB soon.
let currentFilter = 'all';
let inventoryData = [];

async function loadInventoryData() {
  try {
    const res = await fetch('/api/bootstrap'); // will add this controller below
    const data = await res.json();
    // Map backend ingredients + stocks to UI shape
    const stocksByIngredientId = Object.fromEntries(
      data.stocks.map(s => [s.ingredient.id, s.quantity])
    );
    inventoryData = data.ingredients.map(i => ({
      id: i.id,
      name: i.name,
      category: categoryFromIngredient(i.name),
      unit: i.unit,
      currentStock: stocksByIngredientId[i.id] ?? 0,
      minStock: (data.stocks.find(s => s.ingredient.id === i.id)?.minThreshold ?? 0),
      description: ''
    }));
  } catch (e) {
    // as a fallback, keep an empty set or seeded values
    inventoryData = [];
  }
  renderInventory();
}

function categoryFromIngredient(name) {
  name = name.toLowerCase();
  if (name.startsWith('powder')) return 'powder';
  if (name.startsWith('syrup')) return 'syrup';
  if (['milk','creamer','sweetener'].some(x => name.includes(x))) return 'dairy';
  if (['espresso','frappe base','ice','cup'].some(x => name.includes(x))) return 'base';
  return 'other';
}

function filterCategory(cat) {
  currentFilter = cat;
  document.querySelectorAll('.category-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.category-tab').forEach(tab => {
    if ((cat === 'all' && tab.textContent.includes('All')) || tab.textContent.toLowerCase().includes(cat)) {
      tab.classList.add('active');
    }
  });
  renderInventory();
}

function stockStatus(item) {
  if (item.currentStock <= 0) return 'out';
  if (item.minStock <= 0) return 'normal';
  const pct = (item.currentStock / item.minStock) * 100;
  if (pct <= 25) return 'critical';
  if (pct <= 50) return 'low';
  return 'normal';
}

function renderInventory() {
  const container = document.getElementById('inventory-items-container');
  container.innerHTML = '';
  const filtered = inventoryData.filter(i =>
    currentFilter === 'all' ? true :
    currentFilter === 'low' ? (stockStatus(i) === 'low' || stockStatus(i) === 'critical') :
    i.category === currentFilter
  );
  let total = 0, low = 0, out = 0;

  filtered.sort((a,b) => a.name.localeCompare(b.name));
  for (const item of filtered) {
    const status = stockStatus(item);
    if (status === 'low') low++;
    if (status === 'out') out++;
    total++;

    const pct = item.minStock > 0 ? Math.min(100, (item.currentStock / item.minStock) * 100) : (item.currentStock > 0 ? 100 : 0);
    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div><span class="category-badge">${item.category}</span></div>
      <div class="stock-level ${status}">${item.currentStock} ${item.unit}</div>
      <div class="unit">${item.unit}</div>
      <div>
        <div class="stock-bar-container"><div class="stock-bar ${status}" style="width:${pct}%"></div></div>
        <small>${status === 'out' ? 'Out of Stock' : status === 'critical' ? 'Critical' : status === 'low' ? 'Low' : 'Good'}</small>
      </div>
      <div class="actions">
        <button class="action-btn" title="Adjust" onclick="adjustStock(${item.id})"><i class="fas fa-plus-minus"></i></button>
      </div>`;
    container.appendChild(row);
  }
  document.getElementById('total-items').textContent = String(total);
  document.getElementById('low-stock').textContent = String(low);
  document.getElementById('out-stock').textContent = String(out);
}

function adjustStock(id) {
  const item = inventoryData.find(i => i.id === id);
  if (!item) return;
  const adj = prompt(`Adjust stock for ${item.name}\nCurrent: ${item.currentStock} ${item.unit}\nEnter + to add, - to subtract:`, '0');
  if (adj == null) return;
  const val = parseFloat(adj);
  if (Number.isFinite(val)) {
    item.currentStock = Math.max(0, item.currentStock + val);
    renderInventory();
    // Later: POST /api/inventory/adjust
  } else {
    alert('Please enter a valid number');
  }
}

function bindSidebarFilters() {
  document.querySelectorAll('.sidebar .nav a').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      // active state
      document.querySelectorAll('.sidebar .nav a').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      // apply filter
      const filter = a.getAttribute('data-filter') || 'all';
      filterCategory(filter);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindSidebarFilters();
});


document.addEventListener('DOMContentLoaded', loadInventoryData);


// ---- Sorting state ----
let sortKey = 'name';          // 'name' | 'current' | 'level'
let sortDir = 'asc';           // 'asc' | 'desc'

// helper: compute stock level ratio (0..∞)
function levelRatio(item) {
  const min = +item.minStock || 0;
  const qty = +item.currentStock || 0;
  if (min <= 0) return Number.POSITIVE_INFINITY; // treat "no threshold" as highest level
  return qty / min;
}

// toggle sort key+dir
function toggleSort(key) {
  if (sortKey === key) {
    sortDir = (sortDir === 'asc') ? 'desc' : 'asc';
  } else {
    sortKey = key;
    sortDir = 'asc';
  }
  renderInventory();
  // update indicators
  const currentIcon = sortKey === 'current' ? (sortDir === 'asc' ? '↑' : '↓') : '';
  const levelIcon   = sortKey === 'level'   ? (sortDir === 'asc' ? '↑' : '↓') : '';
  document.getElementById('sort-current').textContent = currentIcon;
  document.getElementById('sort-level').textContent   = levelIcon;
}

// bind header clicks
function bindSortHeaders() {
  const thCurrent = document.getElementById('th-current');
  const thLevel   = document.getElementById('th-level');
  if (thCurrent) thCurrent.addEventListener('click', () => toggleSort('current'));
  if (thLevel)   thLevel.addEventListener('click', () => toggleSort('level'));
}

// existing renderInventory: inject sorting before rendering
function renderInventory() {
  const container = document.getElementById('inventory-items-container');
  container.innerHTML = '';

  const filtered = inventoryData.filter(i =>
    currentFilter === 'all' ? true :
    currentFilter === 'low' ? (stockStatus(i) === 'low' || stockStatus(i) === 'critical') :
    i.category === currentFilter
  );

  // ---- apply sort
  filtered.sort((a, b) => {
    let A, B;
    switch (sortKey) {
      case 'current': A = +a.currentStock || 0; B = +b.currentStock || 0; break;
      case 'level':   A = levelRatio(a);        B = levelRatio(b);        break;
      default:        A = (a.name || '').toLowerCase(); B = (b.name || '').toLowerCase();
    }
    if (A < B) return sortDir === 'asc' ? -1 : 1;
    if (A > B) return sortDir === 'asc' ? 1 : -1;
    // tie-breaker by name
    return (a.name || '').localeCompare(b.name || '');
  });

  // ---- render rows (existing code) ...
  let total = 0, low = 0, out = 0;
  for (const item of filtered) {
    const status = stockStatus(item);
    const pct = item.minStock > 0 ? Math.min(100, (item.currentStock / item.minStock) * 100)
                                  : (item.currentStock > 0 ? 100 : 0);
    if (status === 'low') low++;
    if (status === 'out') out++;
    total++;

    const row = document.createElement('div');
    row.className = 'table-row';
    row.innerHTML = `
      <div class="item-name">${item.name}</div>
      <div><span class="category-badge">${item.category}</span></div>
      <div class="stock-level ${status}">${item.currentStock} ${item.unit}</div>
      <div class="unit">${item.unit}</div>
      <div>
        <div class="stock-bar-container"><div class="stock-bar ${status}" style="width:${pct}%"></div></div>
        <small>${status === 'out' ? 'Out of Stock' : status === 'critical' ? 'Critical' : status === 'low' ? 'Low' : 'Good'}</small>
      </div>
      <div class="actions">
        <button class="action-btn" title="Adjust" onclick="adjustStock(${item.id})"><i class="fas fa-plus-minus"></i></button>
      </div>`;
    container.appendChild(row);
  }
  document.getElementById('total-items').textContent = String(total);
  document.getElementById('low-stock').textContent   = String(low);
  document.getElementById('out-stock').textContent   = String(out);
}

// after DOM load, bind headers (in addition to your existing bindings)
document.addEventListener('DOMContentLoaded', () => {
  bindSortHeaders();
});
