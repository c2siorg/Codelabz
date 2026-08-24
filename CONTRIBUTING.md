# Table of Content

- [Table of Content](#table-of-content)
- [User Guide](#user-guide)
  - [Prerequisites](#prerequisites)
  - [Project Setup](#project-setup)
    - [Option A : Docker (recommended)](#option-a--docker-recommended)
    - [Option B : Manual setup](#option-b--manual-setup)
  - [Firebase Setup](#firebase-setup)
    - [Run Firebase Emulator](#run-firebase-emulator)
  - [Run the Project](#run-the-project)
  - [Run the Storybook](#run-the-storybook)
  - [Run the tests](#run-the-tests)

# User Guide

## Prerequisites

**Docker setup (recommended):**
- [Docker](https://docs.docker.com/get-docker/) v20+
- [Docker Compose](https://docs.docker.com/compose/install/) v2+ (ships with Docker Desktop)

**Manual setup:**
- Node.js v22
- Java JDK v21+ (for Firebase emulators)

## Project Setup

1. Fork the repo and clone it:
   ```bash
   git clone https://github.com/Codelabz.git
   cd Codelabz
   ```

### Option A : Docker (recommended)

No Node.js, Java, or Firebase CLI required on your machine.

```bash
cp .env.sample .env
docker compose up --build
```

- App: http://localhost:5173
- Emulator UI: http://localhost:4000

The demo values in `.env.sample` work out of the box no Firebase credentials needed. See [DOCKER.md](./DOCKER.md) for full details.

### Option B : Manual setup

> 📝**NOTE**: Make sure you are using Node.js v22.

1. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Create a `.env` file:
   ```bash
   cp .env.sample .env
   ```
3. Fill in your Firebase credentials in `.env` (see [Firebase Setup](#firebase-setup)).
4. Start the Firebase emulators (see [Run Firebase Emulator](#run-firebase-emulator)).
5. Run the app:
   ```bash
   npm run dev
   ```
6. Visit http://localhost:5173

---

## Firebase Setup

1. Sign in to https://console.firebase.google.com/.
2. Click **Add Project** and necessary information about the project.(Below mentioned the Steps to add project to firebase)
   - To add Firebase resources to an existing Google Cloud project, enter its project name or select it from the dropdown menu.
   - To create a new project, enter the desired project name. You can also optionally edit the project ID displayed below the project name
   - Firebase generates a unique ID for your Firebase project based upon the name you give it. If you want to edit this project ID, you must do it now as it cannot be altered after Firebase provisions resources for your project. Visit Understand Firebase Projects to learn about how Firebase uses the project ID.
3. Agree to the terms and click **Create Project**.
4. After creating the project, click **Add Firebase to your web app**.
   - In the center of the Firebase console's project overview page, click the Web icon to launch the setup workflow.
   - If you've already added an app to your Firebase project, click Add app to display the platform options.
   - Enter your app's nickname.
   - This nickname is an internal, convenience identifier and is only visible to you in the Firebase console.
   - Click Register app.
5. Copy the firebase configuration.
6. Follow the below steps to setup firebase functions
   - Go to functions directory (`cd functions`) and install dependencies (`npm install`)
   - Create a folder `private` inside functions directory
   - Then you have to generate a private key file for your service account. Follow the below steps to get private key:
     1. In the Firebase console, open Settings > Service Accounts.
     2. Click Generate New Private Key, then confirm by clicking Generate Key.
     3. Securely store the JSON file containing the key and rename it to `cl-dev-pk.json`
     4. Move the `cl-dev-pk.json` to `Codelabz/functions/private`
7. Paste the configuration `.env` file. **(this will be found in the project settings section of firebase cloud)**
8. You can find your `<FIREBASE_DATABASE_URL>` in the Realtime Database section of the Firebase console. Depending on the location of the database, the database URL will be in one of the following forms:
   - `https://DATABASE_NAME.firebaseio.com` **(for databases in us-central1)**
   - `https://DATABASE_NAME.REGION.firebasedatabase.app`**(for databases in all other locations)**
9. You can get your `<FIREBASE_VAPID_KEY>` from Cloud-Messaging tab
   - navigate to the setting of your project Open the Cloud Messaging tab.
   - scroll to the Web configuration section.
   - In the Web Push certificates tab, click Generate Key Pair. The console displays a notice that the key pair was generated. You get your Vapid key form there.
10. As you're using emulator, set `<USE_EMULATOR>` to "true"
11. You can get your `<CYPRESS_PROJECT_ID>` as cypress project id from [cypress cloud](https://cloud.cypress.io)

You should fill in these values in their relevant fields in the `.env` file.

### Firebase Emulator Setup

If you're using the Docker setup, the emulators start automatically, no manual setup needed.

For manual setup:

1. Install the Firebase CLI: `npm install -g firebase-tools`
2. Log in: `firebase login`
3. Start the emulators with testdata:
   ```bash
   firebase emulators:start --import=testdata --project demo-codelabz
   ```
4. Or use the Makefile shortcut: `make emulator-import`

See [TESTDATA.md](./TESTDATA.md) for details on the seed data.

### Run Firebase Emulator

```bash
# With testdata (recommended)
firebase emulators:start --import=testdata --project demo-codelabz

# Without testdata
firebase emulators:start --project demo-codelabz

# Export current emulator state
firebase emulators:export testdata
```

Or using make:

```bash
make emulator-import   # start with testdata
make emulator          # start without testdata
make emulator-export   # export current state
```

---

## Run the Project

To run the project
`npm run dev`

If you failed to run the project do the following steps :

- delete node modules
- delete package-lock.json
- re run `npm install `
  If error still exists add `SKIP_PREFLIGHT_CHECK=true` in your .env file

## Run the Storybook

To run storybook :
` npm run storybook`
It will redirect to 6006 port. Find detailed information [here](https://storybook.js.org/docs/react/get-started/introduction)

---

## Run the tests

To run cypress tests:
`npm run cy:run`
It will open a prompt displaying all the tests. You can find detailed information [here](https://docs.cypress.io/guides/guides/command-line#How-to-run-commands)

**Instead, if you want to open the cypress app**. You can run,

`npm run cy:open`
