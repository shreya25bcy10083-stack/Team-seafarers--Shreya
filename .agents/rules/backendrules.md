---
trigger: always_on
---

# BACKEND_RULES.md

# CareCompanion

## Backend Development Rules

Version: 1.0

Status: Approved

Owner: Backend Team

---

# Purpose

This document defines the mandatory engineering rules for the backend system.

Every backend developer and AI coding assistant must follow these rules.

If implementation conflicts with this document, this document takes priority.

---

# Core Principles

1. API First Development

2. Security First

3. Single Responsibility Principle

4. Modular Architecture

5. Consistency Over Cleverness

6. Simplicity Over Complexity

---

# Technology Rules

Backend Stack

✓ FastAPI

✓ SQLAlchemy

✓ Pydantic

✓ PostgreSQL

✓ Alembic

✓ Gemini API

Do NOT introduce additional frameworks without team approval.

---

# Architecture Rules

Follow the architecture

```

Client

↓

Router

↓

Service

↓

Repository

↓

Database

```

Never skip layers.

---

# Router Rules

Routers should only

- Receive requests
- Validate requests
- Call services
- Return responses

Routers should NEVER

- Write SQL
- Call SQLAlchemy
- Contain business logic
- Call Gemini
- Format prompts

Maximum router length

150 lines

---

# Service Rules

Services contain all business logic.

Services may

- Call repositories
- Call AI
- Perform calculations
- Trigger notifications

Services should NEVER

- Return HTTP responses
- Handle authentication directly
- Access request objects

One service

↓

One responsibility

---

# Repository Rules

Repositories communicate only with the database.

Repositories may

- Query
- Insert
- Update
- Delete

Repositories should NEVER

- Call AI
- Validate business logic
- Return HTTP responses

---

# Model Rules

Every database table has one SQLAlchemy model.

Naming

PascalCase

Example

```

User

Patient

Medication

MedicalReport

```

One model

↓

One table

---

# Schema Rules

Every endpoint must use Pydantic.

Each module should contain

Create Schema

Update Schema

Response Schema

Never use raw dictionaries for validation.

---

# Validation Rules

Every request must validate

Required fields

Data types

Ranges

Ownership

Permissions

Reject invalid requests before reaching the service layer.

---

# API Rules

Every endpoint must

Use

```

/api/v1/

```

Return

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

Never change this structure.

---

# Authentication Rules

Every protected endpoint

Requires JWT authentication.

Always validate

- User identity
- User role
- Resource ownership

Never trust frontend data.

---

# Database Rules

Use SQLAlchemy ORM only.

Never write raw SQL unless absolutely necessary.

Every query should

- Be optimized
- Be readable
- Be reusable

Never duplicate queries.

---

# Transaction Rules

Database changes should

Commit once

Rollback on failure

Close session after request

Never leave transactions open.

---

# AI Rules

Only

AI Service

may communicate with Gemini.

Never call Gemini from

- Routers
- Repositories
- Models

Prompts should remain external.

Never hardcode prompts inside services.

---

# Prompt Rules

Store prompts inside

```

ai/prompts/

```

One prompt

↓

One file

Never embed prompts directly inside Python files.

---

# File Upload Rules

Allow

PDF

PNG

JPG

JPEG

Reject

Executable files

Unknown formats

Maximum Size

10 MB

Validate MIME type before upload.

---

# Notification Rules

Notifications should be

Independent

Asynchronous when possible

Reusable

Never tightly couple notifications with business logic.

---

# Logging Rules

Log

Requests

Authentication

Errors

AI Calls

Performance

Never log

Passwords

JWT Tokens

Medical Reports

API Keys

Personal health information

---

# Error Handling Rules

Always catch

Database Errors

Validation Errors

Authentication Errors

AI Errors

Return meaningful messages.

Never expose stack traces.

---

# Configuration Rules

Environment Variables only.

Never hardcode

```

DATABASE_URL

JWT_SECRET

GEMINI_API_KEY

CLOUDINARY_URL

```

---

# Security Rules

Passwords

Hash using bcrypt

JWT

Verify every request

Validate uploads

Sanitize input

Protect user ownership

Never expose internal IDs unnecessarily.

---

# Performance Rules

Target

API Response

<500ms

Authentication

<300ms

Database Query

<200ms

AI Response

<8 seconds

Avoid N+1 database queries.

Reuse database sessions correctly.

---

# Naming Rules

Files

snake_case

```

patient_service.py

auth_router.py

report_repository.py

```

Classes

PascalCase

```

PatientService

MedicationRepository

```

Variables

snake_case

```

patient_name

report_summary

```

Constants

UPPER_SNAKE_CASE

```

MAX_UPLOAD_SIZE

JWT_EXPIRATION

```

---

# Code Rules

Function

Maximum

60 lines

Class

Maximum

300 lines

Avoid deeply nested conditionals.

Prefer early returns.

Keep code readable.

---

# Dependency Rules

Use FastAPI Depends()

For

Database

Authentication

Authorization

Shared dependencies

Never manually create dependencies inside routes.

---

# API Versioning Rules

Every endpoint begins with

```

/api/v1/

```

Future versions

```

/api/v2/

```

Never remove existing APIs during the hackathon.

---

# Documentation Rules

Every router should include

Description

Request

Response

Errors

Every service should include

Purpose

Inputs

Outputs

Complex business logic should be documented.

---

# Git Rules

One feature

↓

One branch

One branch

↓

One Pull Request

Never commit directly to

main

Merge only after testing.

---

# Testing Rules

Every endpoint must verify

✓ Success

✓ Invalid Request

✓ Unauthorized Access

✓ Forbidden Access

✓ Database Failure

✓ AI Failure

✓ File Upload Validation

✓ Edge Cases

---

# AI Coding Rules

When using Antigravity IDE

Always provide

PROJECT_CONTEXT.md

MASTER_TRD.md

API_SCHEMA.md

DATABASE_SCHEMA.md

BACKEND_PRD.md

BACKEND_TRD.md

BACKEND_RULES.md

Never allow AI to

Invent APIs

Invent database tables

Rename routes

Rename schemas

Invent response structures

Always follow project documentation.

---

# Definition of Done

Backend implementation is complete when

✓ Folder structure followed

✓ All endpoints implemented

✓ Business logic inside services

✓ SQLAlchemy used correctly

✓ Validation complete

✓ Authentication functional

✓ AI integrated

✓ API responses standardized

✓ Environment variables configured

✓ Documentation followed

✓ No hardcoded secrets

✓ Code reviewed

---

# Golden Rules

1. Backend is the only gateway to the database.

2. Backend is the only gateway to AI.

3. Business logic belongs in services.

4. Routers should stay thin.

5. SQLAlchemy ORM only.

6. Validate everything.

7. Never trust client input.

8. Keep APIs consistent.

9. Build for maintainability.

10. Documentation is the source of truth.

---

End of Document
