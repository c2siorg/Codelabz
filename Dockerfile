# =============================================================================
# Stage 1: Builder
# Install dependencies and compile the Vite/React SPA into static assets.
#
# VITE_APP_* variables are baked into the JS bundle at build time by Vite.
# Pass them via --build-arg when running: docker build --build-arg VITE_APP_FIREBASE_API_KEY=...
# =============================================================================
FROM node:18-alpine AS builder

WORKDIR /app

# Declare build-time env vars (all VITE_APP_* + emulator toggle)
ARG VITE_APP_FIREBASE_API_KEY
ARG VITE_APP_AUTH_DOMAIN
ARG VITE_APP_FIREBASE_PROJECT_ID
ARG VITE_APP_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_APP_FIREBASE_APP_ID
ARG VITE_APP_FIREBASE_MEASUREMENTID
ARG VITE_APP_DATABASE_URL
ARG VITE_APP_FIREBASE_STORAGE_BUCKET
ARG VITE_APP_FIREBASE_FCM_VAPID_KEY
ARG VITE_APP_USE_EMULATOR=false

# Make build args available as env vars so Vite picks them up
ENV VITE_APP_FIREBASE_API_KEY=$VITE_APP_FIREBASE_API_KEY \
    VITE_APP_AUTH_DOMAIN=$VITE_APP_AUTH_DOMAIN \
    VITE_APP_FIREBASE_PROJECT_ID=$VITE_APP_FIREBASE_PROJECT_ID \
    VITE_APP_FIREBASE_MESSAGING_SENDER_ID=$VITE_APP_FIREBASE_MESSAGING_SENDER_ID \
    VITE_APP_FIREBASE_APP_ID=$VITE_APP_FIREBASE_APP_ID \
    VITE_APP_FIREBASE_MEASUREMENTID=$VITE_APP_FIREBASE_MEASUREMENTID \
    VITE_APP_DATABASE_URL=$VITE_APP_DATABASE_URL \
    VITE_APP_FIREBASE_STORAGE_BUCKET=$VITE_APP_FIREBASE_STORAGE_BUCKET \
    VITE_APP_FIREBASE_FCM_VAPID_KEY=$VITE_APP_FIREBASE_FCM_VAPID_KEY \
    VITE_APP_USE_EMULATOR=$VITE_APP_USE_EMULATOR

# Copy package manifests first to leverage Docker layer cache
COPY package*.json ./

# --legacy-peer-deps: @mui/styles declares react@^17 peer dep while project
# uses react@18. This is a known upstream issue, safe to ignore at runtime.
RUN npm install --legacy-peer-deps

# Copy source and build
COPY . .
RUN npm run build

# =============================================================================
# Stage 2: Production
# Serve the compiled /dist with nginx on a minimal alpine image (~25 MB).
# No Node.js, no source code, no dev dependencies — just the static assets.
# =============================================================================
FROM nginx:stable-alpine AS production

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config (handles SPA routing + caching + gzip)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Run as non-root for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
    chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

USER appuser

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
