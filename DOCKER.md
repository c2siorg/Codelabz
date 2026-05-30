# Docker Setup

## Requirements

- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+

## Setup

```bash
cp .env.sample .env
# fill in your Firebase credentials in .env
```

---

## Development

Runs the Vite dev server and Firebase emulators.

```bash
docker compose -f docker-compose.dev.yml up --build
```

| Service | URL |
|---|---|
| App | http://localhost:5173 |
| Emulator UI | http://localhost:4000 |

The emulators start automatically alongside the app. Test data is loaded from `./testdata` on startup and saved back on exit.

Test credentials (emulator only):

```
Email: sougatariju13@gmail.com
Password: 123456
```

### Stop

```bash
docker compose -f docker-compose.dev.yml down
```

---

## Production

Builds and serves the optimised bundle.

```bash
docker compose -f docker-compose.prod.yml --env-file .env up --build
```

App runs at **http://localhost:3000**


### Stop

```bash
docker compose -f docker-compose.prod.yml down
```

### Rebuild from scratch

```bash
docker compose -f docker-compose.prod.yml build --no-cache
```

---

## Firebase & Emulator

The `VITE_APP_USE_EMULATOR` variable in your `.env` controls how the app connects to Firebase.

| Value | Behavior |
|---|---|
| `true` | Connects to local Firebase emulators (set automatically in dev) |
| `false` | Connects to your real Firebase project (required for prod) |

When using real Firebase, sign up with your own email. Check spam if you don't receive the verification email.

---

## Troubleshooting

**Port already in use** — change the host port in the relevant Compose file:

```yaml
ports:
  - "4000:5173"   # dev
  - "4000:3000"   # prod
```

**Firebase not connecting** — make sure all `VITE_APP_*` variables are filled in `.env`.

**Emulator data missing** — check that the `./testdata` folder exists. See [TESTDATA.md](./TESTDATA.md) for details.

**Hot reload not working** — make sure you're using the dev Compose file (`docker-compose.dev.yml`), not prod.
