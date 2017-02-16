import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NotificationService, SacGwhNotification } from './notification.service';

@Component({
  selector: 'app-sac-gwh-notification',
  templateUrl: 'notification.component.html',
  styleUrls: ['notification.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class NotificationComponent implements OnInit {
  notifications: SacGwhNotification[];

  constructor(private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.notifications = this.notificationService.getNotifications();
  }

  dismissNotification(i: number) {
    this.notificationService.dismissNotification(i);
  }
}
