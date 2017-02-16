import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { IErrorResult } from '../search/result';

/**
 * Alert type. Provides one of four bootstrap supported contextual classes:
 * `success` -> green, `info` -> blue, `warning` -> orange and `danger` -> red
 */
export interface SacGwhNotification {
  type: string;
  message: string;
  // details: string;
}

@Injectable()
export class NotificationService {

  notifications: any[] = [];

  addErrorResultNotification(errorResponse: IErrorResult) {
    this.notifications.push({type: 'danger', message: errorResponse.message, details: errorResponse.details});
  }

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
