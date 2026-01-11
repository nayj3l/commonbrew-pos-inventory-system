// Minimal IndexedDB helper (no external libs)
const IDB = (() => {
  const open = (name, version, upgrade) => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(name, version);
      req.onupgradeneeded = e => upgrade && upgrade(e.target.result);
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = e => reject(e.target.error);
    });
  };

  const tx = (db, stores, mode='readonly') => db.transaction(stores, mode);

  const putAll = (db, store, arr) => new Promise((res, rej) => {
    const t = tx(db, [store], 'readwrite');
    const s = t.objectStore(store);
    arr.forEach(x => s.put(x));
    t.oncomplete = () => res(true);
    t.onerror = e => rej(e.target.error);
  });

  const getAll = (db, store) => new Promise((res, rej) => {
    const t = tx(db, [store], 'readonly');
    const s = t.objectStore(store);
    const req = s.getAll();
    req.onsuccess = e => res(e.target.result);
    req.onerror   = e => rej(e.target.error);
  });

  const put = (db, store, obj) => new Promise((res, rej) => {
    const t = tx(db, [store], 'readwrite');
    const s = t.objectStore(store);
    const req = s.put(obj);
    req.onsuccess = () => res(true);
    req.onerror   = e => rej(e.target.error);
  });

  const deleteKey = (db, store, key) => new Promise((res, rej) => {
    const t = tx(db, [store], 'readwrite');
    const s = t.objectStore(store);
    const req = s.delete(key);
    req.onsuccess = () => res(true);
    req.onerror   = e => rej(e.target.error);
  });

  return { open, putAll, getAll, put, deleteKey };
})();
