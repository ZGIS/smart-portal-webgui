import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../account';
import { NotificationService } from '../notifications';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private accountService: AccountService,
              private notificationService: NotificationService) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.getProfile().map(userProfile => {
      if (userProfile) {
        return true;
      } else {
        return false;
      }
    }).catch(() => {
      this.router.navigate(['/login']);
      this.notificationService.addNotification({
        type: 'warning',
        message: 'You are not logged in. Please sign up or sign in.'
      });
      return Observable.of(false);

    });

  }
}

