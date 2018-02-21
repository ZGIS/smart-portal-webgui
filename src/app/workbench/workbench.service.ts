import { Inject, Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response, ResponseContentType, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';
import { AccountService, ProfileJs } from '../account';
import { IErrorResult } from '../search';
import { LocalBlobInfo, UserFile, UserFileResponse, UserMetaRecord, ValueEntry } from '.';
import { CswTransactionResponse, GeoMetadata } from './.';
import { UserGroup } from '../admin';
import {
  ContextVisibility, ContextVisibilityIcon, OwcContextsRightsMatrix, UserRightsLevel,
  UserRightsLevelIcon
} from './workbench.types';

@Injectable()
export class WorkbenchService {
  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private http: Http,
               private accountService: AccountService ) {
  }

  /**
   * POST -> /api/v1/csw/insert -> controllers.CswController.insertMetadataRecord
   *
   * @param {GeoMetadata} metadata
   * @returns {Observable<CswTransactionResponse>}
   */
  insertMetadataRecord( metadata: GeoMetadata ): Observable<CswTransactionResponse> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(this.portalApiUrl + '/csw/insert', { metadata: metadata }, options)
      .map(( response ) => {
        // console.log(response.toString());
        // console.log(response.json());
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
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(this.portalApiUrl + '/csw/update', { metadata: metadata }, options)
      .map(( response ) => {
        // console.log(response.toString());
        // console.log(response.json());
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
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/csw/delete/' + originaluuid, options)
      .map(( response ) => {
        // console.log(response.toString());
        // console.log(response.json());
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
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/csw/usermetarecords', options)
      .map(( response ) => {
        // console.log(response.toString());
        // console.log(response.json());
        let datajson = response.json() && response.json().metarecords;
        if (<UserMetaRecord[]>datajson) {
          // console.log(response.json());
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
          // console.log(response.json());
        }
        let tmpValidValues = <ValueEntry>response.json();
        if (!tmpValidValues.descriptions || tmpValidValues.descriptions.length === 0) {
          tmpValidValues.descriptions = tmpValidValues.values;
        }
        return tmpValidValues;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  // # user GROUPS stuff api
  /**
   * GET    /api/v1/usergroups/query        controllers.UserGroupController.findUsersOwnUserGroupsById(id: String)
   * @param {string} id
   * @returns {Observable<UserGroup[]>}
   */
  findUsersOwnUserGroupsById( id: string ): Observable<UserGroup[]> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups/query', options)
      .map(( response ) => {
        let datajson = response.json() && response.json().usergroup;
        if (<UserGroup[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * POST    /api/v1/usergroups/update         controllers.UserGroupController.updateUsersOwnUserGroup
   * @param {UserGroup} userGroup
   * @returns {Observable<UserGroup>}
   */
  updateUsersOwnUserGroup( userGroup: UserGroup ): Observable<UserGroup> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(this.portalApiUrl + '/usergroups/update', userGroup, options)
      .map(( response ) => {
        let datajson = response.json() && response.json().usergroup;
        if (<UserGroup>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET   /api/v1/usergroups/delete         controllers.UserGroupController.deleteUsersOwnUserGroup(id: String)
   * @param {string} id
   * @returns {Observable<UserGroup[]>}
   */
  deleteUsersOwnUserGroup( id: string ): Observable<any> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('id', id);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups/delete', options)
      .map(( response ) => {
        return response.json() && response.json();
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * get users own particpating usergroups
   * GET    /api/v1/usergroups       controllers.UserGroupController.getUsersOwnUserGroups
   * @returns {Observable<UserGroup[]>}
   */
  getUserGroups(): Observable<UserGroup[]> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups', options)
      .map(( response ) => {
        let datajson = response.json() && response.json().usergroups;
        if (<UserGroup[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * Create a usergroup as post
   * POST  /api/v1/usergroups    controllers.UserGroupController.createUsersOwnUserGroup
   * @param {UserGroup} userGroup
   * @returns {Observable<UserGroup>}
   */
  createUsersOwnUserGroup( userGroup: UserGroup ): Observable<UserGroup> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.post(this.portalApiUrl + '/usergroups', userGroup, options)
      .map(( response ) => {
        let datajson = response.json() && response.json().usergroup;
        if (<UserGroup[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET -> /api/v1/files/getDownloadLink/:uuid -> controllers.FilesController.mappedFileLinkFor(uuid: String)
   * @param {string} uuid
   * @returns {Observable<string>}
   */
  getDownloadLink( uuid: string ): Observable<UserFileResponse> {
    let options = new RequestOptions({ withCredentials: true });
    let tsObservable = this.http.get(`${this.portalApiUrl}/files/getDownloadLink/${uuid}`, options)
      .map(( response ) => {
        // console.log(response.json());
        return <UserFileResponse>response.json();
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));

    return tsObservable;
  }

  /**
   * GET  /api/v1/usergroups/users    controllers.UserGroupController.resolveUserInfo
   * @param {string} accountSubject
   * @returns {Observable<ProfileJs>}
   */
  findUserForAccountSubject( accountSubject: string ): Observable<ProfileJs> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('accountSubject', accountSubject);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let url = this.portalApiUrl + '/usergroups/users' + '?accountSubject=' + accountSubject;
    let options = new RequestOptions({ headers: headers, withCredentials: true, search: params });

    return this.http.get(url, options)
      .map(( response ) => {
        let datajson = response.json() && response.json().user;
        if (<ProfileJs>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET  /api/v1/usergroups/users    controllers.UserGroupController.resolveUserInfo
   * @param {string} email
   * @returns {Observable<ProfileJs>}
   */
  findUserForEmail( email: string ): Observable<ProfileJs> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('email', email);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups/users', options)
      .map(( response ) => {
        let datajson = response.json() && response.json().user;
        if (<ProfileJs>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * get users own particpating usergroups
   * GET    /api/v1/usergroups/view-rights     controllers.UserGroupController.getOwcContextsRightsMatrixForUser
   * @returns {Observable<UserGroup[]>}
   */
  getOwcContextsRightsMatrixForUser(): Observable<OwcContextsRightsMatrix[]> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups/view-rights', options)
      .map(( response ) => {
        let datajson = response.json() && response.json().rights;
        if (<OwcContextsRightsMatrix[]>datajson) {
          console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET   /api/v1/usergroups/change-visibility
   * controllers.UserGroupController.updateOwcContextVisibility(owcContextId: String, userAccountSub: String, visibility: Int)
   *
   * @param {string} owcContextId
   * @param {string} userAccountSub
   * @param {number} visibility
   * @returns {Observable<boolean>}
   */
  updateOwcContextVisibility( owcContextId: string, visibility: number ): Observable<boolean> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('owcContextId', owcContextId);
    params.set('visibility', `${visibility}`);
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, params: params, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/usergroups/change-visibility', options)
      .map(( response ) => {
        let datajson = response.json() && response.json().status === 'OK' && response.json();
        console.log(response.json());
        return true;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
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
        // console.log(response.headers.toJSON());
        // return new Blob([response.blob()], { type: 'application/octet-stream' });
        return response;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * GET -> /api/v1/files/deleteRemoteFile/:uuid -> controllers.FilesController.deleteBlobForMappedLink(uuid: String)
   *
   * @param {string} uuid
   * @returns {Observable<UserFileResponse>}
   */
  deleteBlobForMappedLink( uuid: string ): Observable<UserFileResponse> {
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    let tsObservable = this.http.get(`${this.portalApiUrl}/files/deleteRemoteFile/${uuid}`, options)
      .map(( response ) => {
        // console.log(response.json());
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
    let token = this.accountService.token;
    let headers = new Headers({ 'X-XSRF-TOKEN': token });
    let options = new RequestOptions({ headers: headers, withCredentials: true });

    return this.http.get(this.portalApiUrl + '/files/userfiles', options)
      .map(( response ) => {
        // console.log(response.toString());
        // console.log(response.json());
        let datajson = response.json() && response.json().userfiles;
        if (<UserFile[]>datajson) {
          // console.log(response.json());
        }
        return datajson;
      })
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * userlevel 0 = read-only group member, 1 = participating context editing user, 2 = power-user/group-admin
   *
   * @param {number} level
   * @returns {string}
   */
  nameForUserRightsLevelNumber( level: number ): string {
    if (UserRightsLevel[ level ]) {
      return UserRightsLevel[ level ];
    } else {
      return UserRightsLevel[ 0 ];
    }
  }

  iconClassForUserRightsLevelNumber( level: number ): string {
    if (UserRightsLevelIcon[ level ]) {
      return UserRightsLevelIcon[ level ];
    } else {
      return UserRightsLevelIcon[ 0 ];
    }
  }

  /**
   * visibility 0: user-owned/private, 1: organisation/group-shared, 2: public
   *
   * @param {number} level
   * @returns {string}
   */
  nameForContextVisibilityNumber( level: number ): string {
    if (ContextVisibility[ level ]) {
      return ContextVisibility[ level ];
    } else {
      return ContextVisibility[ 0 ];
    }
  }

  iconClassForContextVisibilityNumber( level: number ): string {
    if (ContextVisibilityIcon[ level ]) {
      return ContextVisibilityIcon[ level ];
    } else {
      return ContextVisibilityIcon[ 0 ];
    }
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
