import { Component } from '@angular/core';
import { AccountService, UserProfile, createProfile } from './account.service';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable }     from 'rxjs/Observable';

// Google's login API namespace
declare var gapi: any;
declare var grecaptcha: any;

@Component({
  selector: 'sac-gwh-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  private recaptureSecret = '6Le5RQsUAAAAAMcRg_--U2VTqG4t9EyxVjCb_5WL';

  constructor(private accountService: AccountService, private router: Router, private http: Http) {
    window['gconnectReg'] = this.gconnectReg.bind(this);
    window['signInCallback'] = this.signInCallback.bind(this);
    window['handleFailure'] = this.handleFailure.bind(this);
    window['recaptchaCallback'] = this.recaptchaCallback.bind(this);
  };

  ngAfterViewInit() {
    // Converts the Google login button stub to an actual button.
    // done thourhg navigation component before we arrive here, when we got to dashboard or
    // login immediately by link, it dies
    // this.initialiseAuth2();

    this.renderButton();
    this.renderReCaptchaButton();
  };

  // initialise auth2 object
  initialiseAuth2() {
    gapi.load('auth2', function () {
      gapi.auth2.init({
        'client_id': '988846878323-bkja0j1tgep5ojthfr2e92ao8n7iksab.apps.googleusercontent.com',
        // Scopes to request in addition to 'profile' and 'email'
        'scope': 'profile email'
      });
    });
  };

  // Converts the Google login button stub to an actual button.
  renderButton() {
    gapi.signin2.render('signInButton',
      {
        'scope': 'openid email',
        'width': 200,
        'height': 50,
        'onsuccess': this.gconnectReg,
        'onfailure': this.handleFailure
      });
  };

  // Converts the Google login button stub to an actual button.
  renderReCaptchaButton() {
    grecaptcha.render(
      'g-recaptcha',
      {
        'sitekey' : '6Le5RQsUAAAAAM_YjqAXzrJVLwqbYFl4hNmQ4n3Z',
        'theme' : 'light'
      }
    );
  };

  onSubmit(formValue: UserProfile) {
    let regProfile = createProfile(formValue);

    console.log('submit register form clicked!');
    console.log(regProfile);
  };

  recaptchaCallback(captchaChallenge: string) {
    console.log(captchaChallenge);
    const gvUrl = 'https://www.google.com/recaptcha/api/siteverify';
    let paramUrl = gvUrl + '?' + this.recaptureSecret + '&' + captchaChallenge;
    Promise.resolve(this.http.post(paramUrl, {})
      .map(this.verifyReCaptcha)
      .catch(this.handleFailure));
  };

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

  private verifyReCaptcha(res: Response) {
    let body = res.json();
    // return body.data || {};
    console.log('verifyReCaptcha');
    console.log(body.data);
    return body.data;
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

}
