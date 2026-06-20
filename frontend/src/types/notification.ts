

export interface NotificationsCardProps {
  notification: Notification;
  onClick?: () => void;
}


export interface NotificationMeta {
  topic?: string;
  subtopic?: string;
  linkedApplicationId?: string;
  approvalStatus?: string;
  body?: {
    requestId?: string;
    userId?: string;
    applicationId?: string;
    jobId?: string;
  };

}

export interface NotificationSender {
  _id: string;
  name: string | null
  profileImage: string | null;

}
export interface Notification {
  _id: string;
  recipientId: string;
  senderId: NotificationSender | null;

  type: string;

  message: string;
  referenceId?: string;
  jobId?: string;
  jobType?: string;

  read: boolean;
  createdAt: string;
  updatedAt: string;

  meta?: NotificationMeta;
}