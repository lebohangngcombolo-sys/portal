/**
 * In-memory storage fallback.
 *
 * Same public surface as {@link Storage}, but values do not survive a
 * reload. Used when neither sessionStorage nor localStorage is available
 * (e.g. some test environments, private browsing in strict mode).
 */
export class MemoryStorage {
  #map;

  constructor() {
    this.#map = new Map();
  }

  /**
   * Read and deserialize a value.
   */
  get(key) {
    if (!this.#map.has(key)) return null;
    try {
      return JSON.parse(this.#map.get(key));
    } catch {
      return null;
    }
  }

  /**
   * Write a value (serialized as JSON).
   */
  set(key, value) {
    if (value === undefined) {
      this.remove(key);
      return;
    }
    this.#map.set(key, JSON.stringify(value));
  }

  /**
   * Remove a key.
   */
  remove(key) {
    this.#map.delete(key);
  }

  /**
   * Clear everything.
   */
  clear() {
    this.#map.clear();
  }

  /**
   * Bulk merge. Values are applied one-by-one; missing keys are untouched.
   */
  spread(values) {
    if (!values) return;
    Object.entries(values).forEach(([k, v]) => this.set(k, v));
  }

  /**
   * Return all keys currently held.
   */
  keys() {
    return Array.from(this.#map.keys());
  }
}