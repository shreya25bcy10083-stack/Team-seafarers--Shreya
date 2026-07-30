---
trigger: always_on
---

# UPDATED_RULES.md

These rules override all previous implementation rules.

---

## Rule 1

Do NOT implement new features until every critical issue has been fixed.

---

## Rule 2

Never fake functionality.

If a feature exists in the UI, it must work completely.

---

## Rule 3

Authentication is mandatory.

No screen except Splash and Login may be accessed without authentication.

---

## Rule 4

Every backend endpoint must perform validation.

Never trust frontend validation.

---

## Rule 5

The AI must generate dynamic responses.

Hardcoded responses are prohibited.

Repeated identical responses indicate implementation failure.

---

## Rule 6

Medical report upload is considered incomplete until

Upload

↓

Cloudinary

↓

Gemini

↓

Frontend Display

works successfully.

---

## Rule 7

The Caregiver Dashboard is mandatory.

The project is incomplete without it.

---

## Rule 8

Patient and Caregiver must be linked before patient information is accessible.

---

## Rule 9

Every feature must be manually tested before being marked complete.

---

## Rule 10

Never claim a feature is complete without verifying it end-to-end.

Example

Bad

✓ Upload button exists.

Good

✓ Upload

✓ Cloudinary

✓ Database

✓ Gemini

✓ Frontend Display

All verified.

---

## Rule 11

When fixing bugs,

determine the root cause first.

Do not apply superficial fixes.

---

## Rule 12

Always verify

Frontend

↓

Backend

↓

Database

↓

AI

↓

Frontend

before closing an issue.

---

## Rule 13

The MVP is considered complete only when every feature works from the user's perspective.

A visible button is not a completed feature.

A working workflow is a completed feature.

---

End of Document
