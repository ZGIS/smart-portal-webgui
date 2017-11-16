import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { NotificationService } from '../notifications';
import { ProfileJs } from '../account/account.types';
import { AdminService } from '../admin';


@Injectable()
export class AdminGuard implements CanActivate {

  constructor( private router: Router,
               private adminService: AdminService,
               private notificationService: NotificationService ) {
  }

  canActivate(): Observable<boolean> {
    return this.adminService.amiAdmin().map(resp => {
      let currentUserProfile: ProfileJs = JSON.parse(localStorage.getItem('currentUserProfile'));
      if (currentUserProfile.email === <any>resp.email) {
        return true;
      }
      // here maybe more default admins for now :-)
      return false;

    }).catch(() => {
      this.router.navigate([ '/' ]);
      this.notificationService.addNotification({
        type: 'warning',
        message: 'You are not an admin, sorry.'
      });
      return Observable.of(false);
    });
  }
}
