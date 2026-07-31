# CareCompanion — Code Freeze & Release Candidate Policy

Version: 1.0  
Status: Release Candidate (RC) Freeze Active  

---

## 🔒 Policy Overview

CareCompanion has entered the final **Release Candidate (RC) Code Freeze** stage.

### 🚫 Prohibited Actions
1. **No New Features**: Do not add new user workflows, UI buttons, or business logic.
2. **No Architectural Changes**: Maintain existing FastAPI service architecture, database schemas, and React Native component hierarchy.
3. **No Schema Mutations**: Database tables and API response structures defined in `API_SCHEMA.md` and `DATABASE_SCHEMA.md` are locked.
4. **No Direct Production Code Refactoring**: Code refactoring is restricted to critical bug fixes and stability enhancements.

---

## ✅ Allowed Actions

- Fixing critical release-blocking compilation or runtime bugs.
- Updating deployment environment variables or live server URLs.
- Verification and end-to-end testing of existing user flows.
- Documentation maintenance and cleanups for submission.

---

## 📋 Release Candidate Verification Standards

Every build must satisfy the following checklist before release:

- [x] Backend live on production endpoint (`https://carecompanion-backend-96fd.onrender.com`)
- [x] Zero TypeScript compilation errors (`npx tsc --noEmit`)
- [x] All 17 Expo Doctor checks passing (`npx expo-doctor`)
- [x] Successful authentication (Register → Login → JWT → Persistent Session)
- [x] Verified Patient-Caregiver linking via 8-character invite code
- [x] Verified medical report analysis with Cloudinary & Gemini AI
- [x] Verified real-time medication alarm chime and SOS emergency siren
- [x] Successful standalone Android APK generation via EAS
