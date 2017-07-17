import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../account';
import { NotificationService } from '../notifications';


@Injectable()
export class AdminGuard implements CanActivate {

  constructor(private router: Router, private accountService: AccountService,
              private notificationService: NotificationService) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.getProfile().map(userProfile => {
      if (userProfile) {
        if (userProfile.email === 'allixender@gmail.com') {
          return true;
        }
        // here maybe more default admins for now :-)
        return false;

      } else {
        return false;
      }
    }).catch(() => {
      this.router.navigate(['/']);
      this.notificationService.addNotification({
        type: 'warning',
        message: 'You are not an admin, sorry.'
      });
      return Observable.of(false);
    });
  }
}

