export type NotificationType = 'MEDICATION' | 'REMINDER' | 'EMERGENCY' | 'INFO';

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}
