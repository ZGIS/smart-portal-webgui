import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
// import { Observable }     from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';
import { CookieService } from 'angular2-cookie/core';
import { PORTAL_API_URL } from '../app.tokens';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

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

  public token: string;

  guestProfile = createProfile({
    email: 'guest@example.com',
    username: 'guest',
    firstname: 'Guest',
    lastname: 'User',
    password: 'xxx'
  });

  private _loggedInState: BehaviorSubject<boolean>;

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router, private _cookieService: CookieService) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cookieToken = this._cookieService.get('XSRF-TOKEN');
    this._loggedInState = new BehaviorSubject(false);

    if (currentUser && cookieToken) {
      // and here we could also check for cookie, if cookie and token are available we could check
      // if we are still have valid session on server, too, only then we are like really really
      // logged in (maybe OnInit and not in constructor?)
      this.token = currentUser.token;
      if (currentUser.token === cookieToken) {
        console.log('Trying to restore user from tokens...');

        let profileUri = this.portalApiUrl + '/users/self';
        console.log('token: ' + this.token);
        let headers = new Headers({
          // 'Authorization': 'Bearer ' + this.token,
          'X-XSRF-TOKEN': this.token
        });
        let options = new RequestOptions({headers: headers, withCredentials: true});

        this.http.get(profileUri, options)
          .map(
            (response: Response) => {
              if (response.status === 200) {
                console.log('succesfully verified current session');
                let userProfileJson = response.json();
                if (userProfileJson) {
                  let userProfile = createProfile(userProfileJson);
                  console.log(userProfile);
                  localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
                }
                this._loggedInState.next(true);
              } else {
                console.log('could not verify current session');
                this._loggedInState.next(false);
                // clear token remove user from local storage to log user out
                this.token = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserProfile');
                this._cookieService.remove('XSRF-TOKEN');
                this.handleHttpFailure(response);
              }
            }
          )
          .catch(this.handleHttpFailureWithLogout);

      } else {
        console.log('auth token and cookie mismatch, not a valid session ...');
        this._loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this._cookieService.remove('XSRF-TOKEN');

      }
    } else {
      console.log('either auth token or cookie missing, not a valid session ...');
      this._loggedInState.next(false);
      // clear token remove user from local storage to log user out
      this.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserProfile');
      this._cookieService.remove('XSRF-TOKEN');
    }
  };

  getProfile(): Observable<UserProfile> {
    // add authorization header with jwt token
    let profileUri = this.portalApiUrl + '/users/self';
    console.log('token: ' + this.token);
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});

    // get users from api
    return this.http.get(profileUri, options)
      .map(
        (response: Response) => {
          if (response.status === 200) {
            let userProfileJson = response.json();
            if (userProfileJson) {
              let userProfile = createProfile(userProfileJson);
              console.log(userProfile);
              localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
            }
            return response.json();
          } else {
            // indicates failed self retrieve / authenticated session
            // should also remove token and invalidate angular session?
            this._loggedInState.next(false);
            // clear token remove user from local storage to log user out
            this.token = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserProfile');
            this._cookieService.remove('XSRF-TOKEN');
            return Observable.throw('invalid session');
          }
        }
      )
      .catch(this.handleHttpFailureWithLogout);
  };

  isLoggedIn(): Observable<boolean> {
    // console.log(this.loggedInState);
    return this._loggedInState.asObservable();
  };

  logout(): Observable<boolean> {
    let logoutUri = this.portalApiUrl + '/logout';
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.get(logoutUri, options)
      .map((response: Response) => {
        // logout
        if (response.status === 200) {
          this._loggedInState.next(false);
          // clear token remove user from local storage to log user out
          this.token = null;
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentUserProfile');
          this._cookieService.remove('XSRF-TOKEN');
          // return true to indicate successful logout
          return true;
        } else {
          // return false to indicate failed logout
          // should also remove token and invalid angular session?
          console.log('logout failed');
          return false;
        }
      }).catch(this.handleHttpFailureWithLogout);
  };

  login(username: string, password: string): Observable<boolean> {
    let loginUri = this.portalApiUrl + '/login';
    let data = JSON.stringify({username: username, password: password});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.post(loginUri, data, options)
      .map((response: Response) => {
        // login successful if there's a xsrf token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          console.log('login received token: ' + token);
          this._loggedInState.next(true);

          // store username and xsrf token in local storage to keep user logged in between page
          // refreshes
          localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));

          let userProfileJson = response.json().userprofile;
          if (userProfileJson) {
            let userProfile = createProfile(userProfileJson);
            console.log(userProfile);
            localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
          }
          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          // should also remove token?
          this._loggedInState.next(false);
          console.log('login failed');
          return false;
        }
      }).catch(this.handleHttpFailure);
  };

  register(userprofile: UserProfile): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/register';

    // JSON.stringify({username: username, password: password}))
    return this.http.post(regUri, userprofile)
      .map((response: Response) => {
        if (response.status === 200) {

          let userProfileJson = response.json() && response.json().userprofile;
          if (userProfileJson) {
            let userProfile = createProfile(userProfileJson);
            console.log(userProfile);
            localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
          }
          return true;
        } else {
          return false;
        }
      }).catch(this.handleHttpFailure);
  };

  requestPasswordReset(email: string): Observable<boolean> {
    return Observable.from([true]);
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
   window.location.href = '/admin/apps';
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

   // initialise auth2 object
   initialiseAuth2() {
   gapi.load('auth2', function () {
   let obj = gapi.auth2.init({
   'client_id': '988846878323-bkja0j1tgep5ojthfr2e92ao8n7iksab.apps.googleusercontent.com',
   // Scopes to request in addition to 'profile' and 'email'
   'scope': 'profile email'
   });
   console.log(obj);
   return obj;
   });
   }

   // Converts the Google login button stub to an actual button.
   renderButton() {
   let auth2 = this.initialiseAuth2();

   gapi.signin2.render('signInButton',
   {
   'scope': 'openid email',
   'width': 200,
   'height': 50,
   'onsuccess': this.gconnectLogin,
   'onfailure': this.handleFailure
   });

   console.log(auth2);
   };

   // Converts the Google login button stub to an actual button.
   renderReCaptchaButton() {
   grecaptcha.render(
   'g-recaptcha',
   {
   'sitekey': '6Le5RQsUAAAAAM_YjqAXzrJVLwqbYFl4hNmQ4n3Z',
   'theme': 'light',
   'callback': this.recaptchaCallback
   }
   );
   };

   gconnectHandle(authRequester: string, authResult: any) {
   console.log('gconnectHandle account coming from ' + authRequester);
   let gconnectPortalUri = this.portalApiUrl + '/login/gconnect';
   let data = authResult['code'];
   console.log(data);
   // here we could already also get XSRF-TOKEN from localstorage if available?
   return this.http.post(gconnectPortalUri, data)
   .map(this.extractGoogleSignInData)
   .catch(this.handleGoogleSignInError);
   };


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

   */

  private handleHttpFailure(error: Response | any) {
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

  private handleHttpFailureWithLogout(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.status || JSON.stringify(body);
      if (error.status === 401) {
        // 401 unauthorized
        this._loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this._cookieService.remove('XSRF-TOKEN');
      }
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  };

}
