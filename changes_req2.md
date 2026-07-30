# CHANGE_REQUEST_v1.2.md

# CareCompanion

## Version 1.2 Critical Release Fixes

Version: 1.2

Priority: Critical

Status: Approved

---

# Purpose

This document defines all critical issues discovered after Version 1.1 implementation.

These issues prevent the application from functioning correctly and must be resolved before any additional features or UI improvements.

No new features should be implemented until every issue listed below has been resolved.

---

# Critical Issues

## Authentication

### Current Problem

The application bypasses authentication and opens directly on the Patient Dashboard.

Users are not required to log in.

Email validation is not working.

Authentication is incomplete.

---

### Required Behaviour

Application Launch

↓

Splash Screen

↓

Authentication

↓

Login/Register

↓

Role Verification

↓

Patient Dashboard

OR

↓

Caregiver Dashboard

The dashboard should NEVER open unless authentication succeeds.

---

### Requirements

- Validate email format.
- Validate password.
- Reject invalid credentials.
- Store authentication session.
- Maintain login state.
- Redirect according to role.
- Logout should clear session completely.

---

## Email Validation

### Current Problem

Any string is accepted as an email.

Example

```
abc

hello

123
```

All should fail.

---

### Required Behaviour

Accept only valid email addresses.

Example

```
user@gmail.com

john@example.com
```

Reject invalid formats before sending the request to the backend.

Backend must also validate.

---

## AI Chatbot

### Current Problem

Every prompt returns the same response.

Conversation context is ignored.

The chatbot behaves like a static response generator.

---

### Required Behaviour

Every request must

- Receive the current user message.
- Receive recent conversation history.
- Build a unique prompt.
- Generate a unique response.

The AI should understand context.

Example

User

"What is diabetes?"

↓

Explanation

User

"What foods should I avoid?"

↓

Should answer the follow-up.

NOT repeat the previous response.

---

### Requirements

Conversation context

Recent messages

Dynamic prompt generation

No hardcoded responses

No cached static replies

---

## Medical Report Analysis

### Current Problem

Medical reports cannot be uploaded successfully.

No AI analysis is displayed.

---

### Required Behaviour

Upload Report

↓

Store in Cloudinary

↓

Extract Report

↓

Gemini Analysis

↓

Generate Summary

↓

Display

- Summary
- Important Findings
- Easy Explanation
- Health Tips
- Questions for Doctor

---

## Caregiver Dashboard

### Current Problem

Dashboard does not exist.

---

### Required Behaviour

Dashboard should include

- Patient Information
- Medication Schedule
- Wellness Status
- Recent Activity
- Medical Reports
- SOS Alerts

The caregiver should immediately understand the patient's health status.

---

## Patient-Caregiver Linking

### Current Problem

Patient and caregiver accounts are not linked.

---

### Required Behaviour

Patient

↓

Generate Invite Code

↓

Caregiver

↓

Enter Invite Code

↓

Backend Verification

↓

Accounts Linked

↓

Dashboard Accessible

Only linked caregivers should access patient data.

---

## Avatar

### Current Problem

Current avatar does not match project design.

---

### Required Behaviour

Interactive avatar

States

- Idle
- Greeting
- Listening
- Thinking
- Speaking
- Reminder
- Concerned

Animations

- Blink
- Float
- Lip Sync
- Wave
- Pulse

The avatar should react to

- AI responses
- Notifications
- User interaction

---

## Notification System

### Current Problem

Medication reminders are unreliable.

---

### Required Behaviour

Notifications should

- Trigger at exact reminder time.
- Display as high-priority notifications.
- Play loud alarm.
- Continue until acknowledged.
- Notify caregiver after repeated misses.

---

## SOS

### Current Problem

SOS does not notify caregivers.

---

### Required Behaviour

Patient

↓

SOS

↓

Backend

↓

Notification

↓

Caregiver

↓

Dashboard Alert

↓

Push Notification

---

# Development Priority

Priority 1

Authentication

Email Validation

Session Management

Role Routing

---

Priority 2

AI Chat

Medical Report Analysis

Gemini Integration

---

Priority 3

Caregiver Dashboard

Patient Linking

Recent Activity

---

Priority 4

Notifications

SOS

Avatar

---

# Acceptance Criteria

The update is complete when

✓ Authentication is fully functional.

✓ Invalid emails are rejected.

✓ Users cannot bypass login.

✓ AI generates unique responses.

✓ Reports upload successfully.

✓ AI analyzes reports.

✓ Caregiver dashboard exists.

✓ Patient-caregiver linking works.

✓ Avatar matches design.

✓ Notifications are reliable.

✓ SOS notifies caregiver immediately.

No additional features should be added until all critical issues are resolved.

---

End of Document
