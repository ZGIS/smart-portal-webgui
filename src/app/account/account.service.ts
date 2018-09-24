import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'ngx-cookie';
import { CSWI_API_URL, PORTAL_API_URL } from '../in-app-config';
import { IErrorResult } from '../search/result';
import {
  GAuthCredentials,
  LoginCredentials,
  PasswordUpdateCredentials,
  ProfileJs,
  RegisterJs
} from './';
import { tryCatch } from 'rxjs/util/tryCatch';

/**
 *
 */
@Injectable()
export class AccountService {

  public token: string;

  public guestProfile: ProfileJs = {
    email: 'Your Account',
    firstname: 'Guest',
    lastname: 'User',
    password: '***'
  };

  private loggedInState: BehaviorSubject<boolean>;

  /**
   *
   * @param portalApiUrl
   * @param cswiApiUrl
   * @param http
   * @param cookieService
   */
  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               @Inject(CSWI_API_URL) private cswiApiUrl: string,
               private http: Http,
               private cookieService: CookieService ) {

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cookieToken = this.cookieService.get('XSRF-TOKEN');
    this.loggedInState = new BehaviorSubject(false);

    if (currentUser && cookieToken) {
      // and here we could also check for cookie, if cookie and token are available we could check
      // if we are still have valid session on server, too, only then we are like really really
      // logged in (maybe OnInit and not in constructor?)
      this.token = currentUser.token;
      if (currentUser.token === cookieToken) {
        // console.log('Trying to restore user from tokens...');

        let profileUri = this.portalApiUrl + '/users/self';
        // console.log('token: ' + this.token);
        let headers = new Headers({
          // 'Authorization': 'Bearer ' + this.token,
          'X-XSRF-TOKEN': this.token
        });
        let options = new RequestOptions({ headers: headers, withCredentials: true });

        this.http.get(profileUri, options)
          .map(
            ( response: Response ) => {
              // if (response.status === 200) {
              // console.log('succesfully verified current session');
              let userProfileJson = response.json();
              if (<ProfileJs>userProfileJson) {
                const userProfile: ProfileJs = userProfileJson;
                // console.log(userProfile);
                localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
              }
              this.loggedInState.next(true);
            }
          )
          .catch(( errorResponse: Response ) => this.handleError(errorResponse));
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
  }

  /**
   *
   * @returns {Observable<R>}
   */
  getProfile(): Observable<ProfileJs> {
    // add authorization header with jwt token
    let profileUri = this.portalApiUrl + '/users/self';
    // console.log('token: ' + this.token);
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token
    });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    // get users from api
    return this.http.get(profileUri, options)
      .map(
        ( response: Response ) => {
          let userProfileJson = response.json();
          if (<ProfileJs>userProfileJson) {
            const userProfile: ProfileJs = userProfileJson;
            // console.log(userProfile);
            this.loggedInState.next(true);
            localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
          }
          return response.json();
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @returns {Observable<T>}
   */
  isLoggedIn(): Observable<boolean> {
    // console.log(this.loggedInState);
    let currentStateValue = this.loggedInState.getValue();
    return this.loggedInState.asObservable();
  }

  /**
   *
   * @returns {boolean}
   */
  isLoggedInValue(): boolean {
    // console.log(this.loggedInState.value);
    return this.loggedInState.value;
  }

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
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(logoutUri, options)
      .map(( response: Response ) => {
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
      })
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @returns {Observable<R>}
   */
  deleteSelf(): Observable<any> {
    let deleteSelfUri = this.portalApiUrl + '/users/deleteself';
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token
    });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(deleteSelfUri, options)
      .map(( response: Response ) => {
        this.loggedInState.next(false);
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserProfile');
        this.cookieService.remove('XSRF-TOKEN');
        // return true to indicate successful logout
        return response.json();
      })
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @param loginCredentials
   * @returns {Observable<R>}
   */
  login( loginCredentials: LoginCredentials ): Observable<boolean> {
    let loginUri = this.portalApiUrl + '/login';
    let data = JSON.stringify(loginCredentials);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(loginUri, data, options)
      .map(( response: Response ) => {

        // login successful if there's a xsrf token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          // console.log('login received token: ' + token);
          this.loggedInState.next(true);

          // store accountSubject and xsrf token in local storage to keep user logged in between page
          // refreshes
          localStorage.setItem('currentUser',
            JSON.stringify({ email: loginCredentials.email, token: token }));

          let userProfileJson = response.json().userprofile;
          if (<ProfileJs>userProfileJson) {
            const userProfile: ProfileJs = userProfileJson;
            // console.log(userProfile);
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
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @param registerJs
   * @returns {Observable<R>}
   */
  register( registerJs: RegisterJs ): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/register';

    return this.http.post(regUri, registerJs)
      .map(( response: Response ) => {
        // if (response.status === 200) {
        let userProfileJson = response.json() && response.json().userprofile;
        if (<ProfileJs>userProfileJson) {
          const userProfile: ProfileJs = userProfileJson;
          // console.log(userProfile);
          localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
        }
        return true;
      })
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @param email
   * @param passwordUpdateCredentials
   * @returns {Observable<R>}
   */
  updatePassword( email: string,
                  passwordUpdateCredentials: PasswordUpdateCredentials ): Observable<boolean> {
    let updatePassUri = this.portalApiUrl + '/users/updatepass';

    let data = JSON.stringify({
      email: email,
      oldpassword: passwordUpdateCredentials.passwordCurrent,
      newpassword: passwordUpdateCredentials.passwordNew
    });
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(updatePassUri, data, options)
      .map(( response: Response ) => {
        // login successful if there's a xsrf token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          console.log('login received token: ' + token);
          this.loggedInState.next(true);

          // store accountSubject and xsrf token in local storage to keep user logged in between page
          // refreshes
          localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token }));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          // should also remove token?
          console.log('password update failed');
          return false;
        }
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @param userprofile
   * @returns {Observable<R>}
   */
  updateProfile( userprofile: ProfileJs ): Observable<boolean> {
    let updateProfileUri = this.portalApiUrl + '/users/update';

    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token,
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(updateProfileUri, userprofile, options)
      .map(( response: Response ) => {
        // TODO SR see above. HEre we will always have 2xx as status code
        // if (response.status === 200) {
        const userProfileJson = response.json();
        if (<ProfileJs> userProfileJson) {
          let userProfile: ProfileJs = userProfileJson;
          console.log(userProfile);
          localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
        }
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @param resetCredentials
   * @returns {Observable<R>}
   */
  requestPasswordReset( resetCredentials: LoginCredentials ): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/resetpass';
    let data = JSON.stringify(resetCredentials);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(regUri, data, options)
      .map(( response: Response ) => {
        // TODO SR see above
        // if (response.status === 200) {
        let info = response.json() && response.json().message;
        console.log(info);
        return true;
        // } else {
        //   return false;
        // }
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @param resetCredentials
   * @param redeemlink
   * @returns {Observable<R>}
   */
  redeemPasswordReset( resetCredentials: LoginCredentials,
                       redeemlink: string ): Observable<boolean> {
    let regUri = this.portalApiUrl + '/users/resetpass/' + redeemlink;

    let data = JSON.stringify(resetCredentials);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(regUri, data, options)
      .map(
        ( response: Response ) => {
          if (response.json()) {
            let info = response.json();
            console.log(info);
            this.handleErrorWithLogout(info);
          }
          return true;
        })
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   * server-side validation
   *
   * @param recaptchaChallenge
   * @returns {Observable<R>}
   */
  testReCaptcha( recaptchaChallenge: string ): Observable<boolean> {
    let paramUrl = this.portalApiUrl + '/recaptcha/validate' +
      '?recaptcaChallenge=' + recaptchaChallenge;
    let options = new RequestOptions({ withCredentials: true });

    return this.http.get(paramUrl, options)
      .map(( response: Response ) => {
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
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @returns {Observable<R|T>}
   */
  getPortalBackendVersion(): Observable<string> {
    let portalVersionUrl = this.portalApiUrl + '/discovery';
    return this.http.get(portalVersionUrl)
      .map(( response: Response ) => {
        let info = response.json() && response.json().version;
        console.log(info);
        return info;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  setHasGdprCookieAccepted() {
    try {
      localStorage.setItem('privacy.cookie', 'true');
    } catch (e) {
      console.error('could not set privacy cookie');
    }
  }

  hasGdprCookieAccepted(): Observable<boolean> {
    try {
      let acc = localStorage.getItem('privacy.cookie');
      if (acc && acc === 'true') {
        return Observable.of(true);
      } else {
        return Observable.of(false);
      }
    } catch (e) {
      return Observable.of(false);
    }
  }


  /**
   *
   * @returns {Observable<R|T>}
   */
  getCswIngesterVersion(): Observable<string> {
    let cswiVersionUrl = this.cswiApiUrl + '/discovery';
    return this.http.get(cswiVersionUrl)
      .map(( response: Response ) => {
        let info = response.json() && response.json().version;
        console.log(info);
        return info;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @param gAuthCredential
   * @returns {Observable<R>}
   */
  gconnectHandle( gAuthCredential: GAuthCredentials ) {
    // console.log(gAuthCredential.accesstype);
    if (gAuthCredential.accesstype === 'REGISTER') {
      // return this.gconnectHandleRegistration(gAuthCredential);
      return this.gconnectHandleLogin(gAuthCredential);
    } else if (gAuthCredential.accesstype === 'LOGIN') {
      return this.gconnectHandleLogin(gAuthCredential);
    }
  }

  /**
   *
   * @param gAuthCredential
   * @returns {Observable<R>}
   */
  private gconnectHandleLogin( gAuthCredential: GAuthCredentials ) {
    let gconnectPortalUri = this.portalApiUrl + '/login/gconnect';
    let data = JSON.stringify(gAuthCredential);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    // console.log(data);

    return this.http.post(gconnectPortalUri, data, options)
      .map(( response: Response ) => {
        // login successful if there's a xsrf token in the response
        let token = response.json() && response.json().token;
        if (token) {
          // set token property
          this.token = token;
          // console.log('login received token: ' + token);
          this.loggedInState.next(true);

          // store accountSubject and xsrf token in local storage to keep user logged in between page refreshes
          let email = response.json().email;
          localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token }));

          let userProfileJson = response.json().userprofile;
          if (<ProfileJs>userProfileJson) {
            const userProfile: ProfileJs = userProfileJson;
            // console.log(userProfile);
            localStorage.setItem('currentUserProfile', JSON.stringify(userProfile));
          }
          // return true to indicate successful login
          return true;
        }
      })
      .catch(( errorResponse: Response ) => this.handleErrorWithLogout(errorResponse));
  }

  /**
   *
   * @param errorResponse
   * @returns {any}
   */
  private handleError( errorResponse: Response ) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json') ||
      errorResponse.headers.get('content-type').startsWith('application/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText}: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResult.details });
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResponse.text() });
    }
  }

  /**
   *
   * @param errorResponse
   * @returns {any}
   */
  private handleErrorWithLogout( errorResponse: Response ) {
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
  }

}
