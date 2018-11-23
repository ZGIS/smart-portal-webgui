import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../account';
import { NotificationService } from '../notifications';


@Injectable()
export class DisclaimerGuard implements CanActivate {

  constructor( private router: Router, private accountService: AccountService,
               private notificationService: NotificationService ) {
  }

  canActivate(): Observable<boolean> {
    return this.accountService.hasGdprCookieAccepted().map(cookieExists => {
      console.log(`cookie is accepted: ${cookieExists}`);
      if (cookieExists) {
        return true;
      } else {
        this.router.navigate(['/disclaimer']);
      }
    }).catch(() => {
      this.notificationService.addNotification({
        type: 'warning',
        message: 'You must have cookies enabled and accept the disclaimer in order to use the site!.'
      });
      this.router.navigate(['/disclaimer']);
      return Observable.of(false);
    });

  }
}

