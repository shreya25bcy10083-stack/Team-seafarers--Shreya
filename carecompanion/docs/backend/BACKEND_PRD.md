# BACKEND_PRD.md

# CareCompanion

## Backend Product Requirements Document

Version: 1.0

Status: Approved

Owner: Backend Team

---

# Purpose

This document defines the backend responsibilities for CareCompanion.

The backend serves as the core of the application and is responsible for authentication, business logic, database management, API development, notifications, and AI integration.

It acts as the only communication layer between the frontend, database, and AI services.

---

# Backend Objectives

The backend must

- Provide secure REST APIs.
- Validate all incoming requests.
- Store and retrieve healthcare data.
- Integrate with Gemini AI.
- Manage user authentication.
- Deliver notifications.
- Maintain data consistency.

---

# Responsibilities

The Backend owns

- Authentication
- User Management
- Business Logic
- Database
- AI Communication
- Notification Logic
- File Upload Handling
- Validation
- API Responses

The Backend does NOT own

- UI
- Styling
- Navigation
- Prompt Engineering
- Avatar Animations

---

# Backend Architecture

Frontend

↓

REST API

↓

Business Services

↓

Database

↓

Gemini AI

The backend is the single gateway for all external communication.

---

# Authentication Module

Responsibilities

- Register users
- Login users
- Validate JWT
- Manage roles
- Authorize endpoints

Endpoints

POST /auth/register

POST /auth/login

POST /auth/logout

---

# Patient Module

Responsibilities

- Store patient information
- Update profile
- Fetch profile

Endpoints

GET /patient/profile

PUT /patient/profile

---

# Caregiver Module

Responsibilities

- Generate invite codes
- Link caregiver
- Fetch caregiver dashboard

Endpoints

POST /patient/invite

POST /caregiver/join

GET /caregiver/dashboard

---

# Medication Module

Responsibilities

- CRUD medications
- Schedule reminders
- Store medication history

Endpoints

GET /medications

POST /medications

PUT /medications/{id}

DELETE /medications/{id}

POST /medications/log

---

# Wellness Module

Responsibilities

- Daily check-ins
- Wellness history
- Trend generation

Endpoints

POST /wellness/checkin

GET /wellness/history

---

# Reports Module

Responsibilities

- Upload reports
- Store report metadata
- Retrieve reports

Endpoints

POST /reports/upload

GET /reports

GET /reports/{id}

---

# AI Module

Responsibilities

- Send prompts to Gemini
- Build context
- Format AI responses
- Report analysis

Endpoints

POST /ai/chat

POST /ai/report-summary

---

# SOS Module

Responsibilities

- Trigger emergency
- Notify caregiver
- Save emergency event

Endpoints

POST /sos

---

# Notification Module

Responsibilities

- Medication reminders
- Wellness reminders
- Emergency alerts
- Report updates

Endpoints

GET /notifications

PUT /notifications/{id}

---

# Validation

Every endpoint must

- Validate request
- Validate authentication
- Validate permissions
- Validate data types

Pydantic is mandatory.

---

# File Uploads

Supported

- PDF
- JPG
- JPEG
- PNG

Maximum Size

10 MB

Only authenticated users may upload reports.

---

# AI Responsibilities

Backend must

- Build prompts
- Send prompts
- Receive responses
- Format responses

Backend must NOT

- Hardcode AI replies

---

# Error Handling

Every endpoint must return

Success

↓

Failure

↓

Validation Error

↓

Authorization Error

↓

Internal Error

Using the shared API response format.

---

# Logging

Log

- Requests
- Errors
- AI Requests
- Authentication

Do NOT log

- Passwords
- Medical Reports
- Tokens

---

# Performance Goals

Authentication

<300 ms

Database Query

<200 ms

AI Response

<8 seconds

API Response

<500 ms

---

# Security

Passwords

Hashed

JWT

Required

Secrets

Environment Variables

Database

Protected

Input

Validated

---

# Dependencies

API_SCHEMA.md

DATABASE_SCHEMA.md

PROJECT_CONTEXT.md

MASTER_TRD.md

---

# Future Scope

Push Notifications

Analytics

Doctor Portal

Wearable Integration

---

# Definition of Done

Backend implementation is complete when

✓ Authentication works

✓ CRUD APIs work

✓ Database connected

✓ Gemini integrated

✓ Notifications functional

✓ Validation complete

✓ Error handling implemented

✓ API follows API_SCHEMA.md

✓ Database follows DATABASE_SCHEMA.md

---

End of Document
