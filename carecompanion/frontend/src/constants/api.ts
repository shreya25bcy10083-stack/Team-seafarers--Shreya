export const API_CONFIG = {
  BASE_URL: 'https://api.carecompanion.health/api/v1', // Standard base URL as per API rules
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      ME: '/auth/me',
      LOGOUT: '/auth/logout',
    },
    PATIENT: {
      PROFILE: '/patient/profile',
      CAREGIVER_LINK: '/patient/caregiver',
    },
    MEDICATION: {
      LIST: '/medications',
      CREATE: '/medications',
      UPDATE: (id: string) => `/medications/${id}`,
      DELETE: (id: string) => `/medications/${id}`,
      LOG: (id: string) => `/medications/${id}/log`,
    },
    WELLNESS: {
      CHECKIN: '/wellness/checkin',
      LOGS: '/wellness/logs',
    },
    REPORT: {
      LIST: '/reports',
      UPLOAD: '/reports/upload',
      GET_BY_ID: (id: string) => `/reports/${id}`,
      SUMMARY: (id: string) => `/reports/${id}/summary`,
    },
    NOTIFICATION: {
      LIST: '/notifications',
      READ: (id: string) => `/notifications/${id}/read`,
    },
    AI: {
      CHAT: '/ai/chat',
      EXPLAIN_REPORT: '/ai/explain-report',
      WELLNESS_GUIDANCE: '/ai/wellness-guidance',
    },
    SOS: {
      TRIGGER: '/sos/trigger',
      CANCEL: '/sos/cancel',
      STATUS: '/sos/status',
    },
    CAREGIVER: {
      DASHBOARD: '/caregiver/dashboard',
      PATIENTS: '/caregiver/patients',
      ALERTS: '/caregiver/alerts',
    },
  },
} as const;
