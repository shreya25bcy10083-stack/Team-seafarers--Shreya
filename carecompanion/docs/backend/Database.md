# DATABASE_SCHEMA.md

# CareCompanion Database Schema

Version: 1.0

Status: Approved

Database

PostgreSQL (Neon)

---

# Purpose

This document defines the complete database schema for CareCompanion.

It specifies

- Tables
- Relationships
- Constraints
- Naming Conventions
- Primary Keys
- Foreign Keys

Backend developers must follow this schema exactly.

---

# Naming Convention

## Tables

Plural

snake_case

Examples

users

patients

medications

wellness_checks

---

## Columns

snake_case

Examples

created_at

patient_id

report_url

medication_status

---

## Primary Keys

Every table

id

INTEGER

Auto Increment

---

## Foreign Keys

Reference

<entity>\_id

Example

patient_id

caregiver_id

medication_id

---

# Entity Relationship Overview

```

User
│
├── Patient
│
│ ├── Medication
│ ├── Medication Log
│ ├── Wellness Check
│ ├── Medical Report
│ ├── SOS Event
│
└── Caregiver
│
└── Patient_Caregiver

```

---

# Table

users

Purpose

Stores authentication and role information.

Columns

| Column        | Type                |
| ------------- | ------------------- |
| id            | SERIAL PRIMARY KEY  |
| full_name     | VARCHAR(100)        |
| email         | VARCHAR(255) UNIQUE |
| password_hash | TEXT                |
| role          | VARCHAR(20)         |
| created_at    | TIMESTAMP           |
| updated_at    | TIMESTAMP           |

Allowed Roles

```

patient

caregiver

```

---

# Table

patients

Purpose

Stores patient-specific information.

Columns

| Column            | Type                 |
| ----------------- | -------------------- |
| id                | SERIAL PRIMARY KEY   |
| user_id           | INTEGER FK users(id) |
| age               | INTEGER              |
| gender            | VARCHAR(20)          |
| blood_group       | VARCHAR(5)           |
| emergency_contact | VARCHAR(20)          |
| created_at        | TIMESTAMP            |
| updated_at        | TIMESTAMP            |

Relationship

One User

↓

One Patient

---

# Table

caregivers

Purpose

Stores caregiver profile.

Columns

| Column       | Type                 |
| ------------ | -------------------- |
| id           | SERIAL PRIMARY KEY   |
| user_id      | INTEGER FK users(id) |
| phone        | VARCHAR(20)          |
| relationship | VARCHAR(50)          |
| created_at   | TIMESTAMP            |

Relationship

One User

↓

One Caregiver

---

# Table

patient_caregivers

Purpose

Connects patients with caregivers.

Columns

| Column       | Type                      |
| ------------ | ------------------------- |
| id           | SERIAL PRIMARY KEY        |
| patient_id   | INTEGER FK patients(id)   |
| caregiver_id | INTEGER FK caregivers(id) |
| invite_code  | VARCHAR(20)               |
| status       | VARCHAR(20)               |
| created_at   | TIMESTAMP                 |

Status

```

pending

accepted

rejected

```

Relationship

Many-to-Many

Patient

↓

Caregiver

---

# Table

medications

Purpose

Stores medication schedules.

Columns

| Column        | Type                    |
| ------------- | ----------------------- |
| id            | SERIAL PRIMARY KEY      |
| patient_id    | INTEGER FK patients(id) |
| medicine_name | VARCHAR(100)            |
| dosage        | VARCHAR(50)             |
| frequency     | VARCHAR(50)             |
| reminder_time | TIME                    |
| instructions  | TEXT                    |
| created_at    | TIMESTAMP               |
| updated_at    | TIMESTAMP               |

Relationship

One Patient

↓

Many Medications

---

# Table

medication_logs

Purpose

Stores medication adherence history.

Columns

| Column        | Type                       |
| ------------- | -------------------------- |
| id            | SERIAL PRIMARY KEY         |
| medication_id | INTEGER FK medications(id) |
| status        | VARCHAR(20)                |
| taken_at      | TIMESTAMP                  |

Allowed Status

```

taken

missed

snoozed

```

---

# Table

wellness_checks

Purpose

Stores daily wellness information.

Columns

| Column       | Type                    |
| ------------ | ----------------------- |
| id           | SERIAL PRIMARY KEY      |
| patient_id   | INTEGER FK patients(id) |
| mood         | VARCHAR(50)             |
| sleep_hours  | INTEGER                 |
| energy_level | VARCHAR(30)             |
| pain_level   | INTEGER                 |
| notes        | TEXT                    |
| created_at   | TIMESTAMP               |

Relationship

One Patient

↓

Many Wellness Records

---

# Table

medical_reports

Purpose

Stores uploaded reports.

Columns

| Column      | Type                    |
| ----------- | ----------------------- |
| id          | SERIAL PRIMARY KEY      |
| patient_id  | INTEGER FK patients(id) |
| report_name | VARCHAR(255)            |
| report_url  | TEXT                    |
| ai_summary  | TEXT                    |
| uploaded_at | TIMESTAMP               |

Relationship

One Patient

↓

Many Reports

---

# Table

notifications

Purpose

Stores reminders and alerts.

Columns

| Column      | Type                    |
| ----------- | ----------------------- |
| id          | SERIAL PRIMARY KEY      |
| patient_id  | INTEGER FK patients(id) |
| title       | VARCHAR(255)            |
| description | TEXT                    |
| type        | VARCHAR(30)             |
| is_read     | BOOLEAN                 |
| created_at  | TIMESTAMP               |

Notification Types

```

medication

wellness

report

emergency

system

```

---

# Table

sos_events

Purpose

Stores emergency activations.

Columns

| Column     | Type                    |
| ---------- | ----------------------- |
| id         | SERIAL PRIMARY KEY      |
| patient_id | INTEGER FK patients(id) |
| latitude   | DECIMAL                 |
| longitude  | DECIMAL                 |
| status     | VARCHAR(30)             |
| created_at | TIMESTAMP               |

Status

```

triggered

resolved

cancelled

```

---

# Indexes

Create indexes on

email

patient_id

caregiver_id

medication_id

created_at

report_name

---

# Constraints

Email

Unique

Role

Limited values

Pain Level

0–10

Sleep Hours

0–24

Reminder Time

Valid Time

---

# Cascade Rules

Deleting Patient

↓

Delete

- Medications
- Wellness Checks
- Reports
- Notifications
- SOS Events

Deleting Caregiver

↓

Remove Link

Do not delete patient.

---

# Future Tables

doctor_profiles

appointments

health_devices

heart_rate_logs

blood_pressure_logs

medicine_inventory

activity_logs

---

# Security Rules

Passwords

Never stored in plain text.

Medical reports

Store URL only.

Authentication tokens

Never stored.

Personally identifiable information

Encrypted where applicable.

---

# Backup Strategy

Automatic Neon backups.

Database migrations managed using Alembic.

---

# Definition of Done

✓ Schema finalized

✓ Relationships defined

✓ Constraints documented

✓ Naming conventions frozen

✓ Backend implementation follows this schema

---

End of Document
