# Installation Guide

This guide walks you through setting up CodeLabz locally from scratch, including Firebase emulators and Cypress tests.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Clone the Repository](#clone-the-repository)
3. [Install Dependencies](#install-dependencies)
4. [Environment Setup](#environment-setup)
5. [Firebase Setup](#firebase-setup)
6. [Firebase Emulator Setup](#firebase-emulator-setup)
7. [Run the Development Server](#run-the-development-server)
8. [Run the Build](#run-the-build)
9. [Run Cypress Tests](#run-cypress-tests)
10. [Platform-Specific Notes](#platform-specific-notes)
11. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Ensure the following are installed before proceeding:

| Tool | Version | Notes |
|------|---------|-------|
| [Node.js](https://nodejs.org/) | 18.x | Use [nvm](https://github.com/nvm-sh/nvm) to manage versions |
| npm | bundled with Node 18 | |
| [Java JDK](https://adoptium.net/) | 11 or higher | Required for Firebase emulators |
| [Firebase CLI](https://firebase.google.com/docs/cli) | latest | Install via `npm install -g firebase-tools` |
| [Google Chrome](https://www.google.com/chrome/) | any recent version | Required for Cypress tests (`cy:run` uses `--browser chrome`) |
| [Git](https://git-scm.com/) | any recent version | |

> **Why Node 18?** The CI/CD workflows and Firebase Functions (`functions/package.json`) both require Node 18. Node 14 reached end-of-life in April 2023.

Verify your Node version:

```bash
node -v   # should print v18.x.x or higher
```

> Node 18 is the minimum required (set in `functions/package.json`). Node 20 and 22 also work — the Functions emulator will use the host Node version and print a version mismatch warning, which is harmless.

If you need to switch versions using nvm:

```bash
nvm install 18
nvm use 18
```

---

## Clone the Repository

1. Fork the repository on GitHub: [https://github.com/c2siorg/Codelabz](https://github.com/c2siorg/Codelabz)

2. Clone your fork:

```bash
git clone https://github.com/<YOUR_USERNAME>/Codelabz.git
cd Codelabz
```

---

## Install Dependencies

Install root dependencies:

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required for this project due to peer dependency conflicts. The CI pipeline always uses this flag.

Install Firebase Functions dependencies:

```bash
cd functions && npm install --legacy-peer-deps && cd ..
```

### Alternative: Docker Compose

If you prefer a containerized setup that includes the Firebase emulators automatically:

```bash
docker-compose up
```

This starts the Vite dev server and all Firebase emulators together. Skip to [Run Cypress Tests](#run-cypress-tests) if using this approach.

---

## Environment Setup

1. Copy the sample environment file:

```bash
cp .env.sample .env
```

2. Open `.env` and fill in each value:

```env
VITE_APP_FIREBASE_API_KEY=<your-api-key>
VITE_APP_AUTH_DOMAIN=<your-auth-domain>
VITE_APP_FIREBASE_PROJECT_ID=<your-project-id>
VITE_APP_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_APP_FIREBASE_APP_ID=<your-app-id>
VITE_APP_FIREBASE_MEASUREMENTID=<your-measurement-id>
VITE_APP_DATABASE_URL=<your-database-url>
VITE_APP_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
VITE_APP_FIREBASE_FCM_VAPID_KEY=<your-vapid-key>
VITE_APP_USE_EMULATOR=true
CYPRESS_PROJECT_ID=<your-cypress-project-id>
CYPRESS_RECORD_KEY=<your-cypress-record-key>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-email-password>
SMTP_SERVER=gmail
```

> Set `VITE_APP_USE_EMULATOR=true` when running locally with Firebase emulators.

---

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** and follow the prompts
3. Once created, click the **Web** icon (`</>`) on the project overview page
4. Register your app and copy the Firebase config object

### 2. Enable Required Services

In the Firebase console, enable:
- **Authentication** (Email/Password + Google sign-in)
- **Firestore Database**
- **Realtime Database**
- **Storage**

### 3. Fill in `.env` values from Firebase config

From your Firebase project settings, copy the values into `.env`:

- `VITE_APP_FIREBASE_API_KEY` — `apiKey`
- `VITE_APP_AUTH_DOMAIN` — `authDomain`
- `VITE_APP_FIREBASE_PROJECT_ID` — `projectId`
- `VITE_APP_FIREBASE_MESSAGING_SENDER_ID` — `messagingSenderId`
- `VITE_APP_FIREBASE_APP_ID` — `appId`
- `VITE_APP_FIREBASE_MEASUREMENTID` — `measurementId`
- `VITE_APP_FIREBASE_STORAGE_BUCKET` — `storageBucket`

For `VITE_APP_DATABASE_URL`, go to **Realtime Database** in the console. The URL format is:
- `https://<DATABASE_NAME>.firebaseio.com` (us-central1)
- `https://<DATABASE_NAME>.<REGION>.firebasedatabase.app` (other regions)

For `VITE_APP_FIREBASE_FCM_VAPID_KEY`, go to **Project Settings > Cloud Messaging > Web Push certificates** and click **Generate Key Pair**.

### 4. Set up Firebase Functions Service Account

1. In the Firebase console, go to **Project Settings > Service Accounts**
2. Click **Generate New Private Key** and confirm
3. Rename the downloaded file to `cl-dev-pk.json`
4. Create a `private` folder inside the `functions` directory:

```bash
mkdir functions/private
```

5. Move the key file there:

```bash
mv cl-dev-pk.json functions/private/cl-dev-pk.json
```

### 5. Log in to Firebase CLI and set the active project

```bash
firebase login
firebase use --add
```

Select your Firebase project when prompted. This links the local CLI to your project.

> **WSL users:** If you installed Firebase CLI with a custom npm prefix, add it to your PATH first:
> ```bash
> export PATH=$HOME/.npm-global/bin:$PATH
> ```
> To make this permanent, add it to your `~/.bashrc` or `~/.zshrc`.

---

## Firebase Emulator Setup

The repository already includes a fully configured `firebase.json`. You do not need to run `firebase init`.

### Start the emulators

With pre-loaded test data (recommended for first run):

```bash
firebase emulators:start --import=./testdata --project <your-project-id>
```

Replace `<your-project-id>` with the value of `VITE_APP_FIREBASE_PROJECT_ID` from your `.env` file.

Or start with no data:

```bash
npm run emulator
```

The emulator UI will be available at [http://localhost:4000](http://localhost:4000).

> Always start the emulators before running the development server. Login/Signup will not work without them.

### Test credentials

The `testdata/` directory includes seed data with pre-created users and organizations. See [TESTDATA.md](./TESTDATA.md) for the full list of test accounts.

---

## Run the Development Server

With emulators running, open a new terminal and start the app:

```bash
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

---

## Run the Build

```bash
npm run build
```

Output will be in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Run Cypress Tests

Cypress tests require both the emulators and the dev server to be running. You need **3 terminals**.

### Terminal 1 — Start emulators

```bash
firebase emulators:start --import=./testdata --project <your-project-id>
```

### Terminal 2 — Start the dev server

```bash
npm run dev
```

### Terminal 3 — Run tests

Headless mode:

```bash
npm run cy:run
```

Interactive mode (opens the Cypress UI):

```bash
npm run cy:open
```

> **Cypress Cloud recording:** `cypress.config.js` has `record: true` set. If `CYPRESS_RECORD_KEY` is not set in your `.env`, the run will warn about recording being disabled but tests will still execute locally. You do not need a Cypress Cloud account to run tests locally.

> Cypress is configured to run against `http://localhost:5173`. Ensure the dev server is on that port.

---

## Platform-Specific Notes

### macOS — Port 5000 conflict

On macOS Monterey and later, the system **AirPlay Receiver** service occupies port `5000` by default. This conflicts with the Firebase Hosting emulator.

**Fix:** In `firebase.json`, change the hosting emulator port:

```json
"hosting": {
  "port": 5002,
  "host": "0.0.0.0"
}
```

Alternatively, disable AirPlay Receiver in **System Settings > General > AirDrop & Handoff**.

### Windows — `make` command

The `make` command is not available on Windows by default. Use the equivalent `npm run` commands instead:

| Make command | npm equivalent |
|---|---|
| `make install` | `npm install` |
| `make emulator` | `npm run emulator` |
| `make emulator-export` | `npm run emulator-export` |

---

## Troubleshooting

**`npm install` fails with peer dependency errors**
```bash
npm install --legacy-peer-deps
```

**Login/Signup not working**
The Firebase emulators must be running before the dev server. Start them first with `firebase emulators:start --import=./testdata --project <your-project-id>`, then in a separate terminal run `npm run dev`.

**Blank/white screen in browser**
- Confirm `.env` exists and all values are filled in
- Check browser console for errors
- Disable any ad-blocker extensions

**`make: command not found`**
See the [Windows — make command](#windows--make-command) section for npm equivalents.

**`firebase: command not found`**
Install the Firebase CLI globally:
```bash
npm install -g firebase-tools
```
If installed via a custom npm prefix, add it to your PATH:
```bash
export PATH=$HOME/.npm-global/bin:$PATH
```

**`Functions: Failed to load function definition from source`**
This warning appears during emulator startup due to the outdated `firebase-functions` SDK (v3.x) in the `functions/` directory. It does not affect the main app — Auth, Firestore, Database, and Storage emulators all run correctly. Cloud Functions features (email verification, etc.) will be unavailable locally.

**`Could not find metadata/blobs directory for storage_export`**
The `testdata/storage_export` directory is missing blob data. The Storage emulator still starts and works for uploads/downloads — only pre-seeded storage files are absent.

**`Your requested "node" version "18" doesn't match your global version`**
The Functions emulator requires Node 18 per `functions/package.json`, but if you are running Node 20 or 22, it will use your host version and print this warning. The emulator still works correctly.

**`@vitejs/plugin-react-swc` — "Bindings not found" error (Windows + Node 22)**
On Windows with Node 22, the SWC native bindings may fail to load. Fix by replacing the plugin with the Babel-based variant:
```bash
npm install @vitejs/plugin-react@4.3.1
```
Then update `vite.config.js`:
```js
// Before
import react from "@vitejs/plugin-react-swc";
// After
import react from "@vitejs/plugin-react";
```

---

For contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).
For project overview and FAQ, see [README.md](./README.md).
