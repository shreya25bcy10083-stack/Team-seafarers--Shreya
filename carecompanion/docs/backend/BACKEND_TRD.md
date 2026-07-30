# BACKEND_TRD.md

# CareCompanion

## Backend Technical Requirements Document

Version: 1.0

Status: Approved

Owner: Backend Team

---

# Purpose

This document defines the backend architecture and implementation strategy for CareCompanion.

It standardizes the project structure, coding practices, request flow, database interaction, AI integration, and deployment strategy.

Every backend developer and AI coding assistant must follow this document.

---

# Technology Stack

## Language

Python 3.12+

---

## Framework

FastAPI

---

## API Server

Uvicorn

---

## Validation

Pydantic

---

## ORM

SQLAlchemy

---

## Database

PostgreSQL

Hosted on Neon

---

## Database Migration

Alembic

---

## Authentication

JWT Authentication

(Before production this can be replaced with Clerk)

---

## AI

Gemini 2.5 Flash

---

## File Storage

Cloudinary

---

# Backend Architecture

The backend follows a layered architecture.

```

Client

↓

Router

↓

Service

↓

Repository (Database)

↓

Database

```

AI Flow

```

Client

↓

Router

↓

AI Service

↓

Gemini API

↓

Formatted Response

↓

Client

```

Business logic should NEVER exist inside routers.

---

# Project Structure

```

backend/

app/

│

├── main.py

├── config.py

├── database.py

├── dependencies.py

│

├── routers/

│

├── services/

│

├── repositories/

│

├── schemas/

│

├── models/

│

├── ai/

│

├── middleware/

│

├── notifications/

│

├── utils/

│

├── core/

│

└── tests/

```

---

# Main Application

main.py

Responsibilities

- Create FastAPI application
- Register routers
- Register middleware
- Startup events
- Shutdown events

Should NOT contain business logic.

---

# Routers

Purpose

Handle incoming HTTP requests.

Responsibilities

- Receive request
- Validate request
- Call service
- Return response

Should NEVER

- Access database
- Call SQLAlchemy directly
- Call Gemini directly

Example

```

auth_router.py

patient_router.py

medication_router.py

wellness_router.py

report_router.py

ai_router.py

notification_router.py

sos_router.py

```

---

# Services

Purpose

Contain business logic.

Responsibilities

- Process data
- Validate workflows
- Call repositories
- Call AI
- Send notifications

Example

```

auth_service.py

patient_service.py

medication_service.py

report_service.py

ai_service.py

```

Services should never know HTTP details.

---

# Repositories

Purpose

Database abstraction layer.

Responsibilities

- Query database
- Insert data
- Update data
- Delete data

Repositories should only communicate with SQLAlchemy.

---

# Models

Purpose

Database models.

Responsibilities

Represent database tables.

Every table from DATABASE_SCHEMA.md must have one SQLAlchemy model.

Example

```

User

Patient

Medication

WellnessCheck

MedicalReport

Notification

SOSEvent

```

---

# Schemas

Purpose

Request and response validation.

Use Pydantic.

Each module should contain

Create Schema

Update Schema

Response Schema

Example

```

MedicationCreate

MedicationUpdate

MedicationResponse

```

---

# AI Module

Structure

```

ai/

prompts/

builder.py

gemini_client.py

formatter.py

```

Responsibilities

- Build prompts
- Send prompts
- Format AI output

Never expose Gemini directly.

---

# Middleware

Authentication

Logging

CORS

Request Timing

Exception Handling

---

# Notifications

Responsible for

Medication reminders

SOS alerts

Caregiver alerts

Wellness reminders

Notification logic should remain independent of business logic.

---

# Utils

Shared helper functions.

Examples

Date utilities

Validators

Response builders

File helpers

---

# Configuration

Environment variables

```

DATABASE_URL

JWT_SECRET

GEMINI_API_KEY

CLOUDINARY_URL

```

Never hardcode secrets.

---

# Request Flow

```

Client

↓

Router

↓

Pydantic Validation

↓

Service

↓

Repository

↓

Database

↓

Response

```

---

# AI Request Flow

```

Client

↓

AI Router

↓

AI Service

↓

Prompt Builder

↓

Gemini

↓

Formatter

↓

Response

```

---

# File Upload Flow

```

Client

↓

Report Router

↓

Cloudinary

↓

Store URL

↓

Database

↓

AI Analysis

↓

Response

```

---

# Dependency Injection

Use FastAPI Depends()

For

Database Session

Authentication

Authorization

Shared dependencies

---

# Database Session

Each request receives

One SQLAlchemy Session

↓

Commit

↓

Close Session

Never reuse sessions manually.

---

# Error Handling

Centralized exception handling.

Return only

```

success

message

errors

```

Never expose stack traces.

---

# Logging

Log

- Requests
- Responses
- Authentication
- Errors
- AI latency

Never log

Passwords

JWT

Medical reports

Personal information

---

# Security

Hash passwords

Validate JWT

Validate file uploads

Limit upload size

Sanitize inputs

Validate ownership before data access

---

# Performance

Target

API Response

<500ms

Database Queries

Optimized

AI Response

<8 seconds

Avoid unnecessary database queries.

---

# Coding Standards

Functions

Maximum 60 lines

Service

Single responsibility

Router

Single responsibility

Meaningful names

Avoid duplicate code

Prefer composition over large classes

---

# Testing

Every endpoint should verify

✓ Success

✓ Invalid Input

✓ Unauthorized Access

✓ Database Failure

✓ Edge Cases

---

# Deployment

Backend

↓

Render

Database

↓

Neon

Storage

↓

Cloudinary

AI

↓

Gemini

Environment variables configured before deployment.

---

# Definition of Done

Backend implementation is complete when

✓ Folder structure followed

✓ All routers implemented

✓ Services complete

✓ Repositories complete

✓ Database connected

✓ AI integrated

✓ Validation implemented

✓ Authentication working

✓ Error handling complete

✓ API matches API_SCHEMA.md

✓ Database matches DATABASE_SCHEMA.md

✓ Environment variables configured

---

End of Document
