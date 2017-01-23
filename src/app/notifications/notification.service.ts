import { Injectable } from '@angular/core';

/**
 * Alert type. Provides one of four bootstrap supported contextual classes:
 * `success` -> green, `info` -> blue, `warning` -> orange and `danger` -> red
 */
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
