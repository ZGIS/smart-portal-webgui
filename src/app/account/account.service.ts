import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
// import { Observable }     from 'rxjs/Observable';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'angular2-cookie/core';
import { PORTAL_API_URL } from '../app.tokens';
import { NotificationService } from '../notifications';

/**
 *
 */
export interface UserProfile {
  email: string;
  accountSubject: string;
  firstname: string;
  lastname: string;
  password?: string;
}

/**
 *
 * @param profileConf
 * @returns {{email: string, accountSubject: string, firstname: string,
 *  lastname: string, password: string}}
 */
export function createProfile(profileConf: UserProfile): {
  email: string,
  accountSubject: string,
  firstname: string,
  lastname: string,
  password?: string
} {

  let profileObj = {
    email: profileConf.email,
    accountSubject: profileConf.accountSubject,
    firstname: profileConf.firstname,
    lastname: profileConf.lastname,
    password: '***'
  };

  if (profileConf.password) {
    profileObj.password = profileConf.password;
  }

  return profileObj;
}

/**
 *
 */
@Injectable()
export class AccountService {

  public token: string;

  guestProfile = createProfile({
    email: 'Your Account',
    accountSubject: 'guest',
    firstname: 'Guest',
    lastname: 'User',
    password: 'xxx'
  });

  private loggedInState: BehaviorSubject<boolean>;

  /**
   *
   * @param portalApiUrl
   * @param http
   * @param router
   * @param cookieService
   * @param notificationService
   */
  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router,
              private cookieService: CookieService,
              private notificationService: NotificationService) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cookieToken = this.cookieService.get('XSRF-TOKEN');
    this.loggedInState = new BehaviorSubject(false);

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
                this.loggedInState.next(true);
              } else {
                console.log('could not verify current session');
                this.loggedInState.next(false);
                // clear token remove user from local storage to log user out
                this.token = null;
                localStorage.removeItem('currentUser');
                localStorage.removeItem('currentUserProfile');
                this.cookieService.remove('XSRF-TOKEN');
                this.handleHttpFailure(response);
              }
            }
          )
          .catch(this.handleHttpFailureWithLogout);

      } else {
        console.log('auth token and cookie mismatch, not a valid session ...');
        this.loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this.cookieService.remove('XSRF-TOKEN');

      }
    } else {
      console.log('either auth token or cookie missing, not a valid session ...');
      this.loggedInState.next(false);
      // clear token remove user from local storage to log user out
      this.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserProfile');
      this.cookieService.remove('XSRF-TOKEN');
    }
  };

  /**
   *
   * @returns {Observable<R>}
   */
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
              this.loggedInState.next(true);
              localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
            }
            return response.json();
          } else {
            // indicates failed self retrieve / authenticated session
            // should also remove token and invalidate angular session?
            this.loggedInState.next(false);
            // clear token remove user from local storage to log user out
            this.token = null;
            localStorage.removeItem('currentUser');
            localStorage.removeItem('currentUserProfile');
            this.cookieService.remove('XSRF-TOKEN');
            return Observable.throw('invalid session');
          }
        }
      )
      .catch(this.handleHttpFailureWithLogout);
  };

  /**
   *
   * @returns {Observable<T>}
   */
  isLoggedIn(): Observable<boolean> {
    // console.log(this.loggedInState);
    return this.loggedInState.asObservable();
  };

  /**
   *
   * @returns {Observable<R>}
   */
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
          this.loggedInState.next(false);
          // clear token remove user from local storage to log user out
          this.token = null;
          localStorage.removeItem('currentUser');
          localStorage.removeItem('currentUserProfile');
          this.cookieService.remove('XSRF-TOKEN');
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

  /**
   *
   * @param email
   * @param password
   * @returns {Observable<R>}
   */
  login(email: string, password: string): Observable<boolean> {
    let loginUri = this.portalApiUrl + '/login';
    let data = JSON.stringify({email: email, password: password});
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
          this.loggedInState.next(true);

          // store accountSubject and xsrf token in local storage to keep user logged in between page
          // refreshes
          localStorage.setItem('currentUser', JSON.stringify({email: email, token: token}));

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
          this.loggedInState.next(false);
          console.log('login failed');
          return false;
        }
      }).catch(this.handleHttpFailure);
  };

  /**
   *
   * @param userprofile
   * @returns {Observable<R>}
   */
  register(userprofile: UserProfile): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/register';

    // JSON.stringify({email: email, password: password}))
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

  /**
   * TODO
   *
   * @param email
   * @returns {any}
   */
  requestPasswordReset(email: string): Observable<boolean> {
    return Observable.from([true]);
  }

  /**
   * server-side validation
   *
   * @param recaptchaChallenge
   * @returns {Observable<R>}
   */
  testReCaptcha(recaptchaChallenge: string): Observable<boolean> {
    let paramUrl = this.portalApiUrl + '/recaptcha/validate' +
      '?recaptcaChallenge=' + recaptchaChallenge;
    let options = new RequestOptions({withCredentials: true});

    return this.http.get(paramUrl, options)
      .map((response: Response) => {
        if (response.status === 200) {

          let success = response.json() && response.json().success;
          if (success) {
            console.log(success);
            return true;
          }
          return false;
        } else {
          return false;
        }
      }).catch(this.handleHttpFailure);
  };

  /**
   *
   * @param authRequester
   * @param authCode
   * @returns {Observable<R>}
   */
  gconnectHandle(authRequester: string, authCode: string) {
    if (authRequester === 'REGISTER') {
      console.log(authRequester);
      return this.gconnectHandleRegistration(authCode);
    } else if (authRequester === 'LOGIN') {
      console.log(authRequester);
      return this.gconnectHandleLogin(authCode);
    } else { // or else if, doesn't matter
      console.log('error, authCode not recognised');
      let error = ({message: 'error, authCode not recognised'});
      return this.handleHttpFailureWithLogout(error);
    }


  };

  /**
   *
   * @param authCode
   * @returns {Observable<R>}
   */
  private gconnectHandleRegistration(authCode: string) {
    let gconnectPortalUri = this.portalApiUrl + '/login/gconnect';
    let data = JSON.stringify({authcode: authCode, accesstype: 'REGISTER'});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    console.log(data);

    return this.http.post(gconnectPortalUri, data, options)
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
  }

  /**
   *
   * @param authCode
   * @returns {Observable<R>}
   */
  private gconnectHandleLogin(authCode: string) {
    let gconnectPortalUri = this.portalApiUrl + '/login/gconnect';
    let data = JSON.stringify({authcode: authCode, accesstype: 'LOGIN'});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    console.log(data);

    return this.http.post(gconnectPortalUri, data, options)
      .map((response: Response) => {
        // login successful if there's a xsrf token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          console.log('login received token: ' + token);
          this.loggedInState.next(true);

          // store accountSubject and xsrf token in local storage to keep user logged in between page
          // refreshes
          let email = response.json().email;
          localStorage.setItem('currentUser', JSON.stringify({email: email, token: token}));

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
          this.loggedInState.next(false);
          console.log('google login failed');
          this.notificationService.addNotification({
            type: 'ERR',
            message: 'Google login failed'
          });
          return false;
        }
      }).catch(this.handleHttpFailureWithLogout);
  }

  /**
   *
   * @param error
   * @returns {any}
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
    this.notificationService.addNotification({
      type: 'ERR',
      message: 'Uncaught Http Error: ' + errMsg
    });
    return Observable.throw(errMsg);
  };

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleHttpFailureWithLogout(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.status || JSON.stringify(body);
      if (error.status === 401) {
        // 401 unauthorized
        this.loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this.cookieService.remove('XSRF-TOKEN');
      }
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.notificationService.addNotification({
      type: 'ERR',
      message: 'You have been logged out due to an uncaught Http Error: ' + errMsg
    });
    return Observable.throw(errMsg);
  };

}
