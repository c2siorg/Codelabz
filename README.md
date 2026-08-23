# Table of Content 📑

1. [CodeLabz](#codelabz)
2. [Quickstart](#quickstart)
3. [Deployment](#deployment)
4. [Community](#community)
5. [Contribute](#contribute)
6. [FAQs (Frequently Asked Questions)](#faqs)

# CodeLabz

**CodeLabz** is a platform where the users can engage with online tutorials and the organizations can create tutorials for the users. The platform will be developed using ReactJS frontend library and the backend will be developed using the Google Cloud Firestore and Google Firebase Real-Time database.

# Quickstart

The fastest way to run Codelabz locally no Node.js, Java, or Firebase account required:

```bash
git clone https://github.com/Codelabz.git
cd Codelabz
cp .env.sample .env
docker compose up --build
```

- App → http://localhost:5173
- Emulator UI → http://localhost:4000

See [DOCKER.md](./DOCKER.md) for full details and [CONTRIBUTING.md](./CONTRIBUTING.md) for the manual setup path.

# Deployment

You can see the app live at [https://dev.codelabz.io/](https://dev.codelabz.io/)

# Community

Join and communicate with other members on our community. We communicate on gitter.

[![Gitter](https://badges.gitter.im/scorelab/CodeLabz.svg)](https://gitter.im/scorelab/CodeLabz?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# Contribute

Contributions are always welcome!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get started.

Please adhere to this project's [code of conduct](./code_of_conduct.md).

# FAQs

### 1. Do I need to purchase Blaze plan to run the app ?

### Answer -

No, you don't need to purchase Blaze plan to run the app. You need to purchase it only if you want to deploy firebase cloud functions.

<hr/>

### 2. `npm install` command is not executing successfully in my system.

### Answer -

Make sure you are using Node.js v18+. If the problem persists try `npm install --legacy-peer-deps`.

> 💡 **Tip**: Use the Docker setup to avoid Node version issues entirely `docker compose up --build` handles everything.

<hr/>

### 3. Login/Signup is not working.

<img src="https://files.gitter.im/5eb21f15d73408ce4fe2cb37/Jl4t/image.png" width="600">

### Solution :-

This happens when the Firebase emulators are not running.

**If using Docker (recommended):** make sure you started the stack with `docker compose up --build`. The emulators start automatically.

**If running manually:** start the emulators before the app:

```bash
firebase emulators:start --import=testdata --project demo-codelabz
npm run dev
```
<hr/>

### 4. I am creating new account and it says that confirmation mail is sent to my email but I didn't got any mail.

### Answer :-

This feature is not implemented completely and we are currently working on this. If you still want to login/signup, you can try login/signup with google option.

<hr/>

### 5. I have done the environment setup, but when I start the app it is showing white/blank screen.

### Solution :-

This problem can arise in multiple scenarios :-

1. Check the browser console and see what error are you getting there and try to fix it.
2. Make sure that you have created `.env` file and placed all values to the keys.
3. In some cases it can also arise due to any active ad-blocker extension in your browser. So make sure to turn it off.
<hr/>

### 6. make command not found

![image](https://user-images.githubusercontent.com/88550925/224977291-25101480-608b-41e6-a0b6-f03ff23f66b4.png)

### Solution :-

The Make Command Not Found error indicates that the make utility is either not installed on the system or it’s not present in the PATH variable.

Follow this link to fix this issue.
[Click here](https://www.technewstoday.com/fix-make-command-not-found/)

### 7. I want to contribute but don't know where to start.

### Answer :-

1. First of all try to make yourself comfortable with the app and explore its functionalities.
2. Have a look into issues that are already raised and are not assigned to anyone and ask the mentors to get it assigned it to you.
3. If you want to work on a new issue, first try to discuss it in the gitter channel with the mentors and then raise the issue.
<hr/>

### ❓ Got more questions, ask it in our [gitter channel](https://matrix.to/#/#scorelab_CodeLabz:gitter.im) and we will love ❤ to answer them.
