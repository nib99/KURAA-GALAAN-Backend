# Kuraa Galaan Charity Organization — Backend (Firebase)

Production-ready backend skeleton for **Kuraa Galaan Charity Organization**.
Includes Cloud Functions (Express), Firestore rules, CI workflow for GitHub Actions, and local emulator support.

## What's included
- `functions/` — Firebase Cloud Functions (Express API)
- `firestore.rules` — starter Firestore security rules
- `firebase.json` & `.firebaserc` — Firebase configuration
- `.github/workflows/firebase-deploy.yml` — CI workflow to deploy on push to `main`
- `.gitignore`, `LICENSE`
- `README.md` (this file)

## Quick start (step-by-step)

### 1) Prerequisites
- Node.js 20.x (match `functions/package.json` engines)
- npm or pnpm
- Firebase CLI: `npm i -g firebase-tools`
- GitHub account (for CI deploy)
- A Firebase project (create one at https://console.firebase.google.com/)

### 2) Inspect or clone the repo
Unzip or clone the files. From your machine:
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 3) Local install (functions)
```bash
cd functions
npm ci
```

### 4) Configure Firebase project locally
If you haven't already:
```bash
firebase login
firebase init
```
Or set the project id:
```bash
firebase use --add <your-firebase-project-id>
```
Update `.firebaserc` if you prefer to set the project id directly.

### 5) Local emulators (recommended)
Start emulators for fast local testing:
```bash
firebase emulators:start --only functions,firestore,auth
```
When emulators are running, the functions endpoint will be:
`http://localhost:5001/<PROJECT_ID>/us-central1/app`
Example health check:
```
curl http://localhost:5001/<PROJECT_ID>/us-central1/app/api/health
```

### 6) Add CI secret for GitHub Actions
- Create a Firebase service account (Console → Project Settings → Service Accounts → Generate private key).
- Save the JSON content as a GitHub secret named: `FIREBASE_SERVICE_ACCOUNT`
- Optionally change the project id in `.firebaserc` to your actual project id.

### 7) Deploy (manual)
```bash
firebase deploy --only hosting,functions --project <your-firebase-project-id>
```

### 8) Deploy (CI)
- Push to `main` branch; the included GitHub Actions workflow will run and deploy using the `FIREBASE_SERVICE_ACCOUNT` secret.

### 9) Test the API (after deploy)
- Hosted function URL (example):
  `https://us-central1-<PROJECT_ID>.cloudfunctions.net/app/api/health`
- Example curl to create a donation:
```bash
curl -X POST https://<YOUR_FUNCTION_URL>/api/donations \
   -H "Content-Type: application/json" \
   -d '{"donorName":"Ali", "amount":50, "message":"Keep it up", "method":"card"}'
```

## Security notes
- **Do not** commit service account keys into the repo.
- Use Firestore rules to restrict writes (see `firestore.rules`).
- For payment integrations, never store raw card data in Firestore.

## Where to go next
- Add email/sendgrid integration (store credentials in GitHub Secrets).
- Add admin-only routes by checking `request.auth.token.admin` via Firebase Auth custom claims.
- Add monitoring & alerting (Cloud Monitoring / Logging).

--- 
