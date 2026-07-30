# PROJECT_CONTEXT.md

# CareCompanion

Version: 1.0

---

# Project Summary

CareCompanion is an AI-powered healthcare companion designed for elderly users.

The application simplifies daily healthcare management through an intelligent AI Companion that guides users using conversational interactions instead of traditional dashboard-based interfaces.

The product focuses on accessibility, medication adherence, caregiver monitoring, wellness tracking, medical report understanding, and emergency assistance.

The AI is designed to support users, not replace healthcare professionals.

---

# Hackathon Information

Track

Open Innovation – Healthcare

Duration

24 Hours

Team Size

4 Developers

Development Strategy

Parallel Development

AI-Assisted Development

---

# Product Vision

Create an accessible healthcare companion that allows elderly users to comfortably manage their healthcare without needing technical knowledge.

The application should feel like talking to a caring companion instead of using software.

---

# Current Development Phase

Planning

Documentation

Architecture

No implementation assumptions should be made outside the provided documentation.

---

# Team Structure

System 1

Frontend

Responsible for

- Mobile UI
- User Experience
- Navigation
- Animations
- API Integration

---

System 2

Backend

Responsible for

- APIs
- Authentication
- Database
- Business Logic
- Notifications
- AI Integration

---

System 3

AI

Responsible for

- Prompt Engineering
- AI Companion
- Medical Report Analysis
- Health Guidance
- AI Response Formatting

---

# Project Structure

```

carecompanion/

docs/

frontend/

backend/

ai/

shared/

```

---

# Shared Documents

Always read

```

00_MASTER_PRD.md

01_MASTER_TRD.md

shared/API_SCHEMA.md

shared/DATABASE_SCHEMA.md

shared/DESIGN_SYSTEM.md

shared/CODING_STANDARDS.md

shared/WORKFLOW.md

```

These documents override assumptions.

---

# Architecture

```

Frontend

↓

Backend

↓

Database

↓

Gemini AI

```

Frontend never communicates directly with

- Database
- Gemini

Backend is the only gateway.

---

# Technology Stack

Programming

- Python
- TypeScript

Frontend

- React Native
- Expo
- NativeWind
- React Navigation

Backend

- FastAPI
- SQLAlchemy
- PostgreSQL
- Pydantic

AI

- Gemini 2.5 Flash

Authentication

- Clerk

Notifications

- Firebase Cloud Messaging

Storage

- Cloudinary

Deployment

- Render
- Expo
- Neon

---

# Coding Principles

Always

- Build modular code.
- Build reusable components.
- Follow Single Responsibility Principle.
- Keep code readable.
- Prefer simplicity over complexity.

Never

- Hardcode values.
- Duplicate logic.
- Rename shared contracts.
- Ignore documentation.

---

# API Rules

Every API follows

```

/api/v1/

```

Example

```

GET /api/v1/patient

POST /api/v1/auth/login

POST /api/v1/reports/upload

```

Every response follows

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Errors follow

```json
{
  "success": false,
  "message": "",
  "errors": {}
}
```

Never modify this structure.

---

# Database Rules

Backend owns the database.

Frontend never accesses the database.

AI never accesses the database.

Database modifications require updating

DATABASE_SCHEMA.md

before implementation.

---

# AI Rules

AI must

- Explain
- Guide
- Encourage

AI must never

- Diagnose diseases
- Prescribe medication
- Provide emergency medical advice

AI should always encourage users to consult healthcare professionals when appropriate.

---

# Frontend Rules

Frontend focuses only on

- UI
- UX
- API Consumption
- Local State

Business logic belongs in the backend.

---

# Backend Rules

Backend owns

- Authentication
- Validation
- Business Logic
- Database
- Notifications
- AI Communication

---

# AI Rules

AI owns

- Prompt Engineering
- Conversation
- Report Summaries
- Health Guidance

---

# Current MVP

Included

- Authentication
- Patient-Caregiver Linking
- Medication Management
- Adaptive Reminder System
- Daily Wellness Check
- AI Companion
- Medical Report Assistant
- Caregiver Dashboard
- SOS

Excluded

- Doctor Portal
- Smartwatch Integration
- EHR
- Payments
- Predictive Analytics

---

# Naming Standards

Frontend

PascalCase

MedicationCard

ReminderTile

Avatar

Backend

snake_case

patient_service.py

report_router.py

Database

snake_case

users

patients

reports

created_at

updated_at

---

# Shared Contracts

The following documents are considered immutable unless approved by the team

- API_SCHEMA.md
- DATABASE_SCHEMA.md
- DESIGN_SYSTEM.md

Do not modify these without updating every dependent system.

---

# AI Development Instructions

Always prioritize

1. Documentation
2. Shared Contracts
3. Code Quality
4. Reusability
5. Accessibility

Never invent

- APIs
- Database Tables
- Routes
- Fields
- Components

If information is missing,

request clarification instead of making assumptions.

---

# Success Criteria

The project is successful when

✓ Frontend integrates with Backend

✓ Backend integrates with AI

✓ APIs follow documentation

✓ Database follows schema

✓ Accessibility requirements are met

✓ MVP functions end-to-end

---

# Golden Rules

1. Documentation is the source of truth.

2. Backend is the only gateway to AI.

3. Backend is the only gateway to the database.

4. Frontend consumes APIs only.

5. AI never performs medical diagnosis.

6. Build the MVP before enhancements.

7. Prioritize accessibility over visual complexity.

8. Never break shared contracts.

9. Keep implementations modular.

10. Every feature should be independently testable.

---

# Final Goal

Deliver a fully functional, accessible, AI-powered healthcare companion within the 24-hour hackathon while maintaining clean architecture, modular development, and seamless integration across all systems.
