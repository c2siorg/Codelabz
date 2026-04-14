# Docker Setup Guide

This project ships with two Docker configurations:

| File | Purpose |
|---|---|
| `Dockerfile` | **Production** – multi-stage build, served by nginx |
| `Dockerfile.dev` | **Development** – Vite dev server with hot-reload |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 24
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 2

---

## Quick Start

### 1. Copy environment variables

```bash
cp .env.sample .env
# Fill in your Firebase credentials in .env
```

### 2. Production build (nginx, port 80)

```bash
docker compose up app
```

Then open <http://localhost>.

### 3. Development server with hot-reload (port 5173)

```bash
docker compose up app-dev
```

Then open <http://localhost:5173>.

### 4. Run with Firebase emulators

```bash
docker compose up app emulator          # production + emulators
# or
docker compose up app-dev emulator      # development + emulators
```

---

## Building manually

```bash
# Production image
docker build -t codelabz:latest .

# Development image
docker build -f Dockerfile.dev -t codelabz:dev .
```

## Running a standalone production container

```bash
docker run -p 80:80 --env-file .env codelabz:latest
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│ Stage 1 – builder (node:20-alpine)          │
│   npm ci → npm run build → /app/dist        │
└───────────────────┬─────────────────────────┘
                    │  COPY /app/dist
┌───────────────────▼─────────────────────────┐
│ Stage 2 – production (nginx:1.27-alpine)    │
│   /usr/share/nginx/html  ← built assets     │
│   nginx.conf             ← SPA routing      │
│   Port 80                                   │
└─────────────────────────────────────────────┘
```

The final image contains **only nginx + compiled static files** – no Node.js runtime, no source code, and no dev dependencies.  
This keeps the image small and reduces the attack surface.

### nginx features enabled

- **Gzip compression** for JS, CSS, fonts, and SVGs
- **Immutable caching** for hashed static assets (1 year)
- **SPA fallback** – all unknown paths serve `index.html` so React Router works correctly
