import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CookieService } from 'ngx-cookie';
import { PORTAL_API_URL } from '../in-app-config';
import { IErrorResult } from '../search/result';

/**
 *
 */
@Injectable()
export class AdminService {

  public token: string;

  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private http: Http, private router: Router,
               private cookieService: CookieService ) {

    this.token = this.cookieService.get('XSRF-TOKEN');
  }

  /**
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

    // get users from api
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
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
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
}
