# WORKFLOW.md

# CareCompanion Development Workflow

Version: 1.0

Status: Approved

---

# Purpose

This document defines the development workflow for the CareCompanion project.

It establishes how the Frontend, Backend, and AI systems collaborate while remaining independent during development.

Every developer and AI coding assistant must follow this workflow.

---

# Development Philosophy

CareCompanion follows an API-First architecture.

Every feature should be designed around shared contracts before implementation begins.

Documentation is considered the source of truth.

Never assume functionality that is not documented.

---

# Development Lifecycle

Planning

↓

Documentation

↓

Architecture Approval

↓

Parallel Development

↓

Integration

↓

Testing

↓

Deployment

↓

Presentation

---

# Project Structure

carecompanion/

```
docs/

frontend/

backend/

ai/

shared/
```

---

# Shared Documents

Every developer must read

```
00_MASTER_PRD.md

01_MASTER_TRD.md

PROJECT_CONTEXT.md

shared/

API_SCHEMA.md

DATABASE_SCHEMA.md

DESIGN_SYSTEM.md

WORKFLOW.md
```

No implementation should begin before reading these files.

---

# Team Responsibilities

## Frontend Team

Responsible for

- User Interface
- User Experience
- Navigation
- Local State
- API Integration
- Animations

Frontend must NOT

- Access the database
- Implement business logic
- Call Gemini directly

---

## Backend Team

Responsible for

- Authentication
- Business Logic
- APIs
- Database
- Validation
- Notifications
- AI Communication

Backend must NOT

- Build UI
- Store frontend state

---

## AI Team

Responsible for

- Prompt Engineering
- AI Companion
- Report Summaries
- Health Guidance
- Conversation Flow

AI must NOT

- Access database directly
- Access frontend directly
- Perform authentication

---

# Communication Flow

Frontend

↓

Backend

↓

Database

↓

Gemini

↓

Backend

↓

Frontend

The Backend acts as the only communication gateway.

---

# Development Phases

## Phase 1

Freeze Documentation

Complete

- PRD
- TRD
- API Schema
- Database Schema
- Design System

No coding begins until these documents are finalized.

---

## Phase 2

Parallel Development

Frontend develops using

Mock Data

Backend develops using

Database

AI develops using

Prompt Templates

No team waits for another team.

---

## Phase 3

Integration

Frontend switches

Mock Data

↓

Real API

Backend integrates

Gemini

↓

Database

↓

Frontend

---

## Phase 4

Testing

Every feature

Unit Test

↓

Integration Test

↓

Manual Test

↓

Bug Fix

---

## Phase 5

Deployment

Backend

↓

Database

↓

Frontend

↓

AI

↓

Smoke Test

↓

Demo

---

# Git Workflow

Main Branch

```
main
```

Development Branch

```
develop
```

Feature Branches

```
feature/frontend

feature/backend

feature/ai
```

Every feature should have its own feature branch.

Never commit directly to main.

---

# Commit Convention

Examples

```
feat(auth): add login endpoint

feat(ui): create medication card

fix(api): resolve report upload

refactor(ai): simplify prompt
```

---

# Integration Rules

Frontend integrates only through

API_SCHEMA.md

Backend integrates only through

DATABASE_SCHEMA.md

AI integrates only through

Backend APIs

Never directly connect Frontend to AI.

Never directly connect Frontend to Database.

---

# API Contract Rules

API schema is immutable during development.

Do not

- Rename endpoints
- Rename request fields
- Rename response fields

Changes require team approval.

---

# Database Rules

Only Backend owns the database.

Database schema must remain synchronized with

DATABASE_SCHEMA.md

Never modify table names without approval.

---

# UI Rules

Frontend follows

DESIGN_SYSTEM.md

UX_FLOW.md

Never redesign components independently.

Reuse existing components whenever possible.

---

# AI Rules

AI must

- Explain
- Guide
- Encourage

AI must never

- Diagnose
- Prescribe medication
- Replace doctors

---

# Error Handling

Every system must gracefully handle

Loading

Errors

Empty States

Timeouts

Unexpected Responses

---

# Daily Development Process

Read documentation

↓

Select feature

↓

Implement feature

↓

Test locally

↓

Commit

↓

Push

↓

Create Pull Request

↓

Review

↓

Merge

---

# Feature Development Process

Understand feature

↓

Check API dependency

↓

Implement

↓

Test

↓

Review

↓

Merge

---

# Parallel Development Strategy

Frontend

Uses

Mock JSON

Backend

Uses

Database

AI

Uses

Prompt Templates

Integration occurs only after each subsystem reaches approximately 80% completion.

---

# Definition of Done

A feature is complete when

✓ Requirements are implemented

✓ API matches schema

✓ Database matches schema

✓ Loading state exists

✓ Error handling exists

✓ Empty state exists

✓ Accessibility maintained

✓ Feature tested

✓ Documentation updated if required

---

# Project Priorities

Priority 1

Complete MVP

Priority 2

Stable Integration

Priority 3

Accessibility

Priority 4

Animations

Priority 5

Polish

Never sacrifice functionality for visual polish.

---

# Golden Rules

1. Documentation is the source of truth.

2. Backend is the only gateway to the database.

3. Backend is the only gateway to AI.

4. Frontend consumes APIs only.

5. Never modify another subsystem.

6. Never rename shared contracts.

7. Build reusable modules.

8. Keep implementations simple.

9. Finish the MVP before enhancements.

10. Test before merging.

---

# Hackathon Timeline

Hour 0–2

Documentation

Hour 2–16

Parallel Development

Hour 16–20

Integration

Hour 20–22

Testing

Hour 22–24

Deployment

Presentation

---

# Success Criteria

The workflow is successful when

✓ Teams work independently.

✓ No integration conflicts occur.

✓ APIs remain consistent.

✓ Database remains consistent.

✓ AI integrates without changing backend contracts.

✓ MVP is completed within the hackathon duration.

---

End of Document
