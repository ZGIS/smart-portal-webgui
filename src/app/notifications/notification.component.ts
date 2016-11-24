import { Component, OnInit } from '@angular/core';
import { NotificationService, SacGwhNotification } from './notification.service';

@Component({
  selector: 'sac-gwh-notification',
  templateUrl: './notification.component.html'
//  styleUrls: ['./notifications.component.css']
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
