import { Injectable } from '@angular/core';

export class SacGwhNotification {
  type: string;
  message: string;
}

@Injectable()
export class NotificationService {

  notifications: SacGwhNotification[] = [];

  addNotification(notification: SacGwhNotification) {
    this.notifications.push(notification);
  }

  dismissNotification(i: number) {
    if (i > 0 && i < this.notifications.length) {
      this.notifications.splice(i, 1);
    }
  }

  getNotifications(): SacGwhNotification[] {
    return this.notifications;
  }
}
