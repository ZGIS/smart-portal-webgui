import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';

/**
 * Login Dialog component
 */
@Component({
  selector: 'app-sac-gwh-login',
  templateUrl: 'login.component.html'
})

/**
 * Login Dialog component
 */
export class LoginComponent {

  model: any = {};
  loading = false;
  // error = '';

  /**
   *
   * @param accountService
   * @param router
   * @param notificationService
   */
  constructor(private accountService: AccountService,
              private router: Router, private notificationService: NotificationService) {
  };

  /**
   *
   */
  login() {
    this.loading = true;
    this.accountService.login(this.model.email, this.model.password)
      .subscribe(
        result => {
          // if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          // } else {
          //   this.notificationService.addNotification({
          //     type: 'info',
          //     message: 'User email or password is incorrect.'
          //   });
          //   this.loading = false;
          // }
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
          // this.error = <any>error;
          // this.notificationService.addNotification({
          //   type: 'warning',
          //   message: 'Uncaught Login Error.'
          // });
        });
  }

  /**
   *
   * @param authCode
   */
  getOAuthResponse(authCode: string) {
    this.loading = true;
    if (authCode) {
      // console.log('getOAuthResponse login component');
      // console.log(authCode);
      this.accountService.gconnectHandle('LOGIN', authCode).subscribe(
        result => {
          // if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          // } else {
          //   // login failed
          //   this.error = 'Google Login failed.';
          //   this.notificationService.addNotification({
          //     type: 'warning',
          //     message: 'Google Login failed.'
          //   });
          //   this.loading = false;
          // }
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);

          // this.error = <any>error;
          // this.notificationService.addNotification({
          //   type: 'warning',
          //   message: 'Google Login failed.'
          // });
        });
    } else {
      console.log('error gconnect signin');
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_LOGIN_STUFF,
        type: 'danger',
        message: 'Login Error. No AuthCode provided.'
      });
    }
  };
}
