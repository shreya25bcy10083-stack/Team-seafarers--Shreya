export const ROUTES = {
  AUTH: {
    LOGIN: 'Auth_Login',
    REGISTER: 'Auth_Register',
    ROLE_SELECTION: 'Auth_RoleSelection',
  },
  PATIENT: {
    MAIN: 'Patient_MainTab',
    HOME: 'Patient_Home',
    MEDICATION: 'Patient_Medication',
    WELLNESS: 'Patient_Wellness',
    CHAT: 'Patient_Chat',
    REPORTS: 'Patient_Reports',
    NOTIFICATIONS: 'Patient_Notifications',
    PROFILE: 'Patient_Profile',
    SOS: 'Patient_SOS',
  },
  CAREGIVER: {
    MAIN: 'Caregiver_MainTab',
    DASHBOARD: 'Caregiver_Dashboard',
    PATIENT_DETAILS: 'Caregiver_PatientDetails',
    REPORTS: 'Caregiver_Reports',
    ALERTS: 'Caregiver_Alerts',
    SETTINGS: 'Caregiver_Settings',
  },
} as const;
