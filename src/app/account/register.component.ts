import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from './account.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';
import { GAuthCredentials, RegisterJs } from './account.types';

/**
 *
 */
@Component({
  selector: 'app-sac-gwh-register',
  templateUrl: 'register.component.html'
})

/**
 *
 */
export class RegisterComponent {

  model: any = {};
  loading = false;
  recaptchaValid = false;
  error = '';
  passwordsAreSync = true;

  /**
   *
   * @param accountService
   * @param router
   * @param http
   * @param notificationService
   */
  constructor(private accountService: AccountService, private router: Router,
              private http: Http, private notificationService: NotificationService) {
    window[<any>'recaptchaCallback'] = <any>this.recaptchaCallback.bind(this);
  }

  validatePasswordSync( event: any ) {
    this.passwordsAreSync = this.model.password === this.model.passwordConfirm;
  }

  onSubmit() {
    this.loading = true;
    // console.log(this.model);

    const regProfile: RegisterJs = {
      email: this.model.email,
      accountSubject: 'local:' + this.model.email,
      firstname: this.model.firstname,
      lastname: this.model.lastname,
      password: this.model.password
    };

    // console.log('submit register form clicked!');
    // console.log(regProfile);

    this.accountService.register(regProfile)
      .subscribe(
        result => {
          // TODO SR This should never be false
          if (result === true) {
            // register successful
            this.notificationService.addNotification({
              id: NotificationService.MSG_ID_LOGIN_STUFF,
              type: 'success',
              message: 'Thank you. Please check your emails and activate your account by' +
              ' following the provided link.'
            });
            this.loading = false;
            this.router.navigateByUrl('/login');
          } else {
            // login failed
            this.notificationService.addNotification({
              id: NotificationService.MSG_ID_LOGIN_STUFF,
              type: 'warning',
              message: 'Registration failed.'
            });
            this.error = 'Registration failed.';
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * validate recaptcha via backend
   *
   * @param captchaChallenge
   */
  recaptchaCallback(captchaChallenge: string) {
    this.recaptchaValid = true;
    this.accountService.testReCaptcha(captchaChallenge).subscribe(
      result => {
        // console.log(result);
        // TODO SR this should never be false
        if (result === true) {
          this.recaptchaValid = true;
        } else {
          this.recaptchaValid = false;
          console.log('error recapture not valid');
          this.notificationService.addNotification({
            id: NotificationService.MSG_ID_LOGIN_STUFF,
            type: 'warning',
            message: 'Recapture not valid.'
          });
        }
      },
      error => {
        // error on validating recapcha or capcha failed
        this.loading = false;
        this.recaptchaValid = false;
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
      // console.log('getOAuthResponse register component');
      // console.log(authCode);
      const gAuthCredential: GAuthCredentials = { authcode: authCode, accesstype: 'REGISTER' };
      this.accountService.gconnectHandle(gAuthCredential).subscribe(
        result => {
          if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/dashboard');
          } else {
            // login failed
            this.error = 'Google Login failed.';
            this.notificationService.addNotification({
              id: NotificationService.MSG_ID_LOGIN_STUFF,
              type: 'warning',
              message: 'Google Login failed.'
            });
            this.loading = false;
          }
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
        message: 'Login/Registration Error. No AuthCode provided.'
      });
    }
  }
}
