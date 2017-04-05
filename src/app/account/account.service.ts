import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'angular2-cookie/core';
import { PORTAL_API_URL, CSWI_API_URL, WEBGUI_APP_VERSION } from '../in-app-config';
import { NotificationService } from '../notifications';
import { IErrorResult } from '../search/result';

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
   */
  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              @Inject(CSWI_API_URL) private cswiApiUrl: string,
              @Inject(WEBGUI_APP_VERSION) public webguiAppVersion: string,
              private http: Http, private router: Router,
              private cookieService: CookieService) {

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
              // if (response.status === 200) {
              console.log('succesfully verified current session');
              let userProfileJson = response.json();
              if (userProfileJson) {
                let userProfile = createProfile(userProfileJson);
                console.log(userProfile);
                localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
              }
              this.loggedInState.next(true);
              // }
              // FIXME SR this should never happen! Every http status code <200 & >299 will fail
              // else {
              //   console.log('could not verify current session');
              //   this.loggedInState.next(false);
              //   // clear token remove user from local storage to log user out
              //   this.token = null;
              //   localStorage.removeItem('currentUser');
              //   localStorage.removeItem('currentUserProfile');
              //   this.cookieService.remove('XSRF-TOKEN');
              //   this.handleHttpFailure(response);
              // }
            }
          )
          .catch((errorResponse: Response) => this.handleError(errorResponse));
      } else { // current user.token != cookie.token
        console.log('auth token and cookie mismatch, not a valid session ...');
        this.loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this.cookieService.remove('XSRF-TOKEN');
      }
    } else { // !(currentUser && cookieToken)
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
          // TODO SR see above. Here we should always find a 2xx http status code.
          // if (response.status === 200) {
          let userProfileJson = response.json();
          if (userProfileJson) {
            let userProfile = createProfile(userProfileJson);
            console.log(userProfile);
            this.loggedInState.next(true);
            localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
          }
          return response.json();
          //   } else {
          //     // indicates failed self retrieve / authenticated session
          //     // should also remove token and invalidate angular session?
          //     this.loggedInState.next(false);
          //     // clear token remove user from local storage to log user out
          //     this.token = null;
          //     localStorage.removeItem('currentUser');
          //     localStorage.removeItem('currentUserProfile');
          //     this.cookieService.remove('XSRF-TOKEN');
          //     return Observable.throw('invalid session');
          //   }
        }
      )
      .catch((errorResponse: Response) => this.handleError(errorResponse));
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
        // if (response.status === 200) {
        this.loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this.cookieService.remove('XSRF-TOKEN');
        // return true to indicate successful logout
        return true;
        // } else {
        //   // return false to indicate failed logout
        //   // should also remove token and invalid angular session?
        //   console.log('logout failed');
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleErrorWithLogout(errorResponse));
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
        // TODO SR when I look at the code in the backend, either the login replys with 200
        // and then contains a token and everything, or http-fails and this will never be called
        // and everything will be handled by the errorHandler.

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
          // TODO SR this should never happen!
          // return false to indicate failed login
          // should also remove token?
          this.loggedInState.next(false);
          console.log('login failed');
          return false;
        }
      })
      .catch((errorResponse: Response) => this.handleErrorWithLogout(errorResponse));
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
        // if (response.status === 200) {
        let userProfileJson = response.json() && response.json().userprofile;
        if (userProfileJson) {
          let userProfile = createProfile(userProfileJson);
          console.log(userProfile);
          localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
        }
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleErrorWithLogout(errorResponse));
  };

  /**
   *
   * @param email
   * @param password
   * @returns {Observable<R>}
   */
  updatePassword(email: string, password: string): Observable<boolean> {
    let updatePassUri = this.portalApiUrl + '/users/updatepass';

    let data = JSON.stringify({email: email, password: password});
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(updatePassUri, data, options)
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

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          // should also remove token?
          console.log('password update failed');
          return false;
        }
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  };

  /**
   *
   * @param userprofile
   * @returns {Observable<R>}
   */
  updateProfile(userprofile: UserProfile): Observable<boolean> {
    let updateProfileUri = this.portalApiUrl + '/users/update/' + userprofile.email;

    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.post(updateProfileUri, userprofile, options)
      .map((response: Response) => {
        // TODO SR see above. HEre we will always have 2xx as status code
        // if (response.status === 200) {
        let userProfileJson = response.json();
        if (userProfileJson) {
          let userProfile = createProfile(userProfileJson);
          console.log(userProfile);
          localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
        }
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  };

  /**
   *
   * @param email
   * @returns {Observable<R>}
   */
  requestPasswordReset(email: string): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/resetpass';

    let data = JSON.stringify({email: email, password: 'PASSWORDRESET'});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.post(regUri, data, options)
      .map((response: Response) => {
        // TODO SR see above
        // if (response.status === 200) {
        let info = response.json() && response.json().message;
        console.log(info);
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  }

  /**
   *
   * @param email
   * @param password
   * @returns {Observable<R>}
   */
  redeemPasswordReset(email: string, password: string, redeemlink: string): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/resetpass/' + redeemlink;

    let data = JSON.stringify({email: email, password: password});
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers, withCredentials: true});
    return this.http.post(regUri, data, options)
      .map(
        (response: Response) => {
          // TODO SR see above
          // if (response.status === 200) {
          let info = response.json() && response.json().message;
          console.log(info);
          return true;
          // } else {
          //   return false;
          // }
        })
      .catch((errorResponse: Response) => this.handleErrorWithLogout(errorResponse));
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
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  };

  /**
   *
   * @returns {Observable<R|T>}
   */
  getPortalBackendVersion(): Observable<string> {
    let portalVersionUrl = this.portalApiUrl + '/discovery';
    return this.http.get(portalVersionUrl)
      .map((response: Response) => {
        let info = response.json() && response.json().version;
        console.log(info);
        return info;
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  };

  /**
   *
   * @returns {Observable<R|T>}
   */
  getCswIngesterVersion(): Observable<string> {
    let cswiVersionUrl = this.cswiApiUrl + '/discovery';
    return this.http.get(cswiVersionUrl)
      .map((response: Response) => {
        let info = response.json() && response.json().version;
        console.log(info);
        return info;
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  }

  /**
   *
   * @param authRequester
   * @param authCode
   * @returns {Observable<R>}
   */
  gconnectHandle(authRequester: string, authCode: string) {
    if (authRequester === 'REGISTER') {
      console.log(authRequester);
      // return this.gconnectHandleRegistration(authCode);
      return this.gconnectHandleLogin(authCode);
    } else if (authRequester === 'LOGIN') {
      console.log(authRequester);
      return this.gconnectHandleLogin(authCode);
    }
    // FIXME SR can this happen?
    // else { // or else if, doesn't matter
    //   console.log('error, authCode not recognised');
    //   let error = (<IErrorResult>{message: 'error, authCode not recognised'});
    //   return this.handleErrorWithLogout(error);
    // }
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
        // FIXME SR this should never return anything else than 200!
        // if (response.status === 200) {

        let userProfileJson = response.json() && response.json().userprofile;
        if (userProfileJson) {
          let userProfile = createProfile(userProfileJson);
          console.log(userProfile);
          localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
        }
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse));
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

          // store accountSubject and xsrf token in local storage to keep user logged in between page refreshes
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
        }
        // TODO SR this should never happen. Either it returns OK with a token, or http failure
        // else {
        //   // return false to indicate failed login
        //   // should also remove token?
        //   this.loggedInState.next(false);
        //   console.log('google login failed');
        //   this.notificationService.addNotification({
        //     type: 'warning',
        //     message: 'Google login failed'
        //   });
        //   return false;
        // }
      })
      .catch((errorResponse: Response) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json') ||
      errorResponse.headers.get('content-type').startsWith('application/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText}: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()});
    }
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleErrorWithLogout(errorResponse: Response) {
    if (errorResponse.status === 401) {
      // 401 unauthorized
      this.loggedInState.next(false);
      // clear token remove user from local storage to log user out
      this.token = null;
      localStorage.removeItem('currentUser');
      localStorage.removeItem('currentUserProfile');
      this.cookieService.remove('XSRF-TOKEN');
    }
    // TODO SR add "you've been logged out" to message
    return this.handleError(errorResponse);
  };

}
