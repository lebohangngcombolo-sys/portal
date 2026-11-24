/**
 * Cache strategies for GET requests (mirrors the ql-state enum).
 *
 * - None              — never cache
 * - CacheOnly         — read cache; if miss, fail
 * - CacheFirst        — read cache; if miss, fetch and cache
 * - NetworkFirst      — try network; on failure, fall back to cache
 * - CacheThenNetwork  — return cached immediately AND refresh from network
 */
export const CacheStrategies = Object.freeze({
  None: 'none',
  CacheOnly: 'cache-only',
  CacheFirst: 'cache-first',
  NetworkFirst: 'network-first',
  CacheThenNetwork: 'cache-then-network',
});