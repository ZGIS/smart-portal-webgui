import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService, createProfile } from './account.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';

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
  @Output() flash = new EventEmitter();

  /**
   *
   * @param accountService
   * @param router
   * @param http
   * @param _notificationService
   */
  constructor(private accountService: AccountService, private router: Router,
              private http: Http, private _notificationService: NotificationService) {
    window[<any>'recaptchaCallback'] = <any>this.recaptchaCallback.bind(this);
  };

  /**
   *
   */
  onSubmit() {
    this.loading = true;
    console.log(this.model);

    let regProfile = createProfile({
      email: this.model.email,
      username: this.model.email,
      firstname: this.model.firstname,
      lastname: this.model.lastname,
      password: this.model.password
    });

    // console.log('submit register form clicked!');
    // console.log(regProfile);

    this.accountService.register(regProfile)
      .subscribe(
        result => {
          if (result === true) {
            // register successful
            this._notificationService.addNotification({
              type: 'INFO',
              message: 'Thank you. Please check your emails and activate your account by' +
              ' clicking on th provided link.'
            });
            this.loading = false;
            this.router.navigateByUrl('/login');
          } else {
            // login failed
            this._notificationService.addNotification({
              type: 'ERR',
              message: 'Registration failed: message / status.'
            });
            this.error = 'Registration failed: message / status.';
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
          this._notificationService.addNotification({
            type: 'ERR',
            message: 'Uncaught registration process error.'
          });
        });
  };

  /**
   * validate recaptcha via backend
   *
   * @param captchaChallenge
   */
  recaptchaCallback(captchaChallenge: string) {
    this.recaptchaValid = true;
    this.accountService.testReCaptcha(captchaChallenge).subscribe(
      result => {
        console.log(result);
        if (result === true) {
          this.recaptchaValid = true;
        } else {
          this.recaptchaValid = false;
          console.log('error recapture not valid');
          this._notificationService.addNotification({
            type: 'ERR',
            message: 'Recapture not valid.'
          });
        }
      },
      error => {
        this.loading = false;
        this.recaptchaValid = false;
        this.error = <any>error;
        this._notificationService.addNotification({
          type: 'ERR',
          message: 'Uncaught Recapture error.'
        });
      });
  };

  /**
   *
   * @param authCode
   */
  getOAuthResponse(authCode: string) {
    this.loading = true;
    if (authCode) {
      // console.log('getOAuthResponse register component');
      // console.log(authCode);
      this.accountService.gconnectHandle('REGISTER', authCode).subscribe(
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
              message: 'Registration failed, could not use Google account.'
            });
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
          this._notificationService.addNotification({
            type: 'ERR',
            message: 'Uncaught gConnect Registration Error.'
          });
        });
    } else {
      console.log('error gconnect signin for registration');
      this._notificationService.addNotification({
        type: 'ERR',
        message: 'Uncaught gConnect Registration Error. No authCode provided.'
      });
    }
  };
}
