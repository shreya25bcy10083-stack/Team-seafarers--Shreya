/**
 * CareCompanion API Endpoints & Configuration.
 * Aligned with backend FastAPI route definitions and API_SCHEMA.md.
 */

// Platform import kept for potential future use

const LOCAL_IP = '172.25.163.241';

// Production backend deployed on Render
const RENDER_URL = 'https://carecompanion-backend-96fd.onrender.com/api/v1';

export const API_CONFIG = {
  // APK / production uses Render; local dev uses localhost / LAN IP
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL ||
    RENDER_URL,
  TIMEOUT: 60000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
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
      MEDICATIONS: '/caregiver/medications',
      WELLNESS: '/caregiver/wellness',
      ACTIVITY: '/caregiver/activity',
      ALERTS: '/notifications',
    },
    MEDICATION: {
      LIST: '/medications',
      CREATE: '/medications',
      ADD: '/medications',
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
      DETAIL: (id: string | number) => `/reports/${id}`,
    },
    AI: {
      CHAT: '/ai/chat',
      REPORT_SUMMARY: '/ai/report-summary',
      WELLNESS_FEEDBACK: '/ai/chat',
    },
    SOS: {
      TRIGGER: '/sos',
      CANCEL: '/sos/cancel',
    },
    NOTIFICATION: {
      LIST: '/notifications',
      READ: (id: string | number) => `/notifications/${id}`,
      MARK_READ: (id: string | number) => `/notifications/${id}`,
    },
  },
};
