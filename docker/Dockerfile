# syntax=docker/dockerfile:1.7
# ============================================================
# TradeBridge Africa — Frontend production image
# Multi-stage: build tb-state + ui → copy to nginx
# ============================================================

# ---------- Stage 1: build ----------
FROM node:20-alpine AS builder

WORKDIR /workspace

# Install build essentials (native modules)
RUN apk add --no-cache python3 make g++ git

# Copy workspace manifests first for better cache reuse
COPY package.json yarn.lock ./
COPY modules/tb-state/package.json ./modules/tb-state/
COPY ui/package.json ./ui/

# Install all workspace dependencies
RUN yarn install --frozen-lockfile --network-timeout 600000

# Copy the rest of the sources
COPY modules ./modules
COPY ui ./ui

# Build shared state library first (UI depends on it)
RUN yarn workspace tb-state build

# Build the UI (production, content-hashed assets)
RUN yarn workspace ui build

# ---------- Stage 2: runtime ----------
FROM nginx:1.27-alpine AS runtime

# Remove default server config
RUN rm /etc/nginx/conf.d/default.conf

# Install envsubst for runtime config injection
RUN apk add --no-cache gettext

COPY docker/nginx.conf /etc/nginx/conf.d/app.conf
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copy built assets from builder
COPY --from=builder /workspace/ui/build /usr/share/nginx/html

# Non-root
RUN addgroup -S app && adduser -S app -G app \
    && chown -R app:app /usr/share/nginx/html /var/cache/nginx /var/run
USER app

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -q -O- http://127.0.0.1:8080/healthz || exit 1

EXPOSE 8080

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]