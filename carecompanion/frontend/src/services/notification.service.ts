import { ApiClient, mockDelay } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { AppNotification } from '../types/Notification';

const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_01',
    userId: 'usr_101',
    title: 'Medication Reminder',
    message: 'It is time for your afternoon Calcium + Vitamin D (600mg).',
    type: 'REMINDER',
    timestamp: '10 mins ago',
    isRead: false,
  },
  {
    id: 'notif_02',
    userId: 'usr_101',
    title: 'Caregiver Update',
    message: 'Robert Vance checked your morning medication status.',
    type: 'INFO',
    timestamp: '2 hours ago',
    isRead: true,
  },
];

export const NotificationService = {
  async getNotifications(): Promise<ApiResponse<AppNotification[]>> {
    const response = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.NOTIFICATION.LIST);

    if (response.success && Array.isArray(response.data)) {
      const items: AppNotification[] = response.data.map((n) => ({
        id: String(n.id),
        userId: 'usr_101',
        title: n.title,
        message: n.description || n.title,
        type: (n.type || 'INFO').toUpperCase() as any,
        timestamp: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        isRead: Boolean(n.is_read),
      }));
      return {
        success: true,
        message: 'Notifications retrieved from backend',
        data: items,
      };
    }

    // Fallback for mock mode
    await mockDelay(300);
    return {
      success: true,
      message: 'Notifications retrieved (Mock Mode)',
      data: MOCK_NOTIFICATIONS,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<AppNotification>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.NOTIFICATION.READ(id), {
      method: 'PUT',
    });

    if (response.success) {
      const item = MOCK_NOTIFICATIONS.find((n) => n.id === id) || MOCK_NOTIFICATIONS[0];
      return {
        success: true,
        message: 'Notification marked as read',
        data: { ...item, isRead: true },
      };
    }

    // Fallback for mock mode
    await mockDelay(200);
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id) || MOCK_NOTIFICATIONS[0];
    item.isRead = true;
    return {
      success: true,
      message: 'Notification marked as read (Mock Mode)',
      data: item,
    };
  },
};
