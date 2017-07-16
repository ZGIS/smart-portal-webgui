import { Inject, Component, Input } from '@angular/core';
import { Headers, RequestOptions } from '@angular/http';
import { NotificationService } from '../notifications';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { PORTAL_API_URL } from '../in-app-config';

@Component({
  selector: 'app-sac-gwh-upload-basic',
  templateUrl: 'basic-fileupload.component.html',
  styleUrls: [ 'basic-fileupload.component.css' ]
})

export class BasicFileUploadComponent {

  /** if true the "Show in My Collection" Button will be displayed */
  @Input() public showOpenCollectionBtn = true;

  public uploader: FileUploader;
  public hasBaseDropZoneOver = false;

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

    // this is a pretty fucked up method for listening to events.
    // TODO SR change the fileuploader module so that it has proper events to subscribe to
    this.uploader.onCompleteAll = () => {
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_FILE_UPLOADER,
        type: 'info',
        message: 'All files uploaded.'
      });

      let toRemove = this.uploader.queue.filter((item) => item.isSuccess);

      toRemove.forEach(item => this.uploader.removeFromQueue(item));
    };

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, responseHeaders: ParsedResponseHeaders) => {
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_FILE_UPLOADER,
        type: 'success',
        message: `File ${item.file.name} uploaded successfully.`
      });

      item.isSuccess = true;

      return {item, response, status, responseHeaders};
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, responseHeaders: ParsedResponseHeaders) => {
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_ERROR,
        type: 'danger',
        message: `Error on uploading file ${item.file.name}.`,
        details: response,
        dismissAfter: -1
      });

      item.isError = true;

      return {item, response, status, responseHeaders};
    };

  }

  public fileOverBase( e: any ): void {
    this.hasBaseDropZoneOver = e;
  }
}
