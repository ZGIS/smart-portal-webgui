import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { PORTAL_API_URL } from '../in-app-config';
import { ProfileJs } from '../account/account.types';
import { UserFile, UserMetaRecord } from '../workbench';
import { UserGroup, UserLinkLogging, UserSession } from './';
import { IErrorResult } from '../search/result';
import { CookieService } from 'ngx-cookie';
import { AccountService } from '../account/account.service';

/**
 *
 */
@Injectable()
export class AdminService {

  public token: string;

  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private http: Http,
               private accountService: AccountService,
               private cookieService: CookieService ) {

    this.token = this.cookieService.get('XSRF-TOKEN');
  }

  /**
   * GET /api/v1/admin/ami   -> controllers.AdminController.amiAdmin
   *
   * @returns {Observable<R>}
   */
  amiAdmin(): Observable<any> {
    // add authorization header with jwt token
    this.token = this.cookieService.get('XSRF-TOKEN');
    let adminUri = this.portalApiUrl + '/admin/ami';
    console.log('token: ' + this.token);
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': this.token
    });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(adminUri, options)
      .map(
        ( response: Response ) => {
          let resp = <any>response.json();
          if (resp.status === 'OK' && resp.token === this.token) {
            console.log(resp);
          }
          return response.json();
        }
      )
      .catch(( errorResponse: Response ) => this.handleHttpFailure(errorResponse));
  }

  /**
   * GET  /api/v1/admin/users       -> controllers.AdminController.getAllUsers
   *
   * @returns {Observable<ProfileJs[]>}
   */
  getAllUsers(): Observable<ProfileJs[]> {
    let url = this.portalApiUrl + '/admin/users';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().users;
          if (<ProfileJs[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET /api/v1/admin/users/:command/:email
   *  -> controllers.AdminController.blockUnblockUsers(command: String, email: String)
   * @param {string} command
   * @param {string} email
   * @returns {Observable<any>}
   */
  blockUnblockUsers(command: string, email: string): Observable<any> {
    let url = this.portalApiUrl + `/admin/users/${command}/${email}`;
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json();
          console.log(response.json());
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET /api/v1/admin/sessions -> controllers.AdminController.getActiveSessions(max: Option[Int])
   *
   * @returns {Observable<UserSession[]>}
   */
  getActiveSessions(): Observable<UserSession[]> {
    let url = this.portalApiUrl + '/admin/sessions';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().sessions;
          if (<UserSession[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET /api/v1/admin/removesessions
   * -> controllers.AdminController.removeActiveSessions(token: String, email: String)
   *
   * @param {string} usersesiontoken
   * @param {string} email
   * @returns {Observable<any>}
   */
  removeActiveSessions(usersesiontoken: string, email: string): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.append('token', usersesiontoken);
    params.append('email', email);
    let url = this.portalApiUrl + `/admin/removesessions?token=${usersesiontoken}&email=${email}`;
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json();
          console.log(response.json());
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  // TODO GET /api/v1/admin/querysessions
  //    -> controllers.AdminController.queryActiveSessions(token: Option[String], max: Option[Int], email:
  // Option[String])

  /**
   * GET  /api/v1/admin/userfiles   -> controllers.AdminController.getAllUserFiles
   *
   * @returns {Observable<UserFile[]>}
   */
  getAllUserFiles(): Observable<UserFile[]> {
    let url = this.portalApiUrl + '/admin/userfiles';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().userfiles;
          if (<UserFile[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET  /api/v1/admin/usermetarecords        -> controllers.AdminController.getallUserMetaRecords
   *
   * @returns {Observable<UserMetaRecord[]>}
   */
  getallUserMetaRecords(): Observable<UserMetaRecord[]> {
    let url = this.portalApiUrl + '/admin/usermetarecords';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().metarecords;
          if (<UserMetaRecord[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET  /api/v1/admin/requestlogs  -> controllers.AdminController.getallUserLinkLoggings(max: Option[Int])
   *
   * @returns {Observable<UserLinkLogging[]>}
   */
  getallUserLinkLoggings(): Observable<UserLinkLogging[]> {
    let url = this.portalApiUrl + '/admin/requestlogs';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().loglist;
          if (<UserLinkLogging[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  // TODO GET /api/v1/admin/queryrequestlogs
  //    -> controllers.AdminController.queryLinkLoggings(link: Option[String], max: Option[Int] = 100, email:
  // Option[String]) TODO GET  /api/v1/admin/users/:command/:email  ->
  // controllers.AdminController.blockUnblockUsers(command: String, email: String)

  /**
   * GET   /api/v1/admin/groups   -> controllers.AdminController.getAllUserGroups
   *
   * @returns {Observable<UserGroup[]>}
   */
  getAllUserGroups(): Observable<UserGroup[]> {
    // add authorization header with jwt token
    let url = this.portalApiUrl + '/admin/groups';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(url, options)
      .map(
        ( response: Response ) => {
          let datajson = response.json() && response.json().usergroups;
          if (<UserGroup[]>datajson) {
            console.log(response.json());
          }
          return datajson;
        }
      )
      .catch(this.handleHttpFailure);
  }

  // TODO POST /api/v1/admin/groups/create   -> controllers.AdminController.createUserGroupAsAdmin
  // TODO POST /api/v1/admin/groups/update   -> controllers.AdminController.updateUserGroupAsAdmin
  // TODO POST /api/v1/admin/groups/delete   -> controllers.AdminController.deleteUserGroupAsAdmin

  // TODO POST /api/v1/admin/sparql/update   -> controllers.AdminController.sparqleUpdateCollection

  /**
   *
   * @param errorResponse
   * @returns {any}
   */
  private handleHttpFailure( errorResponse: Response ) {
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
}
