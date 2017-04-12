import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';
import { AccountService } from '../account';
import { IOwcDocument } from './';
import { IErrorResult } from '../search/result';

@Injectable()
export class CollectionsService {

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router,
              private accountService: AccountService) {
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
          // if (response.status === 200) {
            let userCollectionJson = response.json();
            if (<IOwcDocument>userCollectionJson) {
              console.log(userCollectionJson);
            }
            return response.json();
          // } else {
          //   // indicates failed self retrieve
          //   this.notificationService.addNotification({
          //     type: 'warning',
          //     message: 'Error receiving collection'
          //   });
          //   return Observable.throw('Error receiving collection');
          // }
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
        let filtered = response.json().filter((v: any, i: any, o: any) => v.properties.title.match(filter));
        return filtered;
      })
      .catch(this.handleHttpFailure);
  }

  /**
   * In case call failed, handle error
   * @param errorResponse
   * @returns {any}
   */
  private handleHttpFailure(errorResponse: Response | any) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying ingester: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()});
    }
  };
}
