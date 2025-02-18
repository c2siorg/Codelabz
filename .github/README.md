# Codelabz CI/CD Workflows

This `README.md` is designed to provide a comprehensive overview of our CI/CD processes, making it easy for contributors to understand and engage with our workflows. Codelabz leverages a suite of GitHub Actions workflows to automate key aspects of project management, testing, and deployment. Each workflow is explained in detail below, covering its purpose, trigger events, and implementation guidelines.

## Table of Contents

- [1. Greetings Workflow](#1-greetings-workflow)
- [2. Close Stale Issues and Pull Requests Workflow](#2-close-stale-issues-and-pull-requests-workflow)
- [3. Issue Labeler Workflow](#3-issue-labeler-workflow)
- [4. Cypress End-to-End Tests Workflow](#4-cypress-end-to-end-tests-workflow)
- [5. Deploy to Firebase Hosting on Merge Workflow](#5-deploy-to-firebase-hosting-on-merge-workflow)
- [6. Deploy to Firebase Hosting on Pull Request Workflow](#6-deploy-to-firebase-hosting-on-pull-request-workflow)
- [7. Pull Request Labeler Workflow](#7-pull-request-labeler-workflow)
- [8. Pull Request Target Workflow](#8-pull-request-target-workflow)
- [Secrets Management](#secrets-management)
  - [Environment Variables](#environment-variables)
- [Conclusion](#conclusion)

---

## 1. Greetings Workflow

**File:** `.github/workflows/greetings.yml`

This workflow sends a personalized greeting message to users when they open a new issue or pull request.

**Trigger Events:**

- `pull_request`: Triggered when a pull request is opened.
- `issues`: Triggered when an issue is opened.

**Usage:**

- Welcomes new contributors to the project and encourages participation.
- Enhances the onboarding experience and fosters a positive community environment.

**Example:**

```markdown
👋 Hello! Welcome to our project! We're glad you're here. Please provide detailed information about your issue or pull request so we can assist you effectively. Thank you for your contribution! 🚀
```

---

## 2. Close Stale Issues and Pull Requests Workflow

**File:** `.github/workflows/stale.yml`

This workflow automatically marks issues and pull requests as stale after a period of inactivity and closes them if there is no further activity.

**Trigger Events:**

- `schedule`: Runs daily at 6:30 PM UTC (12:00 AM IST).

**Usage:**

- Helps maintain the cleanliness of the issue tracker by closing inactive issues and pull requests.
- Sends reminders and notifications to contributors about inactive issues and pull requests.

---

## 3. Issue Labeler Workflow

**File:** `.github/workflows/label_issues.yml`

This workflow automatically labels issues based on predefined criteria specified in the `labeler-v1.yml` file.

**Trigger Events:**

- `issues`: Triggered when an issue is opened or edited.

**Usage:**

- Labels issues based on patterns defined in the `labeler-v1.yml` configuration file.
- Provides consistent labeling for improved project management.

---

## 4. Cypress End-to-End Tests Workflow

**File:** `.github/workflows/cypress.yml`

This workflow conducts end-to-end tests using Cypress, ensuring the quality and functionality of the application.

**Trigger Events:**

- `pull_request`: Triggered on pull requests to any branch.
- `push`: Triggered on pushes to any branch.

**Usage:**

- Executes tests in parallel on multiple containers, enhancing efficiency and saving time.
- Deploys Firebase emulators for testing with environment variables.
- Records test results in Cypress Cloud for analysis.
- Prints Cypress Cloud URL for result visualization.
- Handles failures by uploading artifacts and notifying contributors.

---

## 5. Deploy to Firebase Hosting on Merge Workflow

**File:** `.github/workflows/firebase-hosting-merge.yml`

This workflow automatically deploys the application to Firebase Hosting upon merging changes into the master branch.

**Trigger Events:**

- `push`: Triggered on pushes to the master branch.

**Usage:**

- Checks out the repository and sets up the Node.js environment.
- Creates a `.env` file with secrets required for Firebase authentication.
- Installs dependencies and builds the application.
- Deploys the application to Firebase Hosting using Firebase Hosting Deploy action.

---

## 6. Deploy to Firebase Hosting on Pull Request Workflow

**File:** `.github/workflows/firebase-hosting-pull-request.yml`

This workflow deploys a preview of the application to Firebase Hosting for every pull request targeting the master branch.

**Trigger Events:**

- `pull_request`: Triggered on pull requests to the master branch.

**Usage:**

- Checks out the repository and sets up the Node.js environment.
- Creates a `.env` file with secrets required for Firebase authentication.
- Installs dependencies and builds the application.
- Deploys the application to a preview channel on Firebase Hosting for testing and review purposes.

---

## 7. Pull Request Labeler Workflow

**File:** `.github/workflows/label-pull-requests.yml`

This workflow automatically assigns labels to pull requests based on changes made in the pull request files or their originating branches.

**Trigger Events:**

- `pull_request_target`: Triggered when a pull request is opened or synchronized, and its base branch is not on the repository.

**Usage:**

- Automatically assigns labels to pull requests to categorize them based on the changes made or their nature.
- Enhances organization and consistency in pull request management.

**Configuration File:** `labeler.yml`

This file contains the rules used by the Pull Request Labeler Workflow to determine which labels to apply to pull requests based on specific criteria.

---

## 8. Pull Request Target Workflow

**File:** `.github/workflows/pull-request-target.yml`

This workflow adds a standardized comment to pull requests to guide contributors through the review process.

**Trigger Events:**

- `pull_request_target`: When a pull request is targeted against a branch.

**Usage:**

- Provides guidelines for contributors to ensure their pull requests adhere to project standards and facilitate a smooth review process.
- Adds a comment to the pull request outlining testing requirements, reviewer assignments, contribution guidelines, and closing procedures.

---

## Secrets Management

Properly configuring the necessary secrets in your repository settings is crucial for smooth workflow execution. These include:

- `GITHUB_TOKEN`: Automatically provided by GitHub Actions for authentication.
- `FIREBASE_SERVICE_ACCOUNT`: JSON key file for Firebase service account authentication.

### Environment Variables

Ensure the following environment variables are set correctly:

- `VITE_APP_FIREBASE_PROJECT_ID`: Unique identifier for your Firebase project.
- `VITE_APP_FIREBASE_API_KEY`: API key to interact with Firebase services.
- `VITE_APP_FIREBASE_AUTH_DOMAIN`: Domain for Firebase authentication.
- `VITE_APP_FIREBASE_DATABASE_URL`: URL of your Firebase Realtime Database.
- `VITE_APP_FIREBASE_STORAGE_BUCKET`: Cloud storage bucket URL.
- `VITE_APP_FIREBASE_MESSAGING_SENDER_ID`: Sender ID for Firebase Cloud Messaging.
- `VITE_APP_FIREBASE_APP_ID`: Unique identifier for your Firebase app.
- `VITE_APP_FIREBASE_MEASUREMENTID`: Identifier for Google Analytics.
- `VITE_APP_FIREBASE_FCM_VAPID_KEY`: Public key for Firebase Cloud Messaging.
- `CYPRESS_PROJECT_ID`: Identifier for the Cypress project.
- `CYPRESS_RECORD_KEY`: Key to record Cypress test results.

**Note:** Ensure thorough configuration of these secrets within your repository settings to prevent any workflow errors. They play a crucial role in authenticating Firebase deployments and accessing the Firebase project. It's imperative to maintain their security and avoid exposing them within your forked repo.

---

## Conclusion

This CI/CD setup aims to automate various project management, testing, and deployment tasks, making the development process more efficient and streamlined. If you have any questions or need further customization, feel free to reach out on our Slack channel or open an issue. Happy coding! 🚀

---

By providing this detailed guide, we hope to facilitate a smooth and productive experience for all contributors, ensuring that our project remains robust, efficient, and welcoming to all.
