import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from '../notifications/notification.service';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Response, ResponseContentType } from '@angular/http';
import { PORTAL_API_URL } from '../in-app-config/app.tokens';
import { IErrorResult } from '../search/result';

let FileSaver = require('file-saver/FileSaver.js');

export interface UserFileResponse {
  status: string;
  linkreference: string;
  originalfilename: string;
}

/**
 * This component loads the file link for a uuid file reference and forwards to download
 */
@Component({
  selector: 'app-sac-gwh-context-fileload',
  templateUrl: 'fileloader.component.html'
})

export class FileLoaderComponent implements OnInit {

  isLoading = false;

  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private router: Router,
               private activatedRoute: ActivatedRoute,
               private notificationService: NotificationService,
               private ngZone: NgZone,
               private http: Http,
               private location: Location ) {
  }

  /**
   * initializes the component. Specifically reads the URL parameters and makes the search.
   */
  ngOnInit(): void {
    // parse values from
    this.activatedRoute.params.subscribe(( params: Params ) => {
      this.downloadFileExecute(params[ 'uuid' ]);
    });
  }

  backClicked() {
    this.location.back();
  }

  private downloadFileExecute( uuid: string ) {
    this.getDownloadLink(uuid).subscribe(
      userFileResponse => {
        const linkreference = userFileResponse.linkreference;
        const originalfilename = userFileResponse.originalfilename;

        this.downloadFileService(userFileResponse).subscribe(
          downloadResponse => {
            const contentType: string = downloadResponse.headers.get('content-type');
            const blob = new Blob([ downloadResponse._body ], { type: contentType });
            FileSaver.saveAs(blob, originalfilename);

            // let url = window.URL.createObjectURL(blob);
            // window.open(url);
          },
          ( error ) => {
            this.isLoading = false;
            console.log(error);
            this.notificationService.addErrorResultNotification({
              message: `Error while requesting Download for identifier ${uuid}: ${error.message}`,
              details: error.details
            });
          }
        );
      },
      ( error ) => {
        this.isLoading = false;
        console.log(error);
        this.notificationService.addErrorResultNotification({
          message: `Error while requesting Download Link. ${error.message}`,
          details: error.details
        });
      }
    );
  }

  /**
   *
   * @param {string} uuid
   * @returns {Observable<string>}
   */
  private getDownloadLink( uuid: string ): Observable<UserFileResponse> {
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
  private downloadFileService( userFile: UserFileResponse ): Observable<any> {
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
   *
   * @param error
   * @returns {any}
   */
  private handleError( errorResponse: Response ) {
    console.log(errorResponse);
    this.isLoading = true;

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
