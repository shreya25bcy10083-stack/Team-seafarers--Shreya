/**
 * CareCompanion API Endpoints & Configuration.
 * Aligned with backend FastAPI route definitions and API_SCHEMA.md.
 */

export const API_CONFIG = {
  // Default development backend server URL
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/patient/profile',
      LOGOUT: '/auth/logout',
    },
    PATIENT: {
      PROFILE: '/patient/profile',
      INVITE: '/patient/invite',
      CAREGIVER_LINK: '/patient/invite',
    },
    CAREGIVER: {
      JOIN: '/caregiver/join',
      DASHBOARD: '/caregiver/dashboard',
      PATIENTS: '/caregiver/dashboard',
      PATIENT_DETAIL: (id: string | number) => `/caregiver/patient/${id}`,
      ALERTS: '/notifications',
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
      LOGS: '/wellness/history',
    },
    REPORT: {
      LIST: '/reports',
      UPLOAD: '/reports/upload',
      GET_BY_ID: (id: string | number) => `/reports/${id}`,
      SUMMARY: (id: string | number) => `/reports/${id}`,
    },
    AI: {
      CHAT: '/ai/chat',
      REPORT_SUMMARY: '/ai/report-summary',
      EXPLAIN_REPORT: '/ai/report-summary',
      WELLNESS_GUIDANCE: '/ai/chat',
    },
    NOTIFICATION: {
      LIST: '/notifications',
      READ: (id: string | number) => `/notifications/${id}`,
    },
    SOS: {
      TRIGGER: '/sos',
      CANCEL: '/sos',
      STATUS: '/sos',
    },
  },
} as const;
