import { Injectable } from '@angular/core';
import { IErrorResult } from '../search/result';

/**
 * Interface to describe a notification that can be displayed.
 */
export interface SacGwhNotification {
  /** OPTIONAL ID of the notification. Only the last notification per ID will be shown. If there is a notification
   * with a given ID already, the old one will be dismissed an be replaced with the new. */
  id?: number;

  /** type of the notification.
   *  Provides one of four bootstrap supported contextual classes:
   *  `success` -> green, `info` -> blue, `warning` -> orange and `danger` -> red
   */
  type: string;

  /** string containing the message to be displayed. The message may contain HTML */
  message: string;

  /** OPTIONAL string that contains further information. Will be displayed in <PRE> */
  details?: string;

  /** OPTIONAL milliseconds the notification will be dismissed after. If not given, a default will apply */
  dismissAfter?: number;
}

/**
 * Service to handle notifications to the user.
 */
@Injectable()
export class NotificationService {

  /** Message ID for 'copied to clipboard' message */
  public static MSG_ID_URL_COPIED_TO_CLIPBOARD = 1;

  /** Message ID for 'show more results' message */
  public static MSG_ID_SHOW_ALL_RESULTS = 2;

  /** Message ID for error messages */
  public static MSG_ID_ERROR = 3;

  /** Message that was created by login/register mask */
  public static MSG_ID_LOGIN_STUFF = 4;

  /** Message that was created by file uploader */
  public static MSG_ID_FILE_UPLOADER = 5;

  /** default dismiss time in milliseconds */
  public static DEFAULT_DISMISS = 5000;

  /** constant to indicate that the notification should not be automatically dismissed after some time */
  public static DISMISS_NEVER = -1;

  /** array storing all displayed notifications */
  notifications: SacGwhNotification[] = [];

  /** Creates an error notification out of an IErrorResult and displays it. This notification will not be closed
   * after DEFAULT_DISMISS.
   *
   * @param errorResponse error response received from a AJAX call for example.
   */
  public addErrorResultNotification( errorResponse: IErrorResult ) {
    this.addNotification({
      id: NotificationService.MSG_ID_ERROR,
      type: 'danger',
      message: errorResponse.message, details: errorResponse.details,
      dismissAfter: NotificationService.DISMISS_NEVER
    });
  }

  /** Adds a notification and displays it.
   * @param notification Notification description.
   */
  public addNotification( notification: SacGwhNotification ) {
    if (notification.id) {
      let i = this.notifications.findIndex(
        arrayNotification => arrayNotification.id === notification.id);
      if (i > -1) {
        this.dismissNotification(i);
      }
    }

    switch (notification.dismissAfter) {
      case undefined:
        notification.dismissAfter = NotificationService.DEFAULT_DISMISS;
        break;

      case NotificationService.DISMISS_NEVER:
        notification.dismissAfter = undefined;
        break;

    }

    this.notifications.push(notification);
  }

  /**
   * Dismisses the notification with the given index.
   * @param i index of the notification to dismiss
   */
  dismissNotification( i: number ) {
    // console.log(`dismissNotification(${i})`);
    if (i >= 0 && i < this.notifications.length) {
      this.notifications.splice(i, 1);
    }
  }

  /**
   * Returns all notifications that are currently displayed.
   * @returns {SacGwhNotification[]}
   */
  getNotifications(): SacGwhNotification[] {
    return this.notifications;
  }
}
