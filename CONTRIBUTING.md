# Contributing to Codelabz

Thank you for your interest in contributing to **Codelabz**! This document will guide you through the process of setting up your development environment and getting started with the project. Please read through the instructions carefully, and feel free to reach out if you have any questions.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start Guide](#quick-start-guide)
  - [Fork & Clone the Repository](#fork--clone-the-repository)
  - [Install Dependencies](#install-dependencies)
  - [Environment Setup](#environment-setup)
- [Project Setup](#project-setup)
  - [Using Docker-Compose (Optional)](#using-docker-compose-optional)
- [Firebase Setup](#firebase-setup)
  - [Firebase Web App Configuration](#firebase-web-app-configuration)
  - [Firebase Functions & Service Account](#firebase-functions--service-account)
- [Firebase Emulator Setup](#firebase-emulator-setup)
- [Running the Project](#running-the-project)
  - [Development Server](#development-server)
  - [Storybook](#storybook)
  - [Testing with Cypress](#testing-with-cypress)
- [Troubleshooting & Additional Tips](#troubleshooting--additional-tips)
- [Need Help?](#need-help)

---

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: Version 14 (use [nvm](https://github.com/nvm-sh/nvm) to manage multiple versions easily)
- **Java JDK**: Version 11 or higher (required for running Firebase emulators)
- **make**: Command-line tool (optional but recommended for running scripts)

---

## Quick Start Guide

### Fork & Clone the Repository

1. **Fork the Repo:**  
   Visit [Codelabz on GitHub](https://github.com/c2siorg/Codelabz) and fork the repository to your own account.

2. **Clone Your Fork:**  
   Open your terminal and run:
   ```bash
   git clone https://github.com/<YOUR_USERNAME>/Codelabz.git
   ```
   Replace `<YOUR_USERNAME>` with your GitHub username.

3. **Navigate to the Project Folder:**
   ```bash
   cd Codelabz
   ```

### Install Dependencies

Install all project dependencies by running one of the following commands:
```bash
npm install
```
Or, if you prefer using the make command:
```bash
make install
```

### Environment Setup

1. **Create a `.env` File:**  
   In the project root, create a file named `.env`.

2. **Configure Environment Variables:**  
   Copy all the keys from the provided `.env.sample` file and replace them with your own values (e.g., Firebase configuration, database URL, VAPID key, etc.).

3. **Note on Node Version:**  
   Ensure you are using Node.js version 14.

---

## Project Setup

After completing the quick start guide, follow these additional steps for a complete setup:

### Using Docker-Compose (Optional)

If you prefer a containerized environment, you can use Docker Compose:
1. Ensure your `.env` file is properly set up.
2. Run:
   ```bash
   docker-compose up
   ```
   This command will start the project along with the Firebase emulator in a Docker environment.

---

## Firebase Setup

Codelabz uses Firebase for backend services. Follow these steps to configure your Firebase project:

### Firebase Web App Configuration

1. **Create a Firebase Project:**
   - Visit [Firebase Console](https://console.firebase.google.com/) and click **Add Project**.
   - Enter your project name and follow the prompts to create a new project.

2. **Register a Web App:**
   - In your Firebase project overview, click the **Web** icon.
   - Enter your app's nickname and click **Register app**.
   - Copy the Firebase configuration object and paste the values into your `.env` file.

### Firebase Functions & Service Account

1. **Set Up Firebase Functions:**
   - Navigate to the `functions` directory:
     ```bash
     cd functions
     ```
   - Install dependencies:
     ```bash
     npm install
     ```

2. **Generate a Service Account Key:**
   - In the Firebase console, go to **Settings > Service Accounts**.
   - Click **Generate New Private Key**, then confirm by clicking **Generate Key**.
   - Securely store the JSON file and rename it to `cl-dev-pk.json`.
   - Move `cl-dev-pk.json` into the `functions/private` folder.

3. **Update `.env` File:**
   - Fill in the required fields such as `<FIREBASE_DATABASE_URL>`, `<FIREBASE_VAPID_KEY>`, and `<CYPRESS_PROJECT_ID>` using the information from your Firebase project settings.

4. **Enable Emulator Mode:**  
   Set `<USE_EMULATOR>` to `true` in your `.env` file when using the Firebase emulator.

---

## Firebase Emulator Setup

To run the Firebase emulator locally:

1. **Install & Configure the Emulator Suite:**  
   Follow the official guide: [Firebase Emulator Suite Setup](https://firebase.google.com/docs/emulator-suite/install_and_configure)

2. **Run the Emulator:**
   ```bash
   make emulator
   ```
   Or, if you don't have the make command:
   ```bash
   firebase emulators:start
   ```

3. **Export Emulator Data (Optional):**
   ```bash
   make emulator-export
   ```

---

## Running the Project

### Development Server

To start the development server:
```bash
npm run dev
```
Then, open your browser and navigate to [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

### Storybook

To view the UI components in isolation using Storybook:
```bash
npm run storybook
```
Storybook will run on port `6006`.

### Testing with Cypress

- **Headless Test Run:**
  ```bash
  npm run cy:run
  ```
- **Interactive Mode:**
  ```bash
  npm run cy:open
  ```

---

## Troubleshooting & Additional Tips

- **Node Version:**  
  Always use Node.js version 14. If using `nvm`, switch with:
  ```bash
  nvm use 14
  ```

- **Make Command:**  
  The `make` command is optional but simplifies multiple commands. If not available, run the commands manually as described.

- **Environment Variables:**  
  Ensure your `.env` file is correctly set up with all required keys.

---

## Need Help?

If you run into any issues or have suggestions for improvements:
- Open an issue on [GitHub](https://github.com/c2siorg/Codelabz/issues).

Thank you for contributing to **Codelabz**!

---

Happy coding!  
The Codelabz Team
