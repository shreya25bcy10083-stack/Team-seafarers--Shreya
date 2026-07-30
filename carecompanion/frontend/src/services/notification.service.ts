import { mockDelay } from './api';
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
    await mockDelay(300);
    return {
      success: true,
      message: 'Notifications retrieved',
      data: MOCK_NOTIFICATIONS,
    };
  },

  async markAsRead(id: string): Promise<ApiResponse<AppNotification>> {
    await mockDelay(200);
    const item = MOCK_NOTIFICATIONS.find((n) => n.id === id) || MOCK_NOTIFICATIONS[0];
    item.isRead = true;
    return {
      success: true,
      message: 'Notification marked as read',
      data: item,
    };
  },
};
