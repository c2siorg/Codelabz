# Production-Ready Multi-Stage Dockerfile for Codelabz
# This Dockerfile creates an optimized production build

# ============================================
# Stage 1: Builder
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies once (including dev deps needed for build)
# Using --legacy-peer-deps for React version conflicts
# Using --ignore-scripts to skip husky (not needed in Docker)
RUN npm install --legacy-peer-deps --ignore-scripts && \
    npm cache clean --force

# Build-time variables for Vite — passed via --build-arg or Compose args:
# these are declared here so Vite sees them as env vars during the build.
# They are NOT persisted as image environment variables.
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Copy application source
COPY . .

# Build the application
RUN npm run build

# ============================================
# Stage 2: Production (Nginx Server)
# ============================================
FROM nginx:alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
