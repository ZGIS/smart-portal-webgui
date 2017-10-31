import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from './account.service';
import { ProfileJs } from './account.types';
import { AdminService } from '../admin/admin.service';
import { NotificationService } from '../notifications/notification.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-sac-gwh-account',
  templateUrl: 'account.component.html'
})

/**
 * Component to view / change account information
 */
export class AccountComponent implements OnInit {

  /**
   * Account information
   * @type {ProfileJs}
   */
  @Input() userProfile: ProfileJs = this.accountService.guestProfile;

  /**
   * Constructor
   * @param accountService injected AccountService
   * @param adminService injected AdminService
   */
  constructor( private accountService: AccountService,
               private adminService: AdminService ) {
  }

  /**
   * OnInit - queries current profile from backend
   */
  ngOnInit() {
    // get users from secure api end point
    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
        },
        error => {
          console.log(<any>error);
          this.userProfile = this.accountService.guestProfile;
        });
  }

  setAdminLink(): Observable<boolean> {
    return this.adminService.amiAdmin().map(resp => {
      let currentUserProfile: ProfileJs = JSON.parse(localStorage.getItem('currentUserProfile'));
      if (currentUserProfile.email === <any>resp.email) {
        return true;
      }
      // here maybe more default admins for now :-)
      return false;

    }).catch(() => {
      return Observable.of(false);
    });
  }
}
