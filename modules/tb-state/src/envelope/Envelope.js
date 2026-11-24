/**
 * Parser for the standard TradeBridge API response envelope (spec §1.2).
 *
 * Success:
 *   { success: true, message, data, timestamp, correlationId }
 *
 * Error:
 *   { success: false, code, message, errors: [{field, message}], timestamp, correlationId }
 *
 * Every call through {@link Api} returns a raw body from the server. The
 * Provider layer wraps that into this parsed shape so downstream code
 * never has to remember the discriminator (`success` vs `ok`).
 */
export class Envelope {
  /**
   * Parse a raw response body into a normalized envelope.
   *
   * Behavior:
   * - If the body is the standard shape (has a boolean `success`), honor it.
   * - If the body is anything else (proxy passthrough, HTML error page),
   *   wrap it into a best-effort envelope so callers always get the same
   *   shape from `Envelope.parse`.
   *
   * @param {*} raw
   * @returns {{
   *   success: boolean,
   *   data: any,
   *   message: string|null,
   *   code: string|null,
   *   errors: Array<{field: string, message: string}>,
   *   correlationId: string|null,
   *   timestamp: string|null
   * }}
   */
  static parse(raw) {
    if (raw === null) {
      return empty();
    }
    if (typeof raw !== 'object') {
      // Non-object body — very likely an HTML error page or a plain string
      return {
        ...empty(),
        success: false,
        message: typeof raw === 'string' ? truncate(raw) : String(raw),
      };
    }

    // Standard envelope
    if (typeof raw.success === 'boolean') {
      return {
        success: raw.success,
        data: raw.data ?? null,
        message: typeof raw.message === 'string' ? raw.message : null,
        code: typeof raw.code === 'string' ? raw.code : null,
        errors: normalizeErrors(raw.errors),
        correlationId: typeof raw.correlationId === 'string' ? raw.correlationId : null,
        timestamp: typeof raw.timestamp === 'string' ? raw.timestamp : null,
      };
    }

    // Non-standard shape (e.g. proxy passthrough from notification-service
    // internal endpoints). Treat as successful data-carrying body so
    // callers can inspect it directly.
    return {
      ...empty(),
      success: true,
      data: raw,
    };
  }

  /**
   * Combine the HTTP status with an envelope to decide whether the
   * caller should consider the operation successful.
   *
   * A 2xx response with `success: false` is a server-side failure (rare
   * but possible — some vendors do this). A non-2xx with `success: true`
   * is nonsense; treat as failure.
   */
  static isSuccess(status, envelope) {
    const httpOk = status >= 200 && status < 300;
    const envelopeOk = envelope?.success === true;
    return httpOk && envelopeOk;
  }

  /**
   * Extract the error messages as a flat array of strings for display.
   */
  static errorMessages(envelope) {
    if (!envelope) return [];
    const out = [];
    if (envelope.message) out.push(envelope.message);
    if (Array.isArray(envelope.errors)) {
      envelope.errors.forEach((e) => {
        if (e?.message) out.push(e.field ? `${e.field}: ${e.message}` : e.message);
      });
    }
    return out;
  }
}

// ------------------------------------------------------------------ helpers

function empty() {
  return {
    success: false,
    data: null,
    message: null,
    code: null,
    errors: [],
    correlationId: null,
    timestamp: null,
  };
}

function normalizeErrors(errors) {
  if (!Array.isArray(errors)) return [];
  return errors
    .filter((e) => e && typeof e === 'object')
    .map((e) => ({
      field: typeof e.field === 'string' ? e.field : '',
      message: typeof e.message === 'string' ? e.message : '',
    }));
}

function truncate(value, max = 500) {
  return value.length > max ? `${value.slice(0, max)}…` : value;
}