# DESIGN_SYSTEM.md

# CareCompanion Design System

Version: 1.0

---

# Purpose

This document defines the visual identity, component standards, accessibility rules, and interaction guidelines for CareCompanion.

Every frontend screen must follow this design system.

No UI element should be created without following these guidelines.

---

# Design Philosophy

CareCompanion is **not** a healthcare dashboard.

It is a healthcare companion.

The interface should feel

- Calm
- Friendly
- Safe
- Accessible
- Human
- Reassuring

The user should never feel overwhelmed.

---

# Design Principles

1. Accessibility First

2. AI First

3. One Screen = One Primary Task

4. Minimal Cognitive Load

5. Large Touch Targets

6. Conversational Navigation

7. Progressive Disclosure

---

# Brand Personality

Friendly

Supportive

Patient

Trustworthy

Calm

Simple

Never robotic.

Never overly clinical.

---

# Color System

## Primary

Healthcare Green

Purpose

- Success
- Medication Completed
- Healthy Status

---

## Secondary

Sky Blue

Purpose

- Information
- AI Companion
- Navigation

---

## Accent

Soft Purple

Purpose

- AI Avatar
- Assistant Actions

---

## Warning

Amber

Purpose

- Reminder
- Pending Tasks

---

## Error

Red

Purpose

- SOS
- Errors
- Critical Alerts

---

## Neutral

White

Light Gray

Dark Gray

Used for

- Background
- Cards
- Text

---

# Color Usage Rules

Green

Only

- Success
- Healthy

Never use green for buttons unrelated to health.

---

Red

Only

- SOS
- Delete
- Critical Alerts

---

Blue

Only

Navigation

Information

Links

---

Amber

Only

Reminder

Pending Medication

Notifications

---

# Typography

Primary Font

Inter

Fallback

System Font

---

# Font Scale

Display

32px

Heading 1

28px

Heading 2

24px

Heading 3

20px

Body

16px

Caption

14px

Small Labels

12px

---

# Typography Rules

Never use more than three font sizes on one screen.

Never use all caps for paragraphs.

Use sentence case.

---

# Spacing System

Use an 8-point grid.

Spacing values

4

8

16

24

32

40

48

Never use arbitrary spacing.

---

# Border Radius

Small

8

Medium

16

Large

24

Cards

20

Avatar

Circular

---

# Shadows

Minimal.

Soft elevation only.

Avoid heavy shadows.

---

# Icon Guidelines

Use outlined icons.

Icons should always include text labels.

Never use icons alone for critical actions.

---

# Avatar Design

The AI Avatar is the face of the application.

It should always appear

- Friendly
- Calm
- Animated
- Expressive

---

# Avatar States

Idle

Smiling

Listening

Thinking

Speaking

Happy

Concerned

Emergency

Sleeping

---

# Avatar Behaviour

Greeting

Smile

Medication Reminder

Wave

Listening

Microphone animation

Thinking

Subtle pulse

Speaking

Lip animation

Emergency

Concerned expression

---

# Animation Principles

Animations should

- Feel natural
- Be subtle
- Never distract

---

# Animation Duration

Short

150ms

Normal

250ms

Long

400ms

---

# Allowed Animations

Fade

Slide

Scale

Pulse

Typing Indicator

Progress Fill

Avatar Blink

---

# Avoid

Bounce

Spin

Flash

Excessive motion

---

# Cards

Every card contains

Title

Description

Primary Action

Optional Secondary Action

Rounded Corners

Soft Shadow

---

# Button Styles

Primary

Filled

Rounded

Secondary

Outlined

Danger

Red

Ghost

Text only

---

# Button Rules

Minimum Height

48px

Preferred Height

56px

Large Tap Area

Required

---

# Input Fields

Rounded Corners

Large Padding

Clear Labels

Visible Focus State

Error Message Below

---

# Navigation

Bottom Navigation

Maximum

4 Tabs

Patient

Home

Medication

AI

Profile

Caregiver

Dashboard

Patients

Alerts

Settings

---

# Layout

Maximum

One primary action per screen.

Avoid nested scrolling.

Avoid deep navigation.

---

# Accessibility

Minimum Tap Target

48x48

Minimum Font

16px

High Contrast

Supported

Voice Support

Supported

Text To Speech

Supported

Speech To Text

Supported

---

# Reminder Design

Medication Reminder

Large Card

Large Buttons

Voice Prompt

Countdown

Avatar

---

# SOS Design

Always visible.

Large red circular button.

Long press activation.

Countdown animation.

Confirmation screen.

---

# AI Conversation

Chat bubbles

Rounded

Readable width

Large spacing

Voice button always visible.

Suggested prompts displayed below.

---

# Loading States

Use

Skeleton Cards

Progress Indicators

Avatar Thinking Animation

Never leave blank screens.

---

# Empty States

Illustration

Helpful Message

Primary Action

Example

"No medications added yet."

[Add Medication]

---

# Error States

Friendly language.

Example

Instead of

Error 404

Use

"We couldn't load your medications.
Please try again."

---

# Notification Design

Medication

Green

Reminder

Amber

Emergency

Red

Information

Blue

---

# Component Library

Reusable Components

Avatar

MedicationCard

ReminderCard

HealthCard

PatientCard

ReportCard

StatusBadge

ProgressRing

BottomNavigation

PrimaryButton

SecondaryButton

InputField

SearchBar

AlertDialog

ConfirmationDialog

LoadingSpinner

EmptyState

ErrorState

VoiceButton

SOSButton

---

# Screen Rules

Every screen must contain

Clear Title

Primary Action

Back Navigation (where required)

Loading State

Error State

Empty State

Accessibility Labels

---

# Responsive Design

Support

Small Phones

Medium Phones

Large Phones

Tablets (basic)

Use flexible layouts.

Never hardcode dimensions.

---

# Design Consistency

Use reusable components.

Do not redesign existing patterns.

Follow spacing system.

Follow typography system.

Follow color system.

---

# UX Principles

The application should answer

"What should the user do next?"

Every screen should guide the user naturally.

Never overwhelm users with multiple decisions.

---

# Design Goals

The interface should make elderly users feel

- Comfortable
- Confident
- Supported
- Independent

The interface should feel like a caring companion rather than a medical application.

---

End of Document
