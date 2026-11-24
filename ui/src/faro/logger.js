/**
 * Faro logger facade.
 *
 * Exposes a small API surface used by the app:
 *   faro.api?.pushError(err, { context })
 *   faro.api?.pushLog(msg, { level, context })
 *   faro.api?.pushEvent(name, { attributes })
 *   faro.api?.setUser({ id, email, ... })
 *
 * Before init() has run, `faro.api` is undefined and every call safely
 * no-ops thanks to optional chaining.
 */

let faroApi = null;

export const faro = {
  get api() {
    return faroApi;
  },
  _setApi(api) {
    faroApi = api;
  },
};