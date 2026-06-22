import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const LRU = require('lru-cache');

const cache = new LRU({ max: 500, maxAge: 1000 * 60 });

export function getCache(key) {
  return cache.get(key);
}

export function setCache(key, data, ttlSeconds = 60) {
  cache.set(key, data, ttlSeconds * 1000);
}

export function delCache(key) {
  cache.del(key);
}

export function delCacheByPattern(pattern) {
  const keys = cache.keys();
  for (const key of keys) {
    if (key.includes(pattern)) cache.del(key);
  }
}

export function flushCache() {
  cache.reset();
}

export default { get: getCache, set: setCache, del: delCache, delByPattern: delCacheByPattern, flush: flushCache };
