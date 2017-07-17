import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';
import { GAuthCredentials, LoginCredentials } from './account.types';

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

  loginCredentials: LoginCredentials = {};
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
  }

  /**
   *
   */
  login() {
    this.loading = true;
    this.accountService.login(this.loginCredentials)
      .subscribe(
        result => {
          // if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
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
      const gAuthCredential: GAuthCredentials = { authcode: authCode, accesstype: 'LOGIN' };
      this.accountService.gconnectHandle(gAuthCredential).subscribe(
        result => {
          // if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
        });
    } else {
      console.log('error gconnect signin');
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_LOGIN_STUFF,
        type: 'danger',
        message: 'Login Error. No AuthCode provided.'
      });
    }
  }
}
