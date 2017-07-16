import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService, SacGwhNotification } from './notification.service';

/** component to display notifications to the user */
@Component({
  selector: 'app-sac-gwh-notification',
  templateUrl: 'notification.component.html',
  styleUrls: [ 'notification.component.css' ],
  encapsulation: ViewEncapsulation.None
})

export class NotificationComponent implements OnInit {

  /** The displayed notifications */
  notifications: SacGwhNotification[];

  /**
   * Constructor.
   * @param notificationService injected NotificationService
   */
  constructor(private notificationService: NotificationService) {
  }

  /** Gets all notifications on initialisation */
  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }

  /**
   * Dismisses the notification with a given index.
   * @param i
   */
  dismissNotification(i: number) {
    this.notificationService.dismissNotification(i);
  }
}
