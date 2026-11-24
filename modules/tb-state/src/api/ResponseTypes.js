/**
 * Response body parsing modes.
 *
 * Callers choose how to interpret the response body. The default is JSON
 * — matching the TradeBridge API's standard envelope.
 */
export const ResponseTypes = Object.freeze({
  JSON: 'json',
  Text: 'text',
  Blob: 'blob',
  ArrayBuffer: 'arraybuffer',
});