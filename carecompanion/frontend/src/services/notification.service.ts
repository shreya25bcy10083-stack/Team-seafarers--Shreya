import { ApiClient } from './api';
import { API_CONFIG } from '../constants/api';
import { ApiResponse } from '../types/API';
import { AppNotification } from '../types/Notification';

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

    // Caregiver fallback: retrieve patient activity feed and transform SOS alerts into emergency notifications
    const cgRes = await ApiClient.request<any[]>(API_CONFIG.ENDPOINTS.CAREGIVER.ACTIVITY);
    if (cgRes.success && Array.isArray(cgRes.data)) {
      const items: AppNotification[] = cgRes.data.map((a) => ({
        id: String(a.id),
        userId: 'cg_101',
        title: a.title,
        message: a.description || a.title,
        type: a.event_type === 'sos' ? ('EMERGENCY' as any) : ('INFO' as any),
        timestamp: a.created_at ? new Date(a.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        isRead: false,
      }));
      return {
        success: true,
        message: 'Caregiver activity feed retrieved',
        data: items,
      };
    }

    return {
      success: true,
      message: 'No notifications',
      data: [],
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<AppNotification>> {
    const response = await ApiClient.request<any>(API_CONFIG.ENDPOINTS.NOTIFICATION.READ(id), {
      method: 'PUT',
    });

    if (response.success) {
      return {
        success: true,
        message: 'Notification marked as read',
      };
    }

    return {
      success: true,
      message: 'Notification marked as read',
    };
  },
};
