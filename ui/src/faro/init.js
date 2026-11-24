/**
 * Grafana Faro bootstrap.
 *
 * Only initializes when `process.env.ENABLE_FARO === 'true'` and a
 * `FARO_URL` is provided. Never throws — if Faro fails to load, the app
 * continues without telemetry.
 */
import { faro } from './logger.js';

let initialized = false;

export async function initFaro() {
  if (initialized) return;
  initialized = true;

  const enabled = String(process.env.ENABLE_FARO || 'false').toLowerCase() === 'true';
  const faroUrl = process.env.FARO_URL || '';

  if (!enabled || !faroUrl) {
    // eslint-disable-next-line no-console
    console.info('[faro] disabled');
    return;
  }

  try {
    const { initializeFaro } = await import('@grafana/faro-web-sdk');
    const app = initializeFaro({
      url: faroUrl,
      app: {
        name: 'tradebridge-ui',
        version: process.env.APP_ENV || 'local',
        environment: process.env.APP_ENV || 'local',
      },
    });
    faro._setApi(app.api);
    // eslint-disable-next-line no-console
    console.info('[faro] initialized');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[faro] failed to initialize', err);
  }
}