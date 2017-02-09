import { Inject, Component } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { NotificationService } from '../notifications';
import { FileUploader } from 'ng2-file-upload';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { PORTAL_API_URL } from '../app.tokens';

@Component({
  selector: 'app-sac-gwh-upload-basic',
  templateUrl: 'basic-fileupload.component.html',
  styleUrls: [ 'basic-fileupload.component.css' ]
})

/**
 *
 */
export class BasicFileUploadComponent {

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;

  /**
   *
   * @param portalApiUrl
   * @param notificationService
   * @param cookieService
   */
  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private cookieService: CookieService,
               private notificationService: NotificationService ) {

    let cookieToken = this.cookieService.get('XSRF-TOKEN');
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': cookieToken
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});
    let fileUploader = new FileUploader({
      url: this.portalApiUrl + '/files/uploadform',
      authToken: cookieToken,
      authTokenHeader: 'X-XSRF-TOKEN',

    });
    this.uploader = fileUploader;
  };

  public fileOverBase( e: any ): void {
    this.hasBaseDropZoneOver = e;
  }

}
