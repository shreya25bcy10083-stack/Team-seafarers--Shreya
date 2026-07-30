/**
 * CareCompanion API Endpoints & Configuration.
 * Aligned with backend FastAPI route definitions.
 */

export const API_CONFIG = {
  // Default development backend server URL (localhost for web/iOS, 10.0.2.2 for Android emulator)
  BASE_URL: 'http://localhost:8000/api/v1',
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
    },
    PATIENT: {
      PROFILE: '/patient/profile',
      INVITE: '/patient/invite',
    },
    CAREGIVER: {
      JOIN: '/caregiver/join',
      DASHBOARD: '/caregiver/dashboard',
      PATIENT_DETAIL: (id: string | number) => `/caregiver/patient/${id}`,
    },
    MEDICATION: {
      LIST: '/medications',
      CREATE: '/medications',
      UPDATE: (id: string | number) => `/medications/${id}`,
      DELETE: (id: string | number) => `/medications/${id}`,
      LOG: '/medications/log',
    },
    WELLNESS: {
      CHECKIN: '/wellness/checkin',
      HISTORY: '/wellness/history',
    },
    REPORT: {
      LIST: '/reports',
      UPLOAD: '/reports/upload',
      GET_BY_ID: (id: string | number) => `/reports/${id}`,
    },
    AI: {
      CHAT: '/ai/chat',
      REPORT_SUMMARY: '/ai/report-summary',
    },
    NOTIFICATION: {
      LIST: '/notifications',
      READ: (id: string | number) => `/notifications/${id}`,
    },
    SOS: {
      TRIGGER: '/sos',
    },
  },
} as const;
