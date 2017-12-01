import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';
import { AccountService } from '../account';
import { OwcContext } from './';
import { IErrorResult } from '../search/result';
import { OwcLink, OwcResource } from './collections';

let UUID = require('uuid/uuid.js');

@Injectable()
export class CollectionsService {

  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private http: Http, private router: Router,
               private accountService: AccountService ) {
  }

  /**
   * sort of trying to get reliable UUIDs
   *
   * @returns {string}
   */
  getNewUuid(): string {
    let uuid = UUID(); // 'df7cca36-3d7a-40f4-8f06-ae03cc22f045'
    return uuid;
  }

  /**
   *
   * @returns {Observable<R|T>}
   */
  getDefaultCollection(): Observable<OwcContext> {
    // add authorization header with jwt token
    let defaultCollectionsUri = this.portalApiUrl + '/collections/default';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    // get default collection from api (should be exactly one OwcContext)
    return this.http.get(defaultCollectionsUri, options)
      .map(
        ( response: Response ) => {
          let userCollectionJson = response.json();
          if (<OwcContext>userCollectionJson) {
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
   * @param {string} id
   * @returns {Observable<OwcContext>}
   */
  getCollectionById( id: string ): Observable<OwcContext> {
    // add authorization header with jwt token
    let defaultCollectionsUri = this.portalApiUrl + '/collections?id=' + id;
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    // get default collection from api (should be exactly one OwcContext)
    return this.http.get(defaultCollectionsUri, options)
      .map(
        ( response: Response ) => {
          let userCollectionJson: OwcContext[] = response.json().collections;
          let count = response.json().count;
          if (count === 1 && userCollectionJson.length === 1) {
            console.log(userCollectionJson[ 0 ]);
            return userCollectionJson[ 0 ];
          } else {
            throw new ReferenceError('Not found, or more than one found, or you dont have rights');
          }
        }
      )
      .catch(this.handleHttpFailure);
  }

  getCollections(): Observable<OwcContext[]> {
    // add authorization header with jwt token
    let collectionsUri = this.portalApiUrl + '/collections';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    // get visible collections from api
    return this.http.get(collectionsUri, options)
      .map(
        ( response: Response ) => {
          let userCollectionJson = response.json() && response.json().collections;
          if (<OwcContext[]>userCollectionJson) {
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
  getUploadedFilesFromDefaultCollection( filtertoken?: string ): Observable<Array<OwcLink>> {
    let defaultCollectionFilesUri = this.portalApiUrl + '/collections/default/files';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(defaultCollectionFilesUri, options)
      .map(( response: Response ) => {
        console.log('Files in DefaultCollection loaded');
        let datalinks = response.json().datalinks as OwcLink[];
        console.log(datalinks);
        if (<OwcLink[]>datalinks) {
          return datalinks.filter(( o: OwcLink ) => o.title.match(filtertoken));
        } else {
          return [];
        }
      })
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections
   *   -> controllers.CollectionsController.insertCollection
   *     -> Ok(Json.obj("message" -> "owcContext inserted", "document" -> theDoc.toJson))
   *
   * insert a collection, the owcContext.id must not exist on the server or it will fail
   *
   * @param {OwcContext} owcContext
   * @returns {Observable<OwcContext>}
   */
  insertCollection( owcContext: OwcContext ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(defaultCollectionsUri, owcContext, options)
      .map(
        ( response: Response ) => {
          let insertedCollection = response.json().document;
          if (<OwcContext>insertedCollection) {
            console.log(insertedCollection);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET -> /api/v1/collections/requestnew
   *  -> controllers.CollectionsController.createNewCustomCollection
   * @returns {Observable<OwcContext>}
   */
  createNewCustomCollection(): Observable<OwcContext> {
    let collectionsUri = this.portalApiUrl + '/collections/requestnew';
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(collectionsUri, options)
      .map(
        ( response: Response ) => {
          let theCollection = response.json();
          if (<OwcContext>theCollection) {
            console.log(theCollection);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections/update
   *   -> controllers.CollectionsController.updateCollection
   *     -> Ok(Json.obj("message" -> "owcContext updated", "document" -> theDoc.toJson))
   *
   * update a collection, the owcContext.id must already exist on the server and user must own
   * or it will fail
   *
   * @param {OwcContext} owcContext
   * @returns {Observable<OwcContext>}
   */
  updateCollection( owcContext: OwcContext ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/update';
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(defaultCollectionsUri, owcContext, options)
      .map(
        ( response: Response ) => {
          let insertedCollection = response.json().document;
          if (<OwcContext>insertedCollection) {
            console.log(insertedCollection);
          }
          return insertedCollection;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET /api/v1/collections/delete
   *   -> controllers.CollectionsController.deleteCollection(id: String)
   *     -> Ok(Json.obj("message" -> "owcContext deleted", "document" -> owcContextId))
   *
   * delete specific collection that you have access to,
   * server will check that and either allow or fail the operation
   *
   * @param {string} collectionid
   * @returns {Observable<boolean>}
   */
  deleteCollectionById( collectionid: string ): Observable<boolean> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/delete';
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', collectionid);
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    return this.http.get(defaultCollectionsUri, options)
      .map(
        ( response: Response ) => {
          let checkedId = response.json().document;
          if (checkedId) {
            console.log(checkedId);
            if (checkedId === collectionid) {
              return true;
            } else {
              console.log('weird: ' + checkedId + ' not equal to ' + collectionid);
              return false;
            }
          } else {
            return false;
          }
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections/entry
   *   -> controllers.CollectionsController.addResourceToCollection(collectionid: String)
   *     -> Ok(Json.obj("message" -> "owcResource added to owcContext",
   *         "document" -> theDoc.toJson, "entry" -> owcResource.toJson))
   *
   * add a resource AS IS entry to a collection, the user must own the owccontext collection and the
   * resource id must not exist
   *
   * @param {string} collectionid
   * @param {OwcResource} owcResource
   * @returns {Observable<OwcContext>}
   */
  addResourceToCollection( collectionid: string, owcResource: OwcResource ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/entry';
    let token = this.accountService.token;
    let params: URLSearchParams = new URLSearchParams();
    params.set('collectionid', collectionid);
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    return this.http.post(defaultCollectionsUri, owcResource, options)
      .map(
        ( response: Response ) => {
          let updatedCollection = response.json().document;
          if (<OwcContext>updatedCollection) {
            console.log(updatedCollection);
          }
          return <OwcContext>updatedCollection;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections/entry
   *   -> controllers.CollectionsController.addResourceToCollection(collectionid: String)
   *     -> Ok(Json.obj("message" -> "owcResource added to owcContext",
   *         "document" -> theDoc.toJson, "entry" -> owcResource.toJson))
   *
   * add a resource entry to a collection, the user must own the owccontext collection and the
   * resource will be refreshed with a unique copy of server-side (not conflicts should happen on multiple re-use)
   *
   * @param {string} collectionid
   * @param {OwcResource} owcResource
   * @returns {Observable<OwcContext>}
   */
  addCopyOfResourceResourceToCollection( collectionid: string, owcResource: OwcResource ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/entry/copy';
    let token = this.accountService.token;
    let params: URLSearchParams = new URLSearchParams();
    params.set('collectionid', collectionid);
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    return this.http.post(defaultCollectionsUri, owcResource, options)
      .map(
        ( response: Response ) => {
          let updatedCollection = response.json().document;
          if (<OwcContext>updatedCollection) {
            console.log(updatedCollection);
          }
          return <OwcContext>updatedCollection;
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * POST /api/v1/collections/entry/replace
   *   -> controllers.CollectionsController.replaceResourceInCollection(collectionid: String)
   *     -> Ok(Json.obj("message" -> "owcResource replaced in owcContext",
   *     "document" -> theDoc.toJson, "entry" -> owcResource.toJson))
   *
   * update a resource entry in a colection, the collection and the resource must exist in that
   * constallation with the user owning them
   *
   * @param {string} collectionid
   * @param {OwcResource} owcResource
   * @returns {Observable<OwcContext>}
   */
  replaceResourceInCollection( collectionid: string, owcResource: OwcResource ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/entry/replace';
    let token = this.accountService.token;
    let params: URLSearchParams = new URLSearchParams();
    params.set('collectionid', collectionid);
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    return this.http.post(defaultCollectionsUri, owcResource, options)
      .map(
        ( response: Response ) => {
          let updatedCollection = response.json().document;
          if (<OwcContext>updatedCollection) {
            console.log(updatedCollection);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * GET /api/v1/collections/entry/delete
   *   -> controllers.CollectionsController.deleteResourceFromCollection(collectionid: String, resourceid: String)
   *     -> Ok(Json.obj("message" -> "owcResource removed from owcContext", "document" ->
   *     theDoc.toJson))
   *
   * delete a resource entry from a collection
   *
   * @param {string} collectionid
   * @param {string} resourceid
   * @returns {Observable<OwcContext>}
   */
  deleteResourceFromCollection( collectionid: string, resourceid: string ): Observable<OwcContext> {
    let defaultCollectionsUri = this.portalApiUrl + '/collections/entry/delete';
    let params: URLSearchParams = new URLSearchParams();
    params.set('collectionid', collectionid);
    params.set('resourceid', resourceid);
    let token = this.accountService.token;
    console.log('token: ' + token);
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });
    return this.http.get(defaultCollectionsUri, options)
      .map(
        ( response: Response ) => {
          let updatedCollection = response.json().document;
          if (<OwcContext>updatedCollection) {
            console.log(updatedCollection);
          }
          return response.json();
        }
      )
      .catch(this.handleHttpFailure);
  }

  /**
   * In case call failed, handle error
   * @param errorResponse
   * @returns {any}
   */
  private handleHttpFailure( errorResponse: Response | any ) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying ingester: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResult.details });
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResponse.text() });
    }
  }
}
