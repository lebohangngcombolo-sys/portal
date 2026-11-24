/**
 * Shared request proxy.
 *
 * Responsibilities:
 * - Deduplicate in-flight requests with the same key (method + path + body).
 * - Unwrap the standard API envelope (spec §1.2).
 * - Normalize result shape across providers: { ok, status, result, messages, errors, code, correlationId }.
 * - Push errors to Grafana Faro (if enabled).
 * - Trigger a session-expired handler on 401.
 * - Never leak sensitive tokens into logs.
 *
 * Consumers should NOT call Api directly — always go through Provider so
 * that deduplication, envelope parsing, and session handling are uniform.
 */

import { Api, CacheStrategies, Envelope } from 'tb-state';

import { ERROR_CODES, isSessionInvalidating } from '../common/constants/errors.js';
import { faro } from '../faro/logger.js';
import { authTokenStore } from './AuthProvider.js';

class ProviderImpl {
  #inflight = new Map();
  #sessionExpiredHandler = null;

  /**
   * Register a callback invoked when a 401-like session invalidating response
   * is observed. AuthProvider wires this to its logout flow.
   */
  setSessionExpiredHandler(handler) {
    this.#sessionExpiredHandler = handler;
  }

  /**
   * Perform an HTTP request through the shared pipeline.
   *
   * @param {object} options
   * @param {string} options.method
   * @param {string} options.path
   * @param {object} [options.params]
   * @param {object} [options.body]
   * @param {object} [options.headers]
   * @param {string} [options.cache] — CacheStrategies value
   * @param {boolean} [options.skipAuth] — do not add Authorization header
   * @param {boolean} [options.skipSessionHandling] — do not refresh on 401
   * @param {string} [options.dedupeKey] — custom deduplication key (default: method+path+params)
   * @returns {Promise<ProviderResult>}
   */
  async request(options) {
    const dedupeKey = options.dedupeKey ?? this.#keyOf(options);
    if (this.#inflight.has(dedupeKey)) {
      return this.#inflight.get(dedupeKey);
    }

    const promise = this.#execute(options)
      .finally(() => {
        this.#inflight.delete(dedupeKey);
      });

    this.#inflight.set(dedupeKey, promise);
    return promise;
  }

  /**
   * Clear the in-flight registry — mainly for tests.
   */
  reset() {
    this.#inflight.clear();
  }

  // ------------------------------------------------------------------ internals

  async #execute(options, allowAuthRetry = true) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = this.#buildHeaders(options);

    let raw;
    try {
      raw = await Api.request({
        method,
        path: options.path,
        params: options.params,
        body: options.body,
        headers,
        cache: options.cache ?? CacheStrategies.None,
        responseType: options.responseType,
        onUploadProgress: options.onUploadProgress,
      });
    } catch (err) {
      // Network / timeout — never a 401 path
      faro.api?.pushError(err, { context: { path: options.path, method } });
      return {
        ok: false,
        status: 0,
        result: null,
        messages: [err.message || 'Network error'],
        errors: [],
        code: err.name === 'Request timed out' ? ERROR_CODES.TIMEOUT : ERROR_CODES.NETWORK_ERROR,
        correlationId: null,
      };
    }

    const envelope = Envelope.parse(raw.data);
    const correlationId = this.#extractCorrelationId(raw.headers, envelope);
    const ok = Envelope.isSuccess(raw.status, envelope);

    // Session invalidation — trigger handler once per response
    const code = envelope.code || this.#codeFromStatus(raw.status);
    if (
      !ok &&
      (raw.status === 401 || isSessionInvalidating(code)) &&
      this.#sessionExpiredHandler &&
      !options.skipAuth &&
      !options.skipSessionHandling
    ) {
      const refreshed = await this.#sessionExpiredHandler({
        status: raw.status,
        code,
        alreadyRetried: !allowAuthRetry,
      });
      if (refreshed && allowAuthRetry) {
        return this.#execute(options, false);
      }
    }

    // Log failures to Faro with correlation ID for cross-service tracing
    if (!ok) {
      faro.api?.pushLog(`api failure: ${options.method} ${options.path}`, {
        context: {
          status: raw.status,
          code,
          correlationId,
          messages: Envelope.errorMessages(envelope),
        },
        level: 'warn',
      });
    }

    return {
      ok,
      status: raw.status,
      result: envelope.data,
      messages: envelope.message ? [envelope.message] : [],
      errors: envelope.errors ?? [],
      code,
      correlationId,
      fromCache: raw.fromCache ?? false,
      rawData: raw.data,
    };
  }

  #buildHeaders(options) {
    const headers = { ...(options.headers || {}) };
    if (!options.skipAuth) {
      const token = authTokenStore?.getAccessToken?.();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    return headers;
  }

  #keyOf(options) {
    const method = (options.method || 'GET').toUpperCase();
    const params = options.params ? JSON.stringify(options.params) : '';
    const body =
      options.body && typeof options.body === 'object'
        ? JSON.stringify(options.body)
        : String(options.body ?? '');
    return `${method}:${options.path}:${params}:${body}`;
  }

  #extractCorrelationId(headers, envelope) {
    if (envelope.correlationId) return envelope.correlationId;
    return (
      headers?.['x-correlation-id'] ||
      headers?.['X-Correlation-Id'] ||
      null
    );
  }

  #codeFromStatus(status) {
    if (status === 0) return ERROR_CODES.NETWORK_ERROR;
    if (status === 401) return ERROR_CODES.UNAUTHORIZED;
    if (status === 403) return ERROR_CODES.FORBIDDEN;
    if (status === 404) return ERROR_CODES.NOT_FOUND;
    if (status === 409) return ERROR_CODES.CONFLICT;
    if (status === 422) return ERROR_CODES.UNPROCESSABLE_ENTITY;
    if (status === 429) return ERROR_CODES.TOO_MANY_REQUESTS;
    if (status >= 500) return ERROR_CODES.INTERNAL_ERROR;
    return ERROR_CODES.BAD_REQUEST;
  }
}

/**
 * Shared singleton — providers import this and delegate requests to it.
 */
export const Provider = new ProviderImpl();

/**
 * JSDoc type for consumers.
 *
 * @typedef {object} ProviderResult
 * @property {boolean} ok
 * @property {number} status
 * @property {any}    result
 * @property {string[]} messages
 * @property {{field: string, message: string}[]} errors
 * @property {string|null} code
 * @property {string|null} correlationId
 * @property {boolean} fromCache
 * @property {any}    rawData
 */