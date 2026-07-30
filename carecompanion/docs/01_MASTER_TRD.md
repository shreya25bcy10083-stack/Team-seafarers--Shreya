# 01_MASTER_TRD.md

# CareCompanion

## Technical Requirements Document (TRD)

Version: 1.0

---

# Purpose

This document defines the complete technical architecture of CareCompanion.

It acts as the single engineering reference for all development teams.

Every subsystem (Frontend, Backend, AI) must follow this document.

---

# System Overview

CareCompanion consists of three independent systems.

```

Frontend
↓
Backend
↓
Database

↓

AI Services

```

Each system has a single responsibility.

No subsystem should directly access another subsystem's internal implementation.

Communication occurs only through defined APIs.

---

# System Architecture

```

React Native App
│
▼
FastAPI Backend
├─────────────┐
│             │
▼             ▼
PostgreSQL    Gemini AI

```

---

# Technology Stack

## Programming Languages

Python

TypeScript

SQL

---

## Frontend

React Native

Expo

NativeWind

React Navigation

Axios

---

## Backend

FastAPI

Pydantic

SQLAlchemy

Alembic

Uvicorn

---

## Database

PostgreSQL

Neon Database

---

## AI

Gemini 2.5 Flash

---

## Authentication

Clerk

---

## Notifications

Firebase Cloud Messaging

---

## Storage

Cloudinary

---

## Deployment

Frontend

Expo

Backend

Render

Database

Neon

---

# Development Philosophy

The application follows

API First Development.

Every feature must be designed as

```

Frontend

↓

REST API

↓

Business Logic

↓

Database

```

No feature should bypass the backend.

---

# Project Structure

```

carecompanion/

docs/

frontend/

backend/

ai/

shared/

assets/

```

---

# Frontend Structure

```

frontend/

src/

components/

screens/

navigation/

hooks/

services/

utils/

types/

assets/

```

---

# Backend Structure

```

backend/

app/

routers/

services/

schemas/

models/

database/

middleware/

utils/

config/

```

---

# AI Structure

```

ai/

prompts/

chains/

context/

services/

utils/

```

---

# Shared Folder

```

shared/

API_SCHEMA.md

DATABASE_SCHEMA.md

DESIGN_SYSTEM.md

WORKFLOW.md

CODING_STANDARDS.md

```

---

# System Responsibilities

## Frontend

Responsible for

- UI
- UX
- Navigation
- State Management
- API Requests

Not responsible for

- Business Logic
- Database
- AI Processing

---

## Backend

Responsible for

- APIs
- Authentication
- Database
- Business Logic
- Validation
- AI Integration

Not responsible for

- UI
- Prompt Engineering

---

## AI

Responsible for

- Prompt Engineering
- Medical Report Summaries
- Health Guidance
- Conversation Flow

Not responsible for

- Authentication
- Database
- UI

---

# API Architecture

REST API

Base URL

```

/api/v1

```

Example

```

POST /api/v1/auth/login

GET /api/v1/patient

POST /api/v1/report/upload

POST /api/v1/ai/chat

```

---

# Standard API Response

Every endpoint must return

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

Errors

```json
{
  "success": false,
  "message": "",
  "errors": {}
}
```

Never change this format.

---

# Request Validation

All request validation must use

Pydantic.

Every endpoint requires

- Request Model
- Response Model

---

# Database Architecture

Backend owns the database.

Frontend never queries the database.

AI never queries the database.

Database access must use

SQLAlchemy ORM.

---

# Naming Conventions

## Files

snake_case

Example

```

patient_service.py

report_router.py

```

---

## Classes

PascalCase

Example

```

Patient

Medication

WellnessCheck

```

---

## Variables

snake_case

Example

```

patient_name

report_summary

```

---

## Components

PascalCase

```

MedicationCard

Avatar

HealthTile

```

---

## Database Tables

Plural

snake_case

Examples

```

users

patients

caregivers

medications

reports

wellness_checks

```

---

# Error Handling

Every endpoint must

- Validate input
- Catch exceptions
- Return meaningful messages
- Never expose stack traces

---

# Logging

Backend should log

- Requests
- Errors
- Authentication
- AI Requests

Do not log

- Passwords
- Tokens
- Medical reports

---

# Security

Authentication

JWT via Clerk

Passwords

Never stored locally

Sensitive Data

Encrypted

Secrets

Environment Variables only

---

# Performance

Target API response

< 500ms

Database queries

Optimized

Large reports

Processed asynchronously where possible

---

# AI Architecture

Flow

```

Frontend

↓

Backend

↓

Prompt Builder

↓

Gemini

↓

Response Formatter

↓

Frontend

```

Gemini should never be accessed directly from the frontend.

---

# Notification Flow

Medication Time

↓

Backend

↓

Firebase

↓

Patient Device

↓

User Response

↓

Backend

↓

Database

↓

Caregiver Dashboard

---

# Development Workflow

1. Read PRD

2. Read TRD

3. Read API Schema

4. Read Database Schema

5. Build Feature

6. Test

7. Commit

8. Merge

---

# Git Workflow

main

↓

develop

↓

feature branches

Never develop directly on main.

---

# Code Standards

- Small reusable modules
- Single Responsibility Principle
- No duplicated code
- Meaningful variable names
- Clear comments only where necessary
- Type-safe development

---

# Integration Strategy

Development occurs in parallel.

Frontend

↓

Mock APIs

Backend

↓

Real APIs

AI

↓

Mock prompts

↓

Final Integration

---

# Testing Strategy

Each feature must pass

Unit Testing

↓

API Testing

↓

Integration Testing

↓

Manual Testing

---

# Deployment Pipeline

Frontend

↓

Backend

↓

Database

↓

AI

↓

Smoke Test

↓

Production Demo

---

# Constraints

Hackathon Time

24 Hours

Team Size

4 Members

Architecture

Modular

Offline Support

Limited

Scalability

High

---

# Acceptance Criteria

The technical implementation is complete when

✓ All APIs work

✓ Database stores all required data

✓ Frontend communicates with backend

✓ Backend communicates with AI

✓ Authentication works

✓ Notifications work

✓ AI responses are generated correctly

✓ No subsystem violates the shared contracts

---

# Definition of Technical Completion

The project is considered technically complete when

- All systems integrate successfully.
- API contracts remain unchanged.
- Database schema remains consistent.
- AI follows project rules.
- Frontend passes all functional tests.
- Backend passes endpoint testing.
- Shared documentation accurately reflects implementation.

---

End of Document
