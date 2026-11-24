import { MemoryStorage } from './MemoryStorage.js';

/**
 * Browser storage with session-storage primary + local-storage mirror.
 *
 * Behavior:
 * - Writes go to sessionStorage and are mirrored to localStorage.
 * - Reads prefer sessionStorage; on miss, they hydrate from localStorage.
 * - `clear()` only wipes sessionStorage — local mirror survives until
 *   an explicit `clearAll()`.
 *
 * Falls back to {@link MemoryStorage} when neither sessionStorage nor
 * localStorage is available (SSR, some tests).
 *
 * Values are always JSON-serialized so callers can store plain objects
 * without thinking about types.
 */
export class Storage {
  #session;
  #local;
  #fallback;

  constructor() {
    this.#session = safeAccess(() => window.sessionStorage);
    this.#local = safeAccess(() => window.localStorage);
    this.#fallback = new MemoryStorage();
  }

  // ------------------------------------------------------------------ read/write

  /**
   * Read and deserialize a value. Hydrates sessionStorage from
   * localStorage if sessionStorage is empty.
   */
  get(key) {
    if (!key) return null;
    const session = this.#session;
    if (session) {
      const raw = session.getItem(key);
      if (raw != null) {
        try {
          return JSON.parse(raw);
        } catch {
          return null;
        }
      }
    }
    // Hydrate from local (mirror) if available
    const local = this.#local;
    if (local) {
      const raw = local.getItem(key);
      if (raw != null) {
        try {
          const parsed = JSON.parse(raw);
          // Populate session with the same value so subsequent reads hit session
          if (session) session.setItem(key, raw);
          return parsed;
        } catch {
          return null;
        }
      }
    }
    return this.#fallback.get(key);
  }

  /**
   * Set a value. `undefined` removes the key.
   */
  set(key, value) {
    if (!key) return;
    if (value === undefined) {
      this.remove(key);
      return;
    }
    const serialized = JSON.stringify(value);
    if (this.#session) this.#session.setItem(key, serialized);
    if (this.#local) this.#local.setItem(key, serialized);
    if (!this.#session && !this.#local) this.#fallback.set(key, value);
  }

  /**
   * Merge multiple values at once.
   */
  spread(values) {
    if (!values) return;
    Object.entries(values).forEach(([k, v]) => this.set(k, v));
  }

  /**
   * Remove a key from both session and local.
   */
  remove(key) {
    if (!key) return;
    if (this.#session) this.#session.removeItem(key);
    if (this.#local) this.#local.removeItem(key);
    this.#fallback.remove(key);
  }

  /**
   * Wipe session storage only. Local storage mirror is preserved.
   * Keeps keys listed in `preserveKeys` (e.g. the current user token).
   */
  clear(preserveKeys = []) {
    const preserved = new Set(preserveKeys);
    const kept = {};
    if (this.#session) {
      for (let i = 0; i < this.#session.length; i++) {
        const key = this.#session.key(i);
        if (key && preserved.has(key)) {
          kept[key] = this.#session.getItem(key);
        }
      }
      this.#session.clear();
      Object.entries(kept).forEach(([k, v]) => {
        if (v != null) this.#session.setItem(k, v);
      });
    }
    this.#fallback.clear();
    // Repopulate the fallback with preserved values
    Object.entries(kept).forEach(([k, v]) => {
      try {
        this.#fallback.set(k, JSON.parse(v));
      } catch {
        /* ignore */
      }
    });
  }

  /**
   * Wipe both session and local storage.
   */
  clearAll() {
    if (this.#session) this.#session.clear();
    if (this.#local) this.#local.clear();
    this.#fallback.clear();
  }

  /**
   * List all keys in session storage.
   */
  keys() {
    if (!this.#session) return this.#fallback.keys();
    const out = [];
    for (let i = 0; i < this.#session.length; i++) {
      const key = this.#session.key(i);
      if (key) out.push(key);
    }
    return out;
  }
}

// ------------------------------------------------------------------ helpers

function safeAccess(fn) {
  try {
    const storage = fn();
    // Some environments throw on access; some return a broken storage.
    // Probe with a read so we catch both cases.
    storage.getItem('__tb_state_probe__');
    return storage;
  } catch {
    return null;
  }
}