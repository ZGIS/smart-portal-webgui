import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Router }   from '@angular/router';
import { Observable }     from 'rxjs/Observable';
import { PORTAL_API_URL } from '../app.tokens';

export interface UserProfile {
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  password?: string;
}

export function createProfile(profileConf: UserProfile): {
  email: string,
  username: string,
  firstname: string,
  lastname: string,
  password?: string } {

  let profileObj = {
    email: profileConf.email,
    username: profileConf.username,
    firstname: profileConf.firstname,
    lastname: profileConf.lastname,
    password: '***'
  };

  if (profileConf.password) {
    profileObj.password = profileConf.password;
  }

  return profileObj;
}

@Injectable()
export class AccountService {

  profileNoPass = createProfile({
    email: 'alex@example.com',
    username: 'alex',
    firstname: 'Alex',
    lastname: 'K'
  });
  // loginTest = {'username': 'alex', 'password': 'testpass123'};
  guestProfile = createProfile({
    email: 'alex@example.com',
    username: 'akmoch',
    firstname: 'Alex',
    lastname: 'K',
    password: 'testpass123'
  });

  private loggedInState = false;

  getProfile(): UserProfile {
    return this.profileNoPass;
  };

  getUsername(): string {
    return this.profileNoPass.username;
  };

  authenticate(credentials: any) {
    this.loggedInState = true;
    this.profileNoPass.username = credentials.login.email;
  }

  isLoggedIn(): boolean {
    // console.log(this.loggedInState);
    return this.loggedInState;
  };

  logout() {
    this.loggedInState = false;
    this.profileNoPass.username = 'guest';
  }

  /*
   // Hide the sign-in button now that the user is authorize
   $.ajax({
   type: 'POST',
   url: '/admin/gconnect?state={{STATE}}',
   processData: false,
   data: authResult['code'],
   contentType: 'application/octet-stream; charset=utf-8',
   success: function(result) {

   // Handle or verify the server response if necessary.
   if (result) {
   $('#result').html('Login Successful!</br>'+ result + '</br>Redirecting...')
   setTimeout(function() {
   window.location.href = "/admin/apps";
   }, 4000);

   } else if (authResult['error']) {
   console.log('There was an error: ' + authResult['error']);
   } else {
   $('#result').html('Failed to make a server-side call. Check your configuration and console.');
   }
   }

   });

   // Send the one-time-use code to the server, if the server responds,
   // write a 'login successful' message to the web page and then redirect back to the main
   // restaurants page

   */
  gconnectHandle(authRequester: string, authResult: any) {
    console.log('gconnectHandle account coming from ' + authRequester);
    let gconnectPortalUri = this.portalApiUrl + '/api/v1/login/gconnect';
    let data = authResult['code'];
    console.log(data);
    // here we could already also get XSRF-TOKEN from localstorage if available?
    return this.http.post(gconnectPortalUri, data)
      .map(this.extractGoogleSignInData)
      .catch(this.handleGoogleSignInError);
  };

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router) {
  }

  private extractGoogleSignInData(res: Response) {
    let body = res.json();
    // return body.data || {};
    console.log('extractGoogleSignInData');
    console.log(body.data);
    return body.data;
  };

  private handleGoogleSignInError(error: Response | any) {
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
  }

}
