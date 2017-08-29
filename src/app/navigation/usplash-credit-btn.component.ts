import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService, ProfileJs } from '../account';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'usplash-img-credit-btn',
  templateUrl: 'usplash-credit-btn.component.html',
  styleUrls: ['usplash-credit-btn.component.less']
})

/**
 * Credit Button as suggested by Usplash.com.
 * TODO make own module?
 */
export class UsplashImageCreditComponent {

  @Input() public userProfile: String;
  @Input() public userDisplayName: String;
}
