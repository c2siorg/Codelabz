# Multi-Stage Docker Guide

This guide covers the multi-stage Docker setup for CodeLabz — a production build that compiles and serves the Vite/React SPA from a minimal nginx image, and a local development environment with the full Firebase Emulator Suite.

---

## Quick Start

```bash
# 1. Set up environment variables
cp .env.sample .env   # then fill in your Firebase credentials

# 2a. Run production build (serves on http://localhost:8080 by default)
docker compose --profile prod up --build

# 2b. OR run local dev environment (Vite HMR + Firebase Emulators)
docker compose --profile dev up --build
```

---

## Why Multi-Stage?

A standard single-stage Dockerfile would produce an image containing Node.js, all 2000+ npm packages, and the full source tree — over 1 GB in size. A multi-stage build solves this by separating the **build environment** from the **runtime environment**:

```
┌─────────────────────────────────────────────────────────┐
│  Stage 1: builder  (node:18-alpine)                     │
│                                                         │
│  npm install --legacy-peer-deps                         │
│  npm run build  →  /app/dist  (compiled static assets)  │
│                          │                              │
│                          │  COPY --from=builder         │
│                          ▼                              │
│  Stage 2: production  (nginx:stable-alpine)             │
│                                                         │
│  /usr/share/nginx/html  ←  /app/dist                    │
│  nginx serves static files on port 80                   │
└─────────────────────────────────────────────────────────┘
```

Node.js, `node_modules`, and source code are **discarded** — they only exist temporarily in Stage 1. The final image contains only nginx and the compiled HTML/JS/CSS.

|                           | Single-stage | Multi-stage (this PR) |
| ------------------------- | ------------ | --------------------- |
| Final image size          | ~1.5 GB      | **75.8 MB**           |
| Node.js in image          | Yes          | No                    |
| Source code in image      | Yes          | No                    |
| Dev dependencies in image | Yes          | No                    |
| Attack surface            | High         | Minimal               |

---

## Overview

| Mode        | Dockerfile                 | Final image                   | Port                  |
| ----------- | -------------------------- | ----------------------------- | --------------------- |
| Production  | `Dockerfile` (multi-stage) | 75.8 MB — nginx:stable-alpine | 80                    |
| Development | `Dockerfile.dev`           | node:18 + Firebase Emulators  | 5173 + emulator ports |

---

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) ≥ 20.10
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 2.0 (included with Docker Desktop)

---

## 1. Configure Environment Variables

Copy the sample env file and fill in your Firebase project credentials:

```bash
cp .env.sample .env
```

Edit `.env` and replace every `<placeholder>` with real values from your [Firebase Console](https://console.firebase.google.com/):

| Variable                                | Description                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `VITE_APP_FIREBASE_API_KEY`             | Firebase Web API key                                                            |
| `VITE_APP_AUTH_DOMAIN`                  | Firebase Auth domain (e.g. `project.firebaseapp.com`)                           |
| `VITE_APP_FIREBASE_PROJECT_ID`          | Firebase project ID                                                             |
| `VITE_APP_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID                                                                   |
| `VITE_APP_FIREBASE_APP_ID`              | Firebase App ID                                                                 |
| `VITE_APP_FIREBASE_MEASUREMENTID`       | Google Analytics measurement ID (e.g. `G-XXXXXXXXXX`)                           |
| `VITE_APP_DATABASE_URL`                 | Realtime Database URL                                                           |
| `VITE_APP_FIREBASE_STORAGE_BUCKET`      | Cloud Storage bucket                                                            |
| `VITE_APP_FIREBASE_FCM_VAPID_KEY`       | FCM VAPID key for web push notifications                                        |
| `VITE_APP_USE_EMULATOR`                 | Set `true` to point the app at local emulators, `false` for production Firebase |

> **Important:** All `VITE_APP_*` variables are baked into the JavaScript bundle at **build time** by Vite. They are not runtime environment variables — the image must be rebuilt whenever they change.

---

## 2. Production (multi-stage build → nginx)

### Run with Docker Compose (recommended)

```bash
docker compose --profile prod up --build
```

Open **http://localhost:8080** once the container starts.

By default, Compose maps host port `8080` to container port `80`. Override with `APP_PROD_PORT` if needed (example: `APP_PROD_PORT=80 docker compose --profile prod up --build`).

```bash
# Stop and remove the container
docker compose --profile prod down
```

### Run with plain Docker

Useful for CI/CD pipelines or when Compose is not available:

```bash
docker build \
  --build-arg VITE_APP_FIREBASE_API_KEY=your_api_key \
  --build-arg VITE_APP_AUTH_DOMAIN=your_project.firebaseapp.com \
  --build-arg VITE_APP_FIREBASE_PROJECT_ID=your_project_id \
  --build-arg VITE_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  --build-arg VITE_APP_FIREBASE_APP_ID=your_app_id \
  --build-arg VITE_APP_FIREBASE_MEASUREMENTID=G-XXXXXXXXXX \
  --build-arg VITE_APP_DATABASE_URL=https://your_project.firebaseio.com \
  --build-arg VITE_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com \
  --build-arg VITE_APP_FIREBASE_FCM_VAPID_KEY=your_vapid_key \
  -t codelabz:prod .

docker run -p 80:80 codelabz:prod
```

### Security

The final image contains **no Node.js, no source code, and no dev dependencies** — only the nginx binary and the compiled static assets. The container runs as a non-root user (`appuser`); Docker grants `CAP_NET_BIND_SERVICE` by default so nginx can bind port 80 inside the container without requiring root.

### What the nginx config does

The bundled `nginx.conf` is configured for a React SPA:

- **SPA routing** — falls back to `index.html` for all paths so React Router works correctly
- **Aggressive caching** — Vite outputs content-hashed filenames (e.g. `index-abc123.js`), cached for 1 year
- **No caching for `index.html`** — ensures new deployments take effect immediately
- **Gzip compression** — enabled for JS, CSS, JSON, SVG, and plain text

---

## 3. Development (Vite HMR + Firebase Emulators)

The dev setup runs the Vite dev server and all Firebase emulators inside a single container. Seed data is imported from `testdata/` on startup. The project source is **volume-mounted** so edits on the host are reflected immediately via Vite's hot-module replacement.

```bash
docker compose --profile dev up --build
```

Port map:

| Service                   | URL                   |
| ------------------------- | --------------------- |
| Vite Dev Server (HMR)     | http://localhost:5173 |
| Firebase Emulator UI      | http://localhost:4000 |
| Firestore Emulator        | localhost:8080        |
| Auth Emulator             | localhost:9099        |
| Realtime Database         | localhost:9000        |
| Cloud Functions           | localhost:5001        |
| Storage Emulator          | localhost:9199        |
| Pub/Sub Emulator          | localhost:8085        |
| Firebase Hosting Emulator | localhost:5000        |
| Emulator Hub              | localhost:4400        |

```bash
# Stop and remove the container
docker compose --profile dev down
```

---

## 4. CI/CD Usage (GitHub Actions example)

```yaml
- name: Build production image
  run: |
    docker build \
      --build-arg VITE_APP_FIREBASE_API_KEY=${{ secrets.VITE_APP_FIREBASE_API_KEY }} \
      --build-arg VITE_APP_AUTH_DOMAIN=${{ secrets.VITE_APP_AUTH_DOMAIN }} \
      --build-arg VITE_APP_FIREBASE_PROJECT_ID=${{ secrets.VITE_APP_FIREBASE_PROJECT_ID }} \
      --build-arg VITE_APP_FIREBASE_MESSAGING_SENDER_ID=${{ secrets.VITE_APP_FIREBASE_MESSAGING_SENDER_ID }} \
      --build-arg VITE_APP_FIREBASE_APP_ID=${{ secrets.VITE_APP_FIREBASE_APP_ID }} \
      --build-arg VITE_APP_FIREBASE_MEASUREMENTID=${{ secrets.VITE_APP_FIREBASE_MEASUREMENTID }} \
      --build-arg VITE_APP_DATABASE_URL=${{ secrets.VITE_APP_DATABASE_URL }} \
      --build-arg VITE_APP_FIREBASE_STORAGE_BUCKET=${{ secrets.VITE_APP_FIREBASE_STORAGE_BUCKET }} \
      --build-arg VITE_APP_FIREBASE_FCM_VAPID_KEY=${{ secrets.VITE_APP_FIREBASE_FCM_VAPID_KEY }} \
      -t codelabz:${{ github.sha }} .
```

All `VITE_APP_*` values should be stored as [GitHub Actions secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) — never hardcoded in the workflow file.

---

## Troubleshooting

### Firebase features not working in the production container

The credentials are compiled into the JS bundle at build time. If Firebase is not connecting, verify your `.env` values and rebuild:

```bash
docker compose --profile prod up --build
```

### Dev container is slow on first startup

The Firebase emulators download their JARs during the first image build. Subsequent builds use Docker's layer cache and start significantly faster.

### nginx returns 404 on page refresh

This means the `nginx.conf` is not being used. Ensure `nginx.conf` is present in the project root alongside the `Dockerfile` — it must be copied into the image during the build.
