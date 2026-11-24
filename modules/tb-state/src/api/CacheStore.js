/**
 * Wrapper around the browser Cache API.
 *
 * Used by {@link Api} to cache successful GET responses when a non-None
 * cache strategy is requested. The Cache API is unavailable in some
 * environments (Node without polyfill, older browsers) — every method
 * silently no-ops in that case, so callers never have to check.
 *
 * Cache name is fixed to 'tb-api' so multiple frontends in the same
 * origin don't collide.
 */
const CACHE_NAME = 'tb-api';

const isCacheApiAvailable = () =>
  typeof caches !== 'undefined' && caches && typeof caches.open === 'function';

export class CacheStore {
  /**
   * Read a cached response. Returns a structured clone-safe object or null.
   *
   * @param {string} key — canonical cache key
   * @returns {Promise<object|null>}
   */
  static async get(key) {
    if (!isCacheApiAvailable()) return null;
    try {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(key);
      if (!response) return null;
      // Clone body so we don't lock the underlying stream
      const cloned = response.clone();
      const text = await cloned.text();
      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body: text,
        cachedAt: Number(response.headers.get('x-cached-at')) || null,
      };
    } catch {
      return null;
    }
  }

  /**
   * Write a response body into the cache. No-op if Cache API is unavailable.
   *
   * @param {string} key
   * @param {{status: number, headers: Record<string,string>, body: string}} payload
   */
  static async set(key, payload) {
    if (!isCacheApiAvailable()) return;
    try {
      const cache = await caches.open(CACHE_NAME);
      const headers = new Headers(payload.headers || {});
      // Stamp write time so callers can reason about staleness
      headers.set('x-cached-at', String(Date.now()));
      await cache.put(
        key,
        new Response(payload.body, { status: payload.status, headers }),
      );
    } catch {
      // Cache write failures are non-fatal — the caller has a live response anyway
    }
  }

  /**
   * Remove one entry.
   */
  static async delete(key) {
    if (!isCacheApiAvailable()) return;
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(key);
    } catch {
      // ignore
    }
  }

  /**
   * Clear the entire tb-api cache namespace.
   */
  static async clear() {
    if (!isCacheApiAvailable()) return;
    try {
      await caches.delete(CACHE_NAME);
    } catch {
      // ignore
    }
  }

  /**
   * Compute the canonical cache key for a request.
   */
  static keyFor({ method, url }) {
    return `${method.toUpperCase()}:${url}`;
  }
}