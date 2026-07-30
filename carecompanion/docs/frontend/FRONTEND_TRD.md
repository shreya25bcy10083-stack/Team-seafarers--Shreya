# FRONTEND_TRD.md

# CareCompanion

## Frontend Technical Requirements Document

Version: 1.0

Status: Approved

Owner: Frontend Team

---

# Purpose

This document defines the technical implementation of the CareCompanion frontend.

It specifies the project architecture, folder structure, navigation, component hierarchy, API integration strategy, state management, and coding standards.

This document should be treated as the implementation guide for the frontend system.

---

# Tech Stack

Framework

- React Native

Development Platform

- Expo

Language

- TypeScript

Styling

- NativeWind

Navigation

- React Navigation

Networking

- Axios

State Management

- React Context API

Storage

- AsyncStorage

Animations

- React Native Reanimated

Icons

- Lucide React Native

---

# Architecture

The frontend follows a feature-based modular architecture.

```

UI

↓

Hooks

↓

Services

↓

API

↓

Backend

```

Business logic should never exist inside UI components.

---

# Folder Structure

```
frontend/

src/

├── assets/
│
├── components/
│   ├── common/
│   ├── cards/
│   ├── buttons/
│   ├── avatar/
│   ├── inputs/
│   └── dialogs/
│
├── screens/
│   ├── auth/
│   ├── patient/
│   ├── caregiver/
│   └── shared/
│
├── navigation/
│
├── hooks/
│
├── services/
│
├── context/
│
├── utils/
│
├── constants/
│
├── types/
│
├── config/
│
├── styles/
│
└── App.tsx
```

---

# Screen Organization

Authentication

```
LoginScreen

RegisterScreen

RoleSelectionScreen
```

Patient

```
HomeScreen

MedicationScreen

WellnessScreen

ChatScreen

ReportsScreen

NotificationsScreen

ProfileScreen

SOSScreen
```

Caregiver

```
DashboardScreen

PatientDetailsScreen

ReportsScreen

AlertsScreen

SettingsScreen
```

---

# Component Hierarchy

```
App

↓

Navigation

↓

Screen

↓

Section

↓

Card

↓

Reusable Components

↓

Buttons / Inputs / Avatar
```

Every component should have only one responsibility.

---

# Reusable Components

Common

```
PrimaryButton

SecondaryButton

InputField

LoadingSpinner

ErrorView

EmptyState

Avatar
```

Cards

```
MedicationCard

ReportCard

HealthCard

ReminderCard

PatientCard

NotificationCard
```

Dialogs

```
ConfirmationDialog

AlertDialog

VoiceDialog
```

---

# Navigation Structure

Authentication Stack

↓

Role Selection

↓

Patient Stack

or

Caregiver Stack

Patient Navigation

```
Home

Medication

AI

Reports

Profile
```

Caregiver Navigation

```
Dashboard

Patients

Reports

Settings
```

Navigation should never exceed three levels deep.

---

# API Layer

Every API request must pass through

```
services/api.ts
```

Example

```
Home Screen

↓

useMedication()

↓

MedicationService

↓

Axios

↓

Backend
```

Screens should never call Axios directly.

---

# Service Structure

```
auth.service.ts

patient.service.ts

medication.service.ts

wellness.service.ts

report.service.ts

notification.service.ts

ai.service.ts

sos.service.ts
```

Each service handles one domain.

---

# Hooks

Reusable hooks

```
useAuth()

useMedication()

usePatient()

useReports()

useNotifications()

useAI()

useSOS()
```

Hooks manage API calls and local state.

---

# Context

Global Context

```
AuthContext

ThemeContext

NotificationContext
```

Avoid storing server data globally unless necessary.

---

# Constants

```
colors.ts

routes.ts

spacing.ts

typography.ts

api.ts
```

Never hardcode values inside components.

---

# Type Definitions

```
User.ts

Medication.ts

Report.ts

Notification.ts

Wellness.ts

API.ts
```

Every API response should have a corresponding TypeScript interface.

---

# Styling Guidelines

Use NativeWind.

Never use inline styles unless dynamic.

Use Design System tokens.

Spacing

8-point grid.

Typography

Follow DESIGN_SYSTEM.md.

---

# Asset Structure

```
assets/

images/

icons/

animations/

sounds/
```

All assets should be optimized.

---

# State Management

Local State

```
useState
```

Complex Logic

```
Custom Hooks
```

Global State

```
React Context
```

Avoid unnecessary global state.

---

# Error Handling

Every API call must handle

Loading

↓

Success

↓

Failure

↓

Retry

No blank screens.

---

# Loading Strategy

Every screen must include

Loading Skeleton

or

Loading Spinner

Never block user interaction unnecessarily.

---

# Empty State Strategy

Every list should support

No Medications

No Reports

No Notifications

No Patients

Provide a clear call-to-action.

---

# Accessibility

Support

Large Text

Voice Feedback

Screen Readers

High Contrast

Large Buttons

Simple Navigation

Accessibility is mandatory.

---

# Performance

Lazy load screens.

Reuse components.

Avoid unnecessary re-renders.

Memoize expensive components where appropriate.

Optimize images.

---

# Security

Never store

Passwords

Tokens in plain text

Secrets

API Keys

Sensitive values belong on the backend.

---

# Testing Checklist

Each screen must verify

✓ Navigation

✓ API Integration

✓ Loading State

✓ Error State

✓ Empty State

✓ Accessibility

✓ Responsive Layout

---

# Naming Convention

Components

PascalCase

```
MedicationCard

Avatar

HealthCard
```

Hooks

camelCase

```
useMedication()

useReports()
```

Services

snake_case or domain-based

```
medication.service.ts

report.service.ts
```

Constants

UPPER_SNAKE_CASE

```
API_BASE_URL

MAX_FILE_SIZE
```

---

# Definition of Done

Frontend implementation is complete when

✓ Folder structure followed

✓ Screens implemented

✓ Reusable components created

✓ API services implemented

✓ Navigation completed

✓ Accessibility implemented

✓ Design System followed

✓ All API integrations functional

✓ No hardcoded values

✓ Code passes linting

---

End of Document
