import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Google's login API namespace
// declare var gapi: any;

@Component({
  selector: 'sac-gwh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  model: any = {};
  loading = false;
  error = '';
  @Output() flash = new EventEmitter();

  constructor(private accountService: AccountService,
              private router: Router) {
    window['gconnectLogin'] = this.gconnectLogin.bind(this);
    window['signInCallback'] = this.signInCallback.bind(this);
    window['handleFailure'] = this.handleFailure.bind(this);
  };

  ngOnInit() {
    // Converts the Google login button stub to an actual button.
    // done thourhg navigation component before we arrive here, when we got to dashboard or
    // login immediately by link, it dies
    // Converts the Google login button stub to an actual button.
    // done thourhg navigation component before we arrive here, when we got to dashboard or
    // login immediately by link, it dies

    // this.accountService.initialiseAuth2();
    // this.accountService.renderButton();
    // this.accountService.renderReCaptchaButton();

  };

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
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
        });
  }

  signInCallback(authResult: any) {
    if (authResult['code']) {
      console.log('signInCallback login component');
      console.log(authResult);
      this.accountService.gconnectHandle('LOGIN', authResult);
      this.router.navigateByUrl('/dashboard');
    } else {
      console.log('error gconnect signin');
      console.log(authResult);
    }
  };

  gconnectLogin(data: any) {
    console.log('gconnect login clicked!');
    // this.oauthObj.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(this.signInCallback);
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

}
