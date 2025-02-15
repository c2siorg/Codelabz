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

### Additional Environment Variables for Email/SMTP

If your project needs email notifications or similar features, you may need the following variables in your .env file:

```
EMAIL_USER=your-email-username
EMAIL_PASS=your-email-password
SMTP_SERVER=gmail
```
(Adjust according to your SMTP provider’s details.)



### Firebase Emulator Setup

1. Refer this site [https://firebase.google.com/docs/emulator-suite/install_and_configure]
2. Make sure you have the correct jdk version installed
3. Make sure you are in the parent directory
4. Now lets connect your local firebase to cloub by running command (`firebase login`)
5. Then authenticate your firebase using browser and set the selected web app for codelabz
6. Then run the command (`firebase init`)
7. Select all the emulator necessitites by pressing a or selecting them manually and pressing space
8. Answer the commands
9. Lets set up your credentials of test data
10. Run your firebase emulator by running the following command.

```shell
make emulator
```
Or, if you don't have the make command:
   ```bash
   firebase emulators:start
   ```
**Export Emulator Data (Optional):**
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

```
macOS Users: Port 5000 can sometimes be used by macOS for AirPlay or other system services. If you run into issues with hosting or emulator ports, open your Firebase configuration (firebase.json) or .env file and change the port to something else (e.g., 5001, 5173, etc.)
```

If you failed to run the project do the following steps :


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
