import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService, createProfile } from './account.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';

// Google's login API namespace
// declare var gapi: any;
// declare var grecaptcha: any;

@Component({
  selector: 'sac-gwh-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  model: any = {};
  loading = false;
  recaptchaValid = false;
  error = '';
  @Output() flash = new EventEmitter();

  constructor(private accountService: AccountService, private router: Router,
              private http: Http, private _notificationService: NotificationService) {
    // window['gconnectReg'] = this.gconnectReg.bind(this);
    // window['signInCallback'] = this.signInCallback.bind(this);
    // window['handleFailure'] = this.handleFailure.bind(this);
    window['recaptchaCallback'] = this.recaptchaCallback.bind(this);

  };

  ngOnInit() {
    // Converts the Google login button stub to an actual button.
    // done thourhg navigation component before we arrive here, when we got to dashboard or
    // login immediately by link, it dies

    // this.accountService.initialiseAuth2();
    // this.accountService.renderButton();
    // this.accountService.renderReCaptchaButton();
  };

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

    console.log('submit register form clicked!');
    console.log(regProfile);

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
        });
  };

  // TODO should validate recaptcha, activate when backend is online
  recaptchaCallback(captchaChallenge: string) {
    this.recaptchaValid = true;
/*    this.accountService.testReCaptcha(captchaChallenge).subscribe(
      result => {
        console.log(result);
        if (result === true) {
          this.recaptchaValid = true;
        } else {
          this.recaptchaValid = false;
          console.log('error recapture not valid');
        }
      },
      error => {
        this.loading = false;
        this.recaptchaValid = false;
        this.error = <any>error;
      });*/
  };

  /*
   signInCallback(authResult: any) {
   if (authResult['code']) {
   console.log('signInCallback register component');
   console.log(authResult);
   this.accountService.gconnectHandle('REGISTER', authResult);
   this.router.navigateByUrl('/dashboard');
   } else {
   console.log('error gconnect re signin');
   console.log(authResult);
   }
   };

   gconnectReg(data: any) {
   console.log('gconnect register clicked!');
   // this.auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(this.signInCallback);
   console.log(data);
   };

   private handleFailure(error: Response | any) {
   // In a real world app, we might use a remote logging infrastructure
   let errMsg: string;
   if (error instanceof Response) {
   const body = error.json() || '';
   const err = body.error || JSON.stringify(body);
   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
   } else {
   errMsg = error.message ? error.message : error.toString();
   }
   console.error(errMsg);
   return Observable.throw(errMsg);
   };
   */

}
