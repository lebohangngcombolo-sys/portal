import { CacheStrategies } from './CacheStrategies.js';
import { ResponseTypes } from './ResponseTypes.js';
import { CacheStore } from './CacheStore.js';

const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * XMLHttpRequest-based HTTP client.
 *
 * Design goals:
 * - Zero runtime dependencies
 * - Promise-based
 * - Works in browsers (uses XHR) and in JSDOM (tests)
 * - Never throws on non-2xx responses — callers get { ok, status, data }
 *   and decide how to handle. This keeps HTTP semantics visible to the
 *   caller instead of hidden behind exceptions.
 *
 * Supported methods: GET, POST, PUT, PATCH, DELETE, HEAD.
 * Request bodies:
 *   - Plain object         → JSON.stringify + Content-Type: application/json
 *   - FormData             → sent as-is (browser sets multipart boundary)
 *   - URLSearchParams      → sent as-is (Content-Type: application/x-www-form-urlencoded)
 *   - string               → sent as-is (caller sets Content-Type)
 */
export class Api {
  static #defaultHeaders = {};

  /**
   * Set default headers applied to every request.
   * Called by the UI at startup to attach Content-Type etc.
   *
   * @param {Record<string,string>} headers
   */
  static setDefaultHeaders(headers) {
    Api.#defaultHeaders = { ...headers };
  }

  /**
   * Perform an HTTP request.
   *
   * @param {object} options
   * @param {string} options.method — 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD'
   * @param {string} options.path   — URL path (may be absolute or relative)
   * @param {object} [options.params] — query params OR path substitutions
   * @param {object|FormData|URLSearchParams|string} [options.body]
   * @param {Record<string,string>} [options.headers]
   * @param {string} [options.responseType] — ResponseTypes value
   * @param {string} [options.cache] — CacheStrategies value (GET only)
   * @param {number} [options.timeout]
   * @param {function} [options.onUploadProgress] — ({loaded, total}) => void
   * @param {function} [options.onDownloadProgress] — ({loaded, total}) => void
   * @param {object} [options.withCredentials] — Boolean wrapper: { withCredentials: true }
   * @returns {Promise<{ok: boolean, status: number, data: any, headers: Record<string,string>, error?: Error}>}
   */
  static async request(options) {
    const method = (options.method || 'GET').toUpperCase();
    const responseType = options.responseType || ResponseTypes.JSON;
    const cacheStrategy =
      method === 'GET' ? options.cache || CacheStrategies.None : CacheStrategies.None;

    const url = buildUrl(options.path, options.params, method);
    const cacheKey = CacheStore.keyFor({ method, url });

    if (method === 'GET') {
      return Api.handleGet({ url, cacheKey, cacheStrategy, responseType, options });
    }
    return Api.performRequest({ url, method, responseType, options });
  }

  // ------------------------------------------------------------------ GET with caching

  static async handleGet({ url, cacheKey, cacheStrategy, responseType, options }) {
    switch (cacheStrategy) {
      case CacheStrategies.None:
        return Api.performRequest({ url, method: 'GET', responseType, options });

      case CacheStrategies.CacheOnly: {
        const cached = await CacheStore.get(cacheKey);
        if (cached) return normalizeCached(cached, responseType);
        return {
          ok: false,
          status: 0,
          data: null,
          headers: {},
          error: new Error('Not in cache'),
        };
      }

      case CacheStrategies.CacheFirst: {
        const cached = await CacheStore.get(cacheKey);
        if (cached) return normalizeCached(cached, responseType);
        const fresh = await Api.performRequest({ url, method: 'GET', responseType, options });
        if (fresh.ok) await writeCache(cacheKey, fresh, responseType);
        return fresh;
      }

      case CacheStrategies.NetworkFirst: {
        try {
          const fresh = await Api.performRequest({ url, method: 'GET', responseType, options });
          if (fresh.ok) await writeCache(cacheKey, fresh, responseType);
          return fresh;
        } catch (err) {
          const cached = await CacheStore.get(cacheKey);
          if (cached) return normalizeCached(cached, responseType);
          throw err;
        }
      }

      case CacheStrategies.CacheThenNetwork: {
        // Return cached immediately (as a fast response) AND kick off network.
        // The current API returns a single response, so we honor the network
        // result and update the cache in the background. Callers that want
        // the cached value should use CacheFirst.
        const fresh = await Api.performRequest({ url, method: 'GET', responseType, options });
        if (fresh.ok) await writeCache(cacheKey, fresh, responseType);
        return fresh;
      }

      default:
        return Api.performRequest({ url, method: 'GET', responseType, options });
    }
  }

  // ------------------------------------------------------------------ primitives

  static async performRequest({ url, method, responseType, options }) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method, url, true);
      xhr.timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;

      const headers = { ...Api.#defaultHeaders, ...(options.headers || {}) };
      Object.entries(headers).forEach(([k, v]) => {
        if (v != null) xhr.setRequestHeader(k, v);
      });

      // Response type
      if (responseType === ResponseTypes.ArrayBuffer) {
        xhr.responseType = 'arraybuffer';
      } else if (responseType === ResponseTypes.Blob) {
        xhr.responseType = 'blob';
      } else {
        xhr.responseType = 'text';
      }

      if (options.withCredentials) {
        xhr.withCredentials = true;
      }

      if (options.onUploadProgress && xhr.upload) {
        xhr.upload.onprogress = (e) => {
          options.onUploadProgress({ loaded: e.loaded, total: e.total });
        };
      }

      if (options.onDownloadProgress) {
        xhr.onprogress = (e) => {
          options.onDownloadProgress({ loaded: e.loaded, total: e.total });
        };
      }

      xhr.onload = () => {
        const responseHeaders = parseHeaders(xhr.getAllResponseHeaders());
        const data = parseBody(xhr.response, responseType);

        // Emit a resolved value even on 4xx/5xx — non-2xx is not an error
        // condition for the caller to decide on; only network failures
        // (onerror) reject.
        resolve({
          ok: xhr.status >= 200 && xhr.status < 300,
          status: xhr.status,
          data,
          headers: responseHeaders,
        });
      };

      xhr.onerror = () => {
        reject(
          Object.assign(new Error('Network error'), {
            status: 0,
            headers: parseHeaders(xhr.getAllResponseHeaders()),
          }),
        );
      };

      xhr.ontimeout = () => {
        reject(
          Object.assign(new Error('Request timed out'), {
            status: 0,
          }),
        );
      };

      xhr.onabort = () => {
        reject(
          Object.assign(new Error('Request aborted'), {
            status: 0,
          }),
        );
      };

      try {
        xhr.send(serializeBody(options.body, headers, xhr));
      } catch (err) {
        reject(err);
      }
    });
  }
}

// ------------------------------------------------------------------ helpers

function buildUrl(path, params, method) {
  if (!path) throw new Error('Api.request: path is required');
  if (!params) return path;

  // Path substitutions: values for `:name` segments
  let resolvedPath = path;
  const remaining = {};
  for (const [key, value] of Object.entries(params)) {
    const token = `:${key}`;
    if (resolvedPath.includes(token)) {
      resolvedPath = resolvedPath.replace(
        token,
        encodeURIComponent(String(value)),
      );
    } else {
      remaining[key] = value;
    }
  }

  // GET/HEAD → query string
  if (method === 'GET' || method === 'HEAD') {
    const qs = buildQueryString(remaining);
    if (qs) return resolvedPath + (resolvedPath.includes('?') ? '&' : '?') + qs;
  }
  return resolvedPath;
}

function buildQueryString(obj) {
  if (!obj || Object.keys(obj).length === 0) return '';
  const params = new URLSearchParams();
  Object.entries(obj).forEach(([key, value]) => {
    if (value == null) return;
    if (Array.isArray(value)) {
      value.forEach((v) => params.append(key, String(v)));
    } else {
      params.append(key, String(value));
    }
  });
  return params.toString();
}

function serializeBody(body, headers, xhr) {
  if (body == null) return null;

  if (body instanceof FormData) {
    // Let the browser set Content-Type with the multipart boundary
    return body;
  }
  if (body instanceof URLSearchParams) {
    if (!hasHeader(headers, 'Content-Type')) {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
    }
    return body.toString();
  }
  if (typeof body === 'string') {
    return body;
  }
  // Default: JSON
  if (!hasHeader(headers, 'Content-Type')) {
    xhr.setRequestHeader('Content-Type', 'application/json');
  }
  return JSON.stringify(body);
}

function hasHeader(headers, name) {
  const lower = name.toLowerCase();
  return Object.keys(headers).some((k) => k.toLowerCase() === lower);
}

function parseHeaders(rawHeaders) {
  const headers = {};
  if (!rawHeaders) return headers;
  rawHeaders
    .trim()
    .split(/[\r\n]+/)
    .forEach((line) => {
      const index = line.indexOf(':');
      if (index > 0) {
        const name = line.slice(0, index).trim().toLowerCase();
        const value = line.slice(index + 1).trim();
        if (name) headers[name] = value;
      }
    });
  return headers;
}

function parseBody(rawBody, responseType) {
  if (rawBody == null) return null;
  if (responseType === ResponseTypes.JSON) {
    if (typeof rawBody !== 'string') return rawBody;
    if (rawBody.length === 0) return null;
    try {
      return JSON.parse(rawBody);
    } catch {
      // Non-JSON body — return as-is so callers can inspect (e.g. HTML error page)
      return rawBody;
    }
  }
  return rawBody;
}

async function writeCache(cacheKey, response, responseType) {
  // Only cache text-representable bodies. Blobs and ArrayBuffers don't
  // serialize into the Cache API cleanly without extra work; skip them.
  if (responseType !== ResponseTypes.JSON && responseType !== ResponseTypes.Text) {
    return;
  }
  const bodyString =
    typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  await CacheStore.set(cacheKey, {
    status: response.status,
    headers: response.headers,
    body: bodyString,
  });
}

function normalizeCached(cached, responseType) {
  return {
    ok: cached.status >= 200 && cached.status < 300,
    status: cached.status,
    data: parseBody(cached.body, responseType),
    headers: cached.headers,
    fromCache: true,
  };
}