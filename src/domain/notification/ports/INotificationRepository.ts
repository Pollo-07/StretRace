import UserNotification from "../models/modelNotification";

export default interface notificationRepository {
  createNotification(notification: UserNotification): Promise<UserNotification>;
  getNotification(id: string): Promise<UserNotification[]>;
  deleteNotification(id: string): Promise<void>;
  AllNotificationsAsRead(userId: string): Promise<void>;
}

