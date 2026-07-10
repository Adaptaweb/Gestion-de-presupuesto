const store = new Map();

function prune() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.expiry && entry.expiry <= now) store.delete(key);
  }
}

export function getCache(key) {
  prune();
  const entry = store.get(key);
  if (!entry) return undefined;
  if (entry.expiry && entry.expiry <= Date.now()) {
    store.delete(key);
    return undefined;
  }
  return entry.value;
}

export function setCache(key, data, ttlSeconds = 60) {
  prune();
  store.set(key, { value: data, expiry: Date.now() + ttlSeconds * 1000 });
}

export function delCache(key) {
  store.delete(key);
}

export function delCacheByPattern(pattern) {
  for (const key of store.keys()) {
    if (key.includes(pattern)) store.delete(key);
  }
}

export function flushCache() {
  store.clear();
}

export default { get: getCache, set: setCache, del: delCache, delByPattern: delCacheByPattern, flush: flushCache };
