import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AccountService } from '../account';


@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private accountService: AccountService) {
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
      return Observable.of(false);

    });

    // not logged in so redirect to login page
    // this.router.navigate(['/login']);
    // return false;
  }
}

