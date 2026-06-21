# Docker Setup

## Requirements

- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+ (ships with Docker Desktop)

---

## Quickstart (Development)

```bash
cp .env.sample .env
docker compose up --build
```

That's it. No Firebase account, no `npm install`, no Java everything runs inside Docker.

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| Emulator UI | http://localhost:4000 |

Test credentials (seeded automatically):

```
Email: sougatariju13@gmail.com
Password: 123456
```

---

## What happens when you run it

1. Docker builds two images the Firebase emulator image (`node:22-alpine` + OpenJDK 17 + `firebase-tools@13.13.0`) and the app image (`node:22-alpine` + `node_modules`)
2. The emulator container starts and imports pre-seeded data from `./testdata`
3. Docker polls `http://localhost:4400/emulators` every 5 seconds to detect when emulators are ready
4. Once healthy, the Vite dev server starts automatically
5. Source files are bind-mounted so HMR works edit a file and the browser updates instantly

> **Note on first run:** Firebase downloads emulator jars on every container start (~200 MB: Firestore, Database, Pub/Sub, Storage, UI), since they aren't baked into the image. This adds roughly 10–30 seconds to each `docker compose up`. A future improvement would pre-download these at build time in `Dockerfile.emulators` (via `firebase setup:emulators:*`) so this only happens once, not on every run.

---

## Stopping

```bash
docker compose down
```

Emulator data is seeded fresh from `./testdata` on every startup and is never modified. Local changes made during a session (signups, test data, etc.) are not persisted after `docker compose down`. To intentionally update the seed data, run `firebase emulators:export ./testdata` while the emulators are running, then review and commit the diff.

---

## Rebuilding after dependency changes

```bash
docker compose up --build
```

The `--build` flag rebuilds the app image with updated `node_modules`. Use this any time you add or remove npm packages.

---

## Run with Cypress E2E tests (optional)

```bash
docker compose --profile testing up --build
```

Cypress runs headlessly against the live stack. Results appear in `cypress/videos` and `cypress/screenshots`.

---

## Production build

For a production build using your real Firebase project, fill in your actual credentials in `.env` and run:

```bash
docker compose -f docker-compose.prod.yml --env-file .env up --build
```

App runs at **http://localhost:3000**

```bash
docker compose -f docker-compose.prod.yml down
```

> **Note:** The production build bakes env vars into the static bundle at build time. `VITE_APP_USE_EMULATOR` is set to `"false"` automatically, so the SDK connects to your real Firebase project.

---

## Docker file overview

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build `base` (deps), `dev` (Vite HMR), `builder` (prod build), `production` (serves static bundle) |
| `Dockerfile.emulators` | Emulator image `node:22-alpine` + OpenJDK 17 + `firebase-tools@13.13.0` |
| `docker-compose.yml` | Dev stack `emulators` + `app` + optional `cypress` |
| `docker-compose.prod.yml` | Production stack builds and serves the optimised bundle |

---

## Firebase & Emulator

`VITE_APP_USE_EMULATOR=true` in `.env` routes all Firebase SDK calls to the local emulators. The `demo-codelabz` project ID triggers Firebase's offline demo mode no real Google Cloud services are contacted.

| Variable | Value | Effect |
|---|---|---|
| `VITE_APP_USE_EMULATOR` | `true` | All SDK traffic goes to local emulators |
| `VITE_APP_EMULATOR_HOST` | `localhost` | Browser connects via host-mapped ports |
| `VITE_APP_FIREBASE_PROJECT_ID` | `demo-codelabz` | Firebase demo mode no production access |

---

## Known limitations

The Cloud Functions emulator currently fails to load the functions codebase (`Functions codebase could not be analyzed successfully`). This is caused by a pre-existing Node 18/22 version mismatch (`functions/package.json` pins Node 18) combined with `firebase.functions().useEmulator()` being commented out in `src/config/index.js`. This is unrelated to this Docker setup and is being addressed separately. Features that call Cloud Functions directly (e.g. `resendVerificationEmail` in the auth flow) will not work against the local emulator until that fix lands. Auth, Firestore, Realtime Database, and Storage all work correctly.

---

## Troubleshooting

### Emulator startup failure

```bash
docker compose logs emulators
```

Common causes:
- **Port conflict** another process is using one of: 4000, 9099, 8080, 9000, 9199, 5001, 8085. Remap the host port in `docker-compose.yml` (change the left side of `"host:container"`).
- **Missing testdata** if `./testdata/` is missing, regenerate it: `firebase emulators:export testdata`

### testdata permission errors (`Permission denied`)

After running Docker, `./testdata/` files may be owned by `root` because the emulator container runs as root. Fix with:

```bash
sudo chown -R $USER:$USER testdata/
```

Run this whenever `git status` or file access shows permission errors on `testdata/`.

### HMR not working

Rebuild the app image to refresh `node_modules`:

```bash
docker compose build --no-cache app
docker compose up
```

### Port already in use

Edit `docker-compose.yml` and change the host-side port (left side only):

```yaml
ports:
  - "4001:4000"   # moves Emulator UI to host port 4001
```