<<<<<<< HEAD
/**
 * CareCompanion API Endpoints & Configuration.
 * Aligned with backend FastAPI route definitions.
 */

export const API_CONFIG = {
  // Default development backend server URL (localhost for web/iOS, 10.0.2.2 for Android emulator)
  BASE_URL: 'http://localhost:8000/api/v1',
=======
export const API_CONFIG = {
  BASE_URL: 'https://api.carecompanion.health/api/v1', // Standard base URL as per API rules
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
  TIMEOUT: 15000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
<<<<<<< HEAD
=======
      ME: '/auth/me',
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
      LOGOUT: '/auth/logout',
    },
    PATIENT: {
      PROFILE: '/patient/profile',
<<<<<<< HEAD
      INVITE: '/patient/invite',
    },
    CAREGIVER: {
      JOIN: '/caregiver/join',
      DASHBOARD: '/caregiver/dashboard',
      PATIENT_DETAIL: (id: string | number) => `/caregiver/patient/${id}`,
=======
      CAREGIVER_LINK: '/patient/caregiver',
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
    },
    MEDICATION: {
      LIST: '/medications',
      CREATE: '/medications',
<<<<<<< HEAD
      UPDATE: (id: string | number) => `/medications/${id}`,
      DELETE: (id: string | number) => `/medications/${id}`,
      LOG: '/medications/log',
    },
    WELLNESS: {
      CHECKIN: '/wellness/checkin',
      HISTORY: '/wellness/history',
=======
      UPDATE: (id: string) => `/medications/${id}`,
      DELETE: (id: string) => `/medications/${id}`,
      LOG: (id: string) => `/medications/${id}/log`,
    },
    WELLNESS: {
      CHECKIN: '/wellness/checkin',
      LOGS: '/wellness/logs',
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
    },
    REPORT: {
      LIST: '/reports',
      UPLOAD: '/reports/upload',
<<<<<<< HEAD
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
=======
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
>>>>>>> c1497f01e195e6bb99fda798bdf1d6e23bf18166
    },
  },
} as const;
