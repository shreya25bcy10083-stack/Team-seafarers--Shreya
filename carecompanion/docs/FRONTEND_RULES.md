# FRONTEND_RULES.md

# CareCompanion

## Frontend Development Rules

Version: 1.0

Status: Approved

Owner: Frontend Team

---

# Purpose

This document defines the development rules for the frontend system.

Every developer and AI coding assistant must follow these rules.

If a rule conflicts with personal preference, this document takes precedence.

---

# Core Principles

1. Accessibility First

2. Mobile First

3. Reusable Components

4. Simplicity Over Complexity

5. API First

6. Design System First

---

# General Rules

✅ Always use TypeScript.

✅ Always follow the Design System.

✅ Always use reusable components.

✅ Build for Android first.

❌ Never hardcode data.

❌ Never hardcode colors.

❌ Never hardcode spacing.

❌ Never hardcode API URLs.

---

# Folder Rules

Every file belongs in the correct folder.

Do not place components inside screens.

Do not place services inside components.

Do not place business logic inside UI.

Example

Correct

```

screens/

components/

services/

hooks/

```

Wrong

```

screens/Home/

api.js

button.tsx

```

---

# Component Rules

Every component must

- Have one responsibility.
- Be reusable.
- Accept props.
- Avoid duplicated logic.

Maximum component length

300 lines

Split larger components.

---

# Screen Rules

Every screen must contain

- Title
- Loading State
- Error State
- Empty State
- Responsive Layout

Every screen has one primary action.

---

# Styling Rules

Use NativeWind only.

Never mix styling approaches.

Spacing

Only use

4

8

16

24

32

40

48

Follow the 8-point grid.

---

# Color Rules

Colors must come from

```
constants/colors.ts
```

Never write

```
"#3B82F6"

"#22C55E"
```

inside components.

---

# Typography Rules

Follow

DESIGN_SYSTEM.md

Never invent font sizes.

Use predefined typography constants.

---

# API Rules

Every API request goes through

```
services/
```

Never call Axios inside

- Screens
- Components
- Hooks

Example

Correct

```
Home Screen

↓

MedicationService

↓

Axios

↓

Backend
```

Wrong

```
Home Screen

↓

Axios
```

---

# Hook Rules

Hooks should

- Fetch data
- Manage local state
- Handle loading
- Handle errors

Hooks should NOT

Render UI.

---

# State Management

Local State

useState

Complex Logic

Custom Hooks

Global State

Context API

Avoid unnecessary global state.

---

# Navigation Rules

Use React Navigation.

Maximum navigation depth

3

Never navigate using hardcoded strings.

Store routes inside

```
constants/routes.ts
```

---

# Component Naming

PascalCase

Correct

```
MedicationCard

ReminderCard

HealthCard
```

Wrong

```
medicationcard

card

component1
```

---

# Hook Naming

camelCase

Correct

```
useMedication()

useReports()
```

---

# Service Naming

Domain based

```
medication.service.ts

report.service.ts
```

---

# Asset Rules

Images

```
assets/images
```

Icons

```
assets/icons
```

Animations

```
assets/animations
```

Never place assets randomly.

---

# Accessibility Rules

Every button

Minimum

48x48

Every icon

Has label

Every image

Has accessibility label

Support

Large Text

Screen Readers

Voice Navigation

High Contrast

Accessibility is mandatory.

---

# Avatar Rules

Avatar should appear on

Home

Medication

Wellness

AI Chat

Report Summary

The Avatar should never disappear during important interactions.

---

# Animation Rules

Allowed

Fade

Scale

Slide

Pulse

Typing Indicator

Avatar Blink

Avoid

Bounce

Shake

Flash

Long animations

Maximum duration

400ms

---

# Loading Rules

Every screen must display

Skeleton

or

Spinner

Never show a blank screen.

---

# Error Rules

Every API call

Must handle

Loading

↓

Success

↓

Failure

↓

Retry

Never expose backend errors directly.

---

# Empty State Rules

Every list requires

Illustration

Message

Action Button

Example

"No reports uploaded."

↓

"Upload Report"

---

# Performance Rules

Reuse components.

Memoize expensive components.

Optimize images.

Avoid unnecessary re-renders.

Do not fetch the same API multiple times.

---

# Security Rules

Never store

Passwords

API Keys

Secrets

Tokens in plain text.

Frontend never contains Gemini API keys.

---

# Code Rules

Functions

Maximum

50 lines

Components

Maximum

300 lines

Meaningful variable names only.

Avoid nested conditionals.

Prefer early returns.

---

# Git Rules

One feature

↓

One branch

One feature

↓

One Pull Request

Never commit directly to

main

---

# Documentation Rules

Every major component

Requires

Description

Props

Usage

Complex logic should include comments.

---

# Testing Rules

Before merging verify

✓ Navigation

✓ API Calls

✓ Loading State

✓ Empty State

✓ Error State

✓ Accessibility

✓ Responsive Layout

---

# AI Coding Rules

When using Antigravity IDE

Always provide

PROJECT_CONTEXT.md

DESIGN_SYSTEM.md

FRONTEND_PRD.md

FRONTEND_TRD.md

FRONTEND_RULES.md

Never allow AI to

Rename components

Invent APIs

Invent routes

Invent colors

Invent navigation

Follow shared documentation only.

---

# Definition of Done

Frontend work is complete when

✓ Components reusable

✓ Screens responsive

✓ Accessibility implemented

✓ APIs integrated

✓ No hardcoded values

✓ Navigation complete

✓ Loading/Error/Empty states implemented

✓ Code reviewed

✓ Documentation followed

---

# Golden Rules

1. Design System is the source of truth.

2. Reuse before creating new components.

3. Accessibility is not optional.

4. Frontend never accesses the database.

5. Frontend never calls Gemini directly.

6. API responses follow API_SCHEMA.md.

7. Build small components.

8. Keep code readable.

9. Finish functionality before polish.

10. Consistency beats creativity.

---

End of Document
