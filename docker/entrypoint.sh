#!/bin/sh
# ============================================================
# TradeBridge Africa — Frontend container entrypoint
# Injects runtime config into /config.js (served by nginx),
# then hands off to nginx.
# ============================================================
set -eu

CONFIG_FILE="/usr/share/nginx/html/config.js"

# Defaults (only applied if the env var is unset at runtime)
: "${BFF_URL:=http://localhost:8080}"
: "${APP_ENV:=production}"
: "${ENABLE_FARO:=false}"
: "${FARO_URL:=}"
: "${DEFAULT_LOCALE:=en}"
: "${STATIC_BASE_URL:=}"

echo "==> Writing runtime config to ${CONFIG_FILE}"
cat > "${CONFIG_FILE}" <<EOF
window.__APP_CONFIG__ = {
  bffUrl: "${BFF_URL}",
  appEnv: "${APP_ENV}",
  faroEnabled: ${ENABLE_FARO},
  faroUrl: "${FARO_URL}",
  defaultLocale: "${DEFAULT_LOCALE}",
  staticBaseUrl: "${STATIC_BASE_URL}"
};
EOF

# Basic sanity check on generated JS
if ! grep -q 'window.__APP_CONFIG__' "${CONFIG_FILE}"; then
  echo "ERROR: failed to generate runtime config" >&2
  exit 1
fi

echo "==> Runtime config: bffUrl=${BFF_URL} appEnv=${APP_ENV}"

exec "$@"