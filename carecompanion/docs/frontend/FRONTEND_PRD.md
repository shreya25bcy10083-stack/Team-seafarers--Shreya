# FRONTEND_PRD.md

# CareCompanion

## Frontend Product Requirements Document

Version: 1.0

Status: Approved

Owner: Frontend Team

---

# Purpose

This document defines all frontend responsibilities for CareCompanion.

The frontend is responsible for creating an accessible, responsive, and intuitive user experience for elderly users and caregivers.

It communicates exclusively with the backend through REST APIs.

---

# Frontend Objectives

The frontend must

- Deliver an accessible interface.
- Provide a simple navigation experience.
- Display backend data clearly.
- Integrate AI responses naturally.
- Handle all loading, empty, and error states.
- Maintain consistency across all screens.

---

# Responsibilities

Frontend owns

- User Interface
- User Experience
- Navigation
- Local State
- API Consumption
- Animations
- Accessibility

Frontend does NOT own

- Authentication Logic
- Database
- AI Logic
- Business Logic

---

# Target Platforms

- Android
- iOS

Primary optimization should target Android devices.

---

# Navigation Structure

```

Authentication

↓

Role Selection

↓

Patient App

↓

Home

Medication

AI Companion

Reports

Profile

```

Caregiver

```

Dashboard

↓

Patients

↓

Reports

↓

Alerts

↓

Settings

```

---

# Core Screens

## Splash Screen

Purpose

Introduce the application.

Requirements

- Logo
- App Name
- Loading Animation

Navigation

Auto redirect to Login.

---

## Login Screen

Purpose

Authenticate user.

Components

- Email Input
- Password Input
- Login Button
- Register Button

Dependencies

POST /api/v1/auth/login

Acceptance Criteria

✓ Input validation

✓ Loading state

✓ Error handling

---

## Register Screen

Purpose

Create account.

Components

- Name
- Email
- Password
- Role Selection

Dependencies

POST /api/v1/auth/register

---

## Role Selection

Purpose

Choose

- Patient
- Caregiver

Navigation determined by selected role.

---

# Patient Screens

---

## Home Screen

Purpose

Display today's healthcare summary.

Components

- Avatar
- Greeting
- Today's Medication
- Wellness Card
- Report Summary
- SOS Button

Dependencies

GET /patient/profile

GET /medications

GET /notifications

---

## Medication Screen

Purpose

Manage medications.

Components

Medication List

Status Badge

Reminder Card

Add Button

Actions

- Mark Taken
- Snooze
- Skip

Dependencies

GET /medications

POST /medications/log

---

## Wellness Screen

Purpose

Daily health check.

Components

Mood Selector

Pain Slider

Sleep Input

Energy Selector

Notes

Submit Button

Dependencies

POST /wellness/checkin

---

## AI Companion Screen

Purpose

Allow conversation with AI.

Components

Avatar

Chat Window

Voice Button

Text Input

Suggested Prompts

Dependencies

POST /ai/chat

---

## Medical Report Screen

Purpose

Upload reports.

Components

Upload Button

Report Card

Summary Card

AI Suggestions

Dependencies

POST /reports/upload

POST /ai/report-summary

---

## Notifications Screen

Purpose

Display reminders.

Components

Notification Card

Status Badge

Read Button

Dependencies

GET /notifications

---

## Profile Screen

Purpose

Manage settings.

Components

Profile Card

Accessibility Settings

Reminder Settings

Logout

Dependencies

GET /patient/profile

PUT /patient/profile

---

## SOS Screen

Purpose

Emergency assistance.

Components

Large SOS Button

Countdown

Cancel Button

Status

Dependencies

POST /sos

---

# Caregiver Screens

---

## Dashboard

Purpose

Monitor patient.

Components

Patient Card

Medication Progress

Wellness Status

Recent Reports

Alerts

Dependencies

GET /caregiver/dashboard

---

## Patient Details

Purpose

View detailed patient information.

Components

Medication History

Reports

Wellness Timeline

Dependencies

GET /caregiver/patient/{id}

---

# Shared Components

Avatar

Primary Button

Secondary Button

Medication Card

Reminder Card

Health Card

Patient Card

Report Card

Notification Card

Status Badge

Bottom Navigation

Input Field

Dialog

Progress Ring

Loading Skeleton

Error View

Empty State

---

# State Management

Local State

- Theme
- Navigation
- Temporary Form Data

Backend State

- User
- Medications
- Reports
- Notifications
- Wellness

Never duplicate backend state unnecessarily.

---

# API Consumption

Frontend never communicates directly with

- Database
- AI
- Cloudinary

Every request goes through Backend APIs.

---

# Accessibility Requirements

Large Text

High Contrast

Large Touch Targets

Voice Support

Text-to-Speech

Speech-to-Text

Simple Navigation

Readable Buttons

Minimal Cognitive Load

---

# Error Handling

Every screen must support

Loading State

Error State

Empty State

Offline State

---

# Performance Goals

Application launch

<3 seconds

Screen transitions

<300ms

API loading indicator

Immediate

Animations

Smooth and subtle

---

# Future Enhancements

Dark Mode

Offline Mode

Wearable Integration

Health Charts

Doctor Portal

---

# Definition of Done

Frontend implementation is complete when

✓ All screens implemented

✓ Navigation works

✓ APIs integrated

✓ Accessibility requirements satisfied

✓ Loading/Error/Empty states implemented

✓ Responsive layouts verified

✓ UI follows Design System

---

End of Document
