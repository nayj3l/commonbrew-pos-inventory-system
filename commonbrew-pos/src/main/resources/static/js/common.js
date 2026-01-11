
// Service Worker (optional now; add /sw.js later)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// Status indicator (simple)
function updateStatusIndicator() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const isOnline = navigator.onLine;
  if (dot && text) {
    dot.style.backgroundColor = isOnline ? '#4CAF50' : '#f44336';
    text.textContent = isOnline ? 'Online' : 'Offline - Working Locally';
  }
}
window.addEventListener('online', updateStatusIndicator);
window.addEventListener('offline', updateStatusIndicator);
document.addEventListener('DOMContentLoaded', updateStatusIndicator);
