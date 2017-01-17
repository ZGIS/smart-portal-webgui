import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';

/**
 *
 */
@Component({
  selector: 'sac-gwh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/**
 *
 */
export class LoginComponent {

  model: any = {};
  loading = false;
  error = '';

  /**
   *
   * @param accountService
   * @param router
   * @param _notificationService
   */
  constructor(private accountService: AccountService,
              private router: Router, private _notificationService: NotificationService) {
  };

  /**
   *
   */
  login() {
    this.loading = true;
    this.accountService.login(this.model.username, this.model.password)
      .subscribe(
        result => {
          if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          } else {
            // login failed
            this.error = 'Username or password is incorrect';
            this._notificationService.addNotification({
              type: 'ERR',
              message: 'Username or password is incorrect.'
            });
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
          this._notificationService.addNotification({
            type: 'ERR',
            message: 'Uncaught Login Error.'
          });
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
          if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          } else {
            // login failed
            this.error = 'Google Login failed.';
            this._notificationService.addNotification({
              type: 'ERR',
              message: 'Google Login failed.'
            });
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
          this._notificationService.addNotification({
            type: 'ERR',
            message: 'Uncaught gConnect Login Error.'
          });
        });
    } else {
      console.log('error gconnect signin');
      this._notificationService.addNotification({
        type: 'ERR',
        message: 'Uncaught gConnect Login Error. No authCode provided.'
      });
    }
  };
}
