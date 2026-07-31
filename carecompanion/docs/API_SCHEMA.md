# API_SCHEMA.md

# CareCompanion API Specification

Version: 1.0

Status: Approved

Base URL

/api/v1

---

# API Standards

## Content Type

```
application/json
```

---

## Success Response

```json
{
  "success": true,
  "message": "",
  "data": {}
}
```

---

## Error Response

```json
{
  "success": false,
  "message": "",
  "errors": {}
}
```

---

## HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | Success               |
| 201  | Created               |
| 400  | Bad Request           |
| 401  | Unauthorized          |
| 403  | Forbidden             |
| 404  | Not Found             |
| 409  | Conflict              |
| 422  | Validation Error      |
| 500  | Internal Server Error |

---

# Authentication

---

## Register

POST

```
/auth/register
```

### Request

```json
{
  "name": "John Doe",
  "email": "john@email.com",
  "password": "********",
  "role": "patient"
}
```

Role

```
patient

caregiver
```

---

### Response

```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user_id": 1
  }
}
```

---

## Login

POST

```
/auth/login
```

### Request

```json
{
  "email": "john@email.com",
  "password": "********"
}
```

---

### Response

```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "JWT_TOKEN",
    "role": "patient"
  }
}
```

---

## Logout

POST

```
/auth/logout
```

No Request Body

---

# Patient

---

## Get Profile

GET

```
/patient/profile
```

### Response

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "age": 68,
    "blood_group": "O+"
  }
}
```

---

## Update Profile

PUT

```
/patient/profile
```

---

# Caregiver Linking

---

## Generate Invite Code

POST

```
/patient/invite
```

---

### Response

```json
{
  "success": true,
  "data": {
    "invite_code": "ABCD1234"
  }
}
```

---

## Join Patient

POST

```
/caregiver/join
```

### Request

```json
{
  "invite_code": "ABCD1234"
}
```

---

# Medication

---

## Get Medications

GET

```
/medications
```

---

### Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Paracetamol",
      "dosage": "500mg",
      "time": "09:00",
      "status": "pending"
    }
  ]
}
```

---

## Add Medication

POST

```
/medications
```

---

### Request

```json
{
  "name": "Paracetamol",
  "dosage": "500mg",
  "frequency": "Daily",
  "time": "09:00"
}
```

---

## Update Medication

PUT

```
/medications/{id}
```

---

## Delete Medication

DELETE

```
/medications/{id}
```

---

## Log Medication

POST

```
/medications/log
```

### Request

```json
{
  "medication_id": 1,
  "status": "taken"
}
```

Status

```
taken

missed

snoozed
```

---

# Wellness

---

## Daily Check-In

POST

```
/wellness/checkin
```

### Request

```json
{
  "mood": "Happy",
  "sleep_hours": 8,
  "energy": "High",
  "pain_level": 2,
  "notes": "Feeling good."
}
```

---

## Wellness History

GET

```
/wellness/history
```

---

# AI Companion

---

## Chat

POST

```
/ai/chat
```

### Request

```json
{
  "message": "Can I eat after taking my medicine?"
}
```

---

### Response

```json
{
  "success": true,
  "data": {
    "reply": "Yes, unless your doctor advised otherwise..."
  }
}
```

---

## Report Analysis

POST

```
/ai/report-summary
```

Request

Multipart Form Data

```
file
```

---

### Response

```json
{
  "success": true,
  "data": {
    "summary": "Your blood sugar is slightly elevated...",
    "tips": ["...", "...", "..."]
  }
}
```

---

# Reports

---

## Upload Report

POST

```
/reports/upload
```

Multipart Form Data

```
file
```

---

## Get Reports

GET

```
/reports
```

---

## Get Report

GET

```
/reports/{id}
```

---

# Caregiver

---

## Dashboard

GET

```
/caregiver/dashboard
```

---

### Response

```json
{
  "success": true,
  "data": {
    "patient_name": "John Doe",
    "medication_adherence": 92,
    "today_status": "Healthy"
  }
}
```

---

## Patient Details

GET

```
/caregiver/patient/{id}
```

---

# SOS

---

## Trigger SOS

POST

```
/sos
```

### Request

```json
{
  "latitude": 28.4567,
  "longitude": 77.1234
}
```

---

### Response

```json
{
  "success": true,
  "message": "Emergency alert sent."
}
```

---

# Notifications

---

## Get Notifications

GET

```
/notifications
```

---

## Mark As Read

PUT

```
/notifications/{id}
```

---

# Health

---

## Server Health

GET

```
/health
```

### Response

```json
{
  "status": "online"
}
```

---

# Authentication Rules

Every endpoint except

```
/auth/register

/auth/login

/health
```

requires authentication.

---

# API Naming Rules

Use

```
Plural resources

snake_case JSON fields

Lowercase URLs

RESTful endpoints
```

Examples

Correct

```
GET /medications

POST /reports/upload

GET /patient/profile
```

Wrong

```
GET /GetMedication

POST /UploadReport

GET /patientProfile
```

---

# Response Rules

Every response must contain

```
success

message

data
```

Never return raw database objects.

Never expose internal errors.

---

# Versioning

All APIs must begin with

```
/api/v1
```

Future versions

```
/api/v2
```

---

# Definition of Done

✓ Every endpoint documented

✓ Every request documented

✓ Every response documented

✓ Error format standardized

✓ Naming convention frozen

✓ Frontend and Backend contracts finalized

---

End of Document
