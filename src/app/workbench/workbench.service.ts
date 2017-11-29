import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';
import { AccountService } from '../account';
import { IErrorResult } from '../search/result';
import { LocalBlobInfo, UserFile, UserFileResponse, UserMetaRecord, ValueEntry } from '.';
import { CswTransactionResponse, GeoMetadata } from './.';

@Injectable()
export class WorkbenchService {
  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private http: Http, private router: Router,
               private accountService: AccountService ) {
  }

  /**
   * POST -> /api/v1/csw/insert -> controllers.CswController.insertMetadataRecord
   *
   * @param {GeoMetadata} metadata
   * @returns {Observable<CswTransactionResponse>}
   */
  insertMetadataRecord( metadata: GeoMetadata ): Observable<CswTransactionResponse> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    return this.http.post(this.portalApiUrl + '/csw/insert', { metadata: metadata }, options)
      .map(( response ) => {
        console.log(response.toString());
        console.log(response.json());
        return <CswTransactionResponse>(response.json() || { type: '', message: '' });
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * POST -> /api/v1/csw/update -> controllers.CswController.updateMetadataRecord
   *
   * @param {GeoMetadata} metadata
   * @returns {Observable<CswTransactionResponse>}
   */
  updateMetadataRecord( metadata: GeoMetadata ): Observable<CswTransactionResponse> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    return this.http.post(this.portalApiUrl + '/csw/update', { metadata: metadata }, options)
      .map(( response ) => {
        console.log(response.toString());
        console.log(response.json());
        return <CswTransactionResponse>(response.json() || { type: '', message: '' });
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * POST -> /api/v1/csw/delete/:uuid -> controllers.CswController.deleteMetadataRecord(uuid: String)
   *
   * @param {string} originaluuid
   * @returns {Observable<CswTransactionResponse>}
   */
  deleteMetadatarecord( originaluuid: string ): Observable<CswTransactionResponse> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    return this.http.get(this.portalApiUrl + '/csw/delete/' + originaluuid, options)
      .map(( response ) => {
        console.log(response.toString());
        console.log(response.json());
        return <CswTransactionResponse>(response.json() || { type: '', message: '' });
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET -> /api/v1/csw/usermetarecords -> controllers.CswController.getUserMetaRecords
   *
   * @returns {Observable<UserMetaRecord[]>}
   */
  getUserMetaRecords(): Observable<UserMetaRecord[]> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    return this.http.get(this.portalApiUrl + '/csw/usermetarecords', options)
      .map(( response ) => {
        console.log(response.toString());
        console.log(response.json());
        let datajson = response.json() && response.json().metarecords;
        if (<UserMetaRecord[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET -> /api/v1/csw/get-valid-values-for/:topic
   *  -> controllers.CswController.getValidValuesFor(topic: String)
   *
   * @param {string} topic
   * @returns {Observable<ValueEntry>}
   */
  loadValidValuesForTopic( topic: string ): Observable<ValueEntry> {
    return this.http.get(this.portalApiUrl + '/csw/get-valid-values-for/' + topic)
      .map(( response: Response ) => {
        console.log(`response for ${topic}`);
        if (<ValueEntry>response.json()) {
          console.log(response.json());
        }
        let tmpValidValues = <ValueEntry>response.json();
        if (!tmpValidValues.descriptions || tmpValidValues.descriptions.length === 0) {
          tmpValidValues.descriptions = tmpValidValues.values;
        }
        return tmpValidValues;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }


  // TODO the GROUPS stuff
  // TODO GET  /api/v1/admin/groups   -> controllers.AdminController.getAllUserGroupAsAdmin
  // TODO POST /api/v1/admin/groups/create   -> controllers.AdminController.createUserGroupAsAdmin
  // TODO POST /api/v1/admin/groups/update   -> controllers.AdminController.updateUserGroupAsAdmin
  // TODO POST /api/v1/admin/groups/delete   -> controllers.AdminController.deleteUserGroupAsAdmin


  /**
   * GET -> /api/v1/files/getDownloadLink/:uuid -> controllers.FilesController.mappedFileLinkFor(uuid: String)
   * @param {string} uuid
   * @returns {Observable<string>}
   */
  getDownloadLink( uuid: string ): Observable<UserFileResponse> {
    let options = new RequestOptions({ withCredentials: true });
    let tsObservable = this.http.get(`${this.portalApiUrl}/files/getDownloadLink/${uuid}`, options)
      .map(( response ) => {
        console.log(response.json());
        return <UserFileResponse>response.json();
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));

    return tsObservable;
  }

  /**
   * does the actual http download request to the remote url
   *
   * @param {string} userFile
   * @returns {Observable<any>}
   */
  downloadFileService( userFile: UserFileResponse ): Observable<any> {
    let options = new RequestOptions({ withCredentials: true, responseType: ResponseContentType.Blob });
    return this.http.get(userFile.linkreference, options)
      .map(( response ) => {
        console.log(response.headers.toJSON());
        // return new Blob([response.blob()], { type: 'application/octet-stream' });
        return response;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET -> /api/v1/files/getRemoteFileInfo/:uuid -> controllers.FilesController.getBlobInfoForMappedLink(uuid: String)
   *
   * @param {string} uuid
   * @returns {Observable<LocalBlobInfo>}
   */
  getBlobInfoForMappedLink( uuid: string ): Observable<LocalBlobInfo> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    let tsObservable = this.http.get(`${this.portalApiUrl}/files/getRemoteFileInfo/${uuid}`, options)
      .map(( response ) => {
        console.log(response.json());
        let datajson = response.json() && response.json().blobinfo;
        if (<LocalBlobInfo>datajson) {
          console.log(JSON.stringify(datajson));
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));

    return tsObservable;
  }

  /**
   * GET -> /api/v1/files/deleteRemoteFile/:uuid -> controllers.FilesController.deleteBlobForMappedLink(uuid: String)
   *
   * @param {string} uuid
   * @returns {Observable<UserFileResponse>}
   */
  deleteBlobForMappedLink( uuid: string ): Observable<UserFileResponse> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });
    let tsObservable = this.http.get(`${this.portalApiUrl}/files/deleteRemoteFile/${uuid}`, options)
      .map(( response ) => {
        console.log(response.json());
        return <UserFileResponse>response.json();
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));

    return tsObservable;
  }

  /**
   * GET -> /api/v1/files/userfiles -> controllers.AdminController.getUserFiles
   *
   * @returns {Observable<UserFile[]>}
   */
  getUserFiles(): Observable<UserFile[]> {
    let params: URLSearchParams = new URLSearchParams();
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true, params: params });

    return this.http.get(this.portalApiUrl + '/files/userfiles', options)
      .map(( response ) => {
        console.log(response.toString());
        console.log(response.json());
        let datajson = response.json() && response.json().userfiles;
        if (<UserFile[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleError( errorResponse: Response ) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type') && errorResponse.headers.get('content-type').includes('\/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying backend: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResult.details });
    } else if (errorResponse.status === 0) {
      let message: String = `Unknown response status. Are you connected to the backend?`;
      return Observable.throw(<IErrorResult>{ message: message });
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResponse.text() });
    }
  }
}
