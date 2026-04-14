# ──────────────────────────────────────────────────────────────
# Stage 1: Build the Vite / React application
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (separate layer → better caching)
COPY package*.json ./
RUN npm ci --prefer-offline

# Copy source code and build
COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────────
# Stage 2: Serve the production bundle with nginx
# ──────────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Remove the default nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Use a custom nginx config that handles SPA client-side routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
