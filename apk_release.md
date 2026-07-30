# CareCompanion

# APK Release Guide

Version: 1.0

Status: Release Candidate

---

# Purpose

This document contains every step required to build the final CareCompanion APK for the hackathon.

Follow every step in order.

Do not skip verification.

---

# Prerequisites

Required Software

- Node.js LTS
- npm
- Python 3.12+
- Git
- Expo CLI
- EAS CLI
- Android Studio (Optional)
- ADB (Optional)

Accounts

- Expo
- GitHub
- Neon
- Cloudinary
- Google AI Studio

---

# Verify Project

Clone project

```bash
git clone <repository-url>

cd carecompanion
```

Install frontend dependencies

```bash
cd frontend

npm install
```

Install backend dependencies

```bash
cd ../backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt
```

---

# Environment Variables

Create

```
backend/.env
```

Example

```env
DATABASE_URL=

JWT_SECRET=

GEMINI_API_KEY=

CLOUDINARY_CLOUD_NAME=

CLOUDINARY_API_KEY=

CLOUDINARY_API_SECRET=
```

Never commit .env

---

# Verify Backend

```bash
cd backend

source .venv/bin/activate

uvicorn app.main:app --reload
```

Open

```
http://localhost:8000/docs
```

Verify

✓ Backend starts

✓ APIs visible

✓ No errors

---

# Verify Frontend

```bash
cd frontend

npx expo start
```

Verify

✓ Login

✓ Register

✓ Patient Dashboard

✓ Caregiver Dashboard

✓ AI Chat

✓ Reports

✓ Medications

✓ Wellness

✓ Notifications

✓ SOS

---

# Expo Health Check

Run

```bash
npx expo doctor
```

Resolve every reported issue before continuing.

---

# Login to Expo

```bash
eas login
```

Verify

```bash
eas whoami
```

---

# Configure EAS

```bash
eas build:configure
```

Verify

```
eas.json
```

exists.

---

# Update app.json

Verify

- App Name
- Version
- Icon
- Splash Screen
- Android Package Name

Example

```json
{
  "expo": {
    "name": "CareCompanion",
    "slug": "carecompanion",
    "version": "1.0.0",

    "orientation": "portrait",

    "icon": "./assets/icon.png",

    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },

    "android": {
      "package": "com.carecompanion.app"
    }
  }
}
```

---

# Clean Project

```bash
rm -rf node_modules

rm package-lock.json

npm install
```

Clear Expo cache

```bash
npx expo start --clear
```

---

# Build Preview APK

```bash
eas build --platform android --profile preview
```

Wait for build completion.

Download APK from Expo Build page.

---

# Production Build

```bash
eas build --platform android --profile production
```

---

# Install APK

ADB

```bash
adb install app.apk
```

or

Transfer APK

↓

Install manually.

---

# Test APK

Verify

□ App launches

□ Splash Screen

□ Login

□ Register

□ Patient Dashboard

□ Caregiver Dashboard

□ Patient Linking

□ Wellness

□ Medication

□ Report Upload

□ AI Analysis

□ AI Chat

□ Notifications

□ SOS

□ Logout

□ Login Again

---

# Troubleshooting

White Screen

```bash
npx expo start --clear
```

Dependency Issues

```bash
npm install
```

Expo Health

```bash
npx expo doctor
```

Backend

```bash
uvicorn app.main:app --reload
```

---

# Release Ready

The APK is ready when

✓ No crashes

✓ Authentication works

✓ AI works

✓ Reports work

✓ Notifications work

✓ SOS works

✓ APK installs successfully

---

End of Document
