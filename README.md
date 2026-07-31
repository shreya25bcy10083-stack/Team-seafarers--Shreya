# CareCompanion 🏥

> **"Healthcare that feels like companionship."**

CareCompanion is an AI-powered healthcare companion application designed specifically for elderly patients and their caregivers. It simplifies daily healthcare management through an intelligent AI Assistant that guides users using conversational interaction instead of complex dashboard menus.

---

## 🌟 Key Features

- **🤖 Interactive AI Healthcare Assistant**: Personalized voice & chat AI companion powered by Google Gemini 1.5. Uses plain language to explain health advice and medications without diagnosing.
- **🎙️ Two-Way Voice Interaction**: Built-in Speech-to-Text (STT) and Text-to-Speech (TTS) engine with live transcript editing.
- **📄 AI Medical Report Analysis**: Cloudinary-backed PDF/Image report scanner that provides structured executive summaries, abnormal finding callouts, and color-coded health badges (`🟢 Good / Normal`, `🟡 Needs Attention`, `🔴 Urgent Care`).
- **💊 Medication Management & Alarms**: Real-time scheduled medication reminders with high-priority 4-note audio alert chimes and device vibration.
- **👥 Patient-Caregiver Portal**: Secure 8-character invite code linking system enabling caregivers to track patient adherence, view health reports, and monitor wellness logs in real time.
- **🚨 High-Priority SOS Siren**: Emergency red alert notification system with a dual-tone (`1200Hz <-> 600Hz`) siren synthesizer and instant caregiver notification feed.

---

## 🚀 Live Backend Deployment

- **Production Server**: `https://carecompanion-backend-96fd.onrender.com`
- **Health Check Endpoint**: `https://carecompanion-backend-96fd.onrender.com/api/v1/health` (`{"status": "online"}`)
- **Database**: Neon PostgreSQL AWS us-east-1 Cluster
- **File Storage**: Cloudinary CDN

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Mobile** | React Native, Expo SDK 51, TypeScript, NativeWind / Tailwind CSS |
| **Backend API** | FastAPI (Python 3.12), Pydantic v2, Uvicorn, Gunicorn |
| **Database ORM** | PostgreSQL (Neon), SQLAlchemy 2.0 ORM, Alembic |
| **AI Engine** | Google Gemini 1.5 (`google-generativeai`) |
| **Media & Audio** | Cloudinary SDK, Web Audio API Synthesizers, Web Speech API |

---

## 📁 Repository Documentation Structure

```
Team-seafarers--Shreya/
├── README.md                          # Main project guide & architecture overview
├── APK_RELEASE.md                     # Android APK build & EAS deployment guide
├── SUBMISSION_CHECKLIST.md            # Final hackathon submission checklist
├── FREEZE.md                          # Release candidate code freeze policy
└── carecompanion/
    ├── docs/                          # Core system design & engineering specs
    │   ├── 00_MASTER_PRD.md           # Product Requirements Document
    │   ├── 01_MASTER_TRD.md           # Technical Requirements Document
    │   ├── PROJECT_CONTEXT.md         # Architecture & domain vision
    │   ├── API_SCHEMA.md              # OpenAPI / REST endpoint specifications
    │   ├── DATABASE_SCHEMA.md         # Database relational model specifications
    │   ├── DESIGN_SYSTEM.md           # UI/UX design system & token definitions
    │   ├── AI_RULES.md                # AI subsystem safety & prompt governance
    │   ├── BACKEND_RULES.md           # FastAPI engineering & service layer rules
    │   └── FRONTEND_RULES.md          # React Native component & state guidelines
    └── backend/
        └── app/
            └── ai/
                └── prompts/           # Python runtime prompt templates (Code Assets)
                    ├── chat_prompt.md
                    ├── medication_prompt.md
                    ├── report_prompt.md
                    ├── system_prompt.md
                    └── wellness_prompt.md
```

---

## ⚙️ Quickstart & Local Setup

### 1. Backend Setup (FastAPI)

```bash
cd carecompanion/backend

# Create & activate virtual environment
python3.12 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend locally
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup (React Native / Expo)

```bash
cd carecompanion/frontend

# Install dependencies
npm install

# Start Metro Bundler
npx expo start
```

### 3. Build Standalone Android APK (EAS)

```bash
cd carecompanion/frontend

# Generate Preview APK
npx eas-cli build --platform android --profile preview
```
