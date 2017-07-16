import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';
import { AccountService } from '../account';
import { IOwcDocument } from './';
import { IErrorResult } from '../search/result';
import { IOwcLink } from './collections';

@Injectable()
export class CollectionsService {

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http, private router: Router,
              private accountService: AccountService) {
  }

  /**
   *
   * @returns {Observable<R|T>}
   */
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
          let userCollectionJson = response.json();
          if (<IOwcDocument>userCollectionJson) {
            console.log(userCollectionJson);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * get specific collection (that you have access to, server will filter reliably)
   *
   * @returns {Observable<R|T>}
   */
  getCollectionById(id: string): Observable<IOwcDocument> {
    // add authorization header with jwt token
    let defaultCollectionsUri = this.portalApiUrl + '/collections';
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({'X-XSRF-TOKEN': token});
    let options = new RequestOptions({headers: headers, withCredentials: true, params: params});

    // get default collection from api (should be exactly one OwcDocument)
    return this.http.get(defaultCollectionsUri, options)
      .map(
        (response: Response) => {
          let userCollectionJson = response.json();
          if (<IOwcDocument>userCollectionJson) {
            console.log(userCollectionJson);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  getCollections(): Observable<IOwcDocument[]> {
    // add authorization header with jwt token
    let collectionsUri = this.portalApiUrl + '/collections';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({'X-XSRF-TOKEN': token});
    let options = new RequestOptions({headers: headers, withCredentials: true});

    // get visible collections from api
    return this.http.get(collectionsUri, options)
      .map(
        (response: Response) => {
          let userCollectionJson = response.json() && response.json().collections;
          if (<IOwcDocument[]>userCollectionJson) {
            console.log(response.json().count);
          }
          return response.json().collections;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * get all uploaded files in user's default collection
   * getPersonalFilesFromDefaultCollection returns owc Data Links
   * @returns {Observable<R>}
   */
  getUploadedFilesFromDefaultCollection(filter?: string): Observable<IOwcLink[]> {
    let defaultCollectionFilesUri = this.portalApiUrl + '/collections/default/files';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({'X-XSRF-TOKEN': token});
    let options = new RequestOptions({headers: headers, withCredentials: true});

    return this.http.get(defaultCollectionFilesUri, options)
      .map((response: Response) => {
        console.log('Files in DefaultCollection loaded');
        console.log(response.json());
        let filtered = response.json().filter((o: IOwcLink) => o.title.match(filter));
        return filtered;
      })
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections
   *   -> controllers.CollectionsController.insertCollection
   *     -> Ok(Json.obj("message" -> "owcContext inserted", "document" -> theDoc.toJson))
   *
   * POST /api/v1/collections/update
   *   -> controllers.CollectionsController.updateCollection
   *     -> Ok(Json.obj("message" -> "owcContext updated", "document" -> theDoc.toJson))
   *
   * GET /api/v1/collections/delete
   *   -> controllers.CollectionsController.deleteCollection(id: String)
   *     -> Ok(Json.obj("message" -> "owcContext deleted", "document" -> owcContextId))
   *
   * POST /api/v1/collections/entry
   *   -> controllers.CollectionsController.addResourceToCollection(collectionid: String)
   *     -> Ok(Json.obj("message" -> "owcResource added to owcContext",
   *         "document" -> theDoc.toJson, "entry" -> owcResource.toJson))
   *
   * POST /api/v1/collections/entry/replace
   *   -> controllers.CollectionsController.replaceResourceInCollection(collectionid: String)
   *     -> Ok(Json.obj("message" -> "owcResource replaced in owcContext",
   *     "document" -> theDoc.toJson, "entry" -> owcResource.toJson))
   *
   * GET /api/v1/collections/entry/delete
   *   -> controllers.CollectionsController.deleteResourceFromCollection(collectionid: String, resourceid: String)
   *     -> Ok(Json.obj("message" -> "owcResource removed from owcContext", "document" ->
   *     theDoc.toJson))
   *
   */

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
  }
}
