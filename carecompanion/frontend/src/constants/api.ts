/**
 * CareCompanion API Endpoints & Configuration.
 * Aligned with backend FastAPI route definitions and API_SCHEMA.md.
 */

import { Platform } from 'react-native';

const LOCAL_IP = '172.25.163.241';

export const API_CONFIG = {
  // Mobile devices connect using laptop local IP, Web uses localhost
  BASE_URL:
    process.env.EXPO_PUBLIC_API_URL ||
    (Platform.OS === 'web' ? 'http://localhost:8000/api/v1' : `http://${LOCAL_IP}:8000/api/v1`),
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
      MARK_READ: (id: string | number) => `/notifications/${id}`,
    },
  },
};
