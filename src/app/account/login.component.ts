import { Component, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AccountService } from './account.service';
import { Router }   from '@angular/router';
import { Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

// Google's login API namespace
declare var gapi: any;

@Component({
  selector: 'sac-gwh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements AfterViewInit {
  @Output() flash = new EventEmitter();

  ngAfterViewInit() {
    // Converts the Google login button stub to an actual button.
    // done thourhg navigation component before we arrive here, when we got to dashboard or
    // login immediately by link, it dies
    // this.initialiseAuth2();

    this.renderButton();
  };

  // initialise auth2 object
  initialiseAuth2() {
    gapi.load('auth2', function () {
      let obj = gapi.auth2.init({
        'client_id': '988846878323-bkja0j1tgep5ojthfr2e92ao8n7iksab.apps.googleusercontent.com',
        // Scopes to request in addition to 'profile' and 'email'
        'scope': 'profile email'
      });
      console.log(obj);
    });
  }

  // Converts the Google login button stub to an actual button.
  renderButton() {
    gapi.signin2.render('signInButton',
      {
        'scope': 'openid email',
        'width': 200,
        'height': 50,
        'onsuccess': this.gconnectLogin,
        'onfailure': this.handleFailure
      });
  };

  onSubmit(formRef: any) {
    console.log(formRef);
    this.accountService.authenticate(formRef);
    this.router.navigateByUrl('/dashboard');
  };

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

  constructor(private accountService: AccountService,
              private router: Router) {
    window['gconnectLogin'] = this.gconnectLogin.bind(this);
    window['signInCallback'] = this.signInCallback.bind(this);
    window['handleFailure'] = this.handleFailure.bind(this);
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
