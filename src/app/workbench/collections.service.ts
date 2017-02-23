import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
// import { BehaviorSubject } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../app.tokens';
import { AccountService } from '../account';
import { IOwcDocument } from './collections';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
import { NotificationService } from '../notifications';

@Injectable()
export class CollectionsService {

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router, private accountService: AccountService,
              private notificationService: NotificationService) {
  }

  getDefaultCollection(): Observable<IOwcDocument> {
    // add authorization header with jwt token
    let defaultCollectionsUri = this.portalApiUrl + '/collections/default';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({'X-XSRF-TOKEN': token});
    let options = new RequestOptions({headers: headers, withCredentials: true});

    // get default collection from api (should be exactly one OwcDocument)
    return this.http.get(defaultCollectionsUri, options)
      .map(
        (response: Response) => {
          // TODO SR the status at that point should always be 200!
          if (response.status === 200) {
            let userCollectionJson = response.json();
            if (<IOwcDocument>userCollectionJson) {
              console.log(userCollectionJson);
            }
            return response.json();
          } else {
            // indicates failed self retrieve
            this.notificationService.addNotification({
              type: 'warning',
              message: 'Error receiving collection'
            });
            return Observable.throw('Error receiving collection');
          }
        }
      )
      .catch(this.handleHttpFailure);
  };

  /**
   * get all uploaded files in user's default collection
   * @returns {Observable<R>}
   */
  getUploadedFilesFromDefaultCollection(filter?: String): Observable<Array<any>> {
    let defaultCollectionFilesUri = this.portalApiUrl + '/collections/default/files';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({'X-XSRF-TOKEN': token});
    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.get(defaultCollectionFilesUri, options)
      .map((response: Response) => {
        console.log('Files in DefaultCollection loaded');
        console.log(response.json());
        let filtered = response.json().filter((v, i, o) => v.properties.title.match(filter));
        return filtered;
      })
      .catch(this.handleHttpFailure);
  }

  /**
   * In case call failed, handle error
   * @param error
   * @returns {any}
   */
  // TODO SR complete makeover to this.notificationService.addErrorResultNotification()
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
      type: 'danger',
      message: errMsg
    });
    return Observable.throw(errMsg);
  };
}
