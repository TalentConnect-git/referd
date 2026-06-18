export interface Notification {
  _id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

 
export interface NotificationMeta {
  topic?: string;
  subtopic?: string;
  body?: Record<string, string>;
}

export interface Notification {
  _id: string;
  recipientId?: string;
  senderId?: string;

  type: string;
  message: string;

  read: boolean;

  createdAt: string;
  updatedAt?: string;

  meta?: NotificationMeta;
}

export interface NotificationsCardProps {
  notification: Notification;
  onClick?: () => void;
}
