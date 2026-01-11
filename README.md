
# commonbrew-pos-inventory-system

Offline-first POS & Inventory for a coffee shop (extensible to milktea, frappe, cakes, pasta, siomai, etc.).  
Backend: Spring Boot (REST + JPA + MySQL).  
Frontend: Thymeleaf (server-rendered) + Vanilla JS, IndexedDB-ready.  
Offline shell via Service Worker (optional step).

## Features

- **Inventory by ingredient** with units (g/ml/pcs) and **Low Stock thresholds**
- Clean **UI** with shared header/footer fragments and centralized CSS
- **Bootstrap API** to load inventory for the browser
- Ready to extend with **Variants**, **Recipes** (variant → ingredient), **Sales**, and **sync events**

## Architecture

- **Server (Spring Boot + JPA + MySQL)**  
  - `Ingredient`, `InventoryStock(minThreshold)` entities  
  - `/api/bootstrap` returns ingredients + stocks for UI  
  - `/api/inventory/{ingredientId}/threshold` to set low-stock threshold

- **Client (Thymeleaf + JS)**  
  - `pos.html`, `inventory.html` use fragments: `fragments/_head`, `_header`, `_footer`  
  - `/static/css/main.css` for centralized styling  
  - `/static/js/inventory.js` renders table, filters by **Powders/Syrups/Base/Dairy/Low Stock**, and shows status bars

> Current pages and scripts were refactored from inline styles/scripts to fragments and static assets (see `inventory.html`, `inventory.js`). [2](https://cardinalhealth-my.sharepoint.com/personal/nigel_arugay_cardinalhealth_com/Documents/Microsoft%20Copilot%20Chat%20Files/inventory.html)[1](https://cardinalhealth-my.sharepoint.com/personal/nigel_arugay_cardinalhealth_com/Documents/Microsoft%20Copilot%20Chat%20Files/inventory.js)

## Getting Started

### Prerequisites
- Java 17+
- Maven 3.8+
- MySQL 8+

### Local DB
Create DB and user:
```sql
CREATE DATABASE pos;
CREATE USER 'root'@'%' IDENTIFIED BY 'YOUR_PASSWORD';
GRANT ALL ON pos.* TO 'root'@'%';
FLUSH PRIVILEGES;
```
