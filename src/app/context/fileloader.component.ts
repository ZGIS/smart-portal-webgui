import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { NotificationService } from '../notifications/notification.service';
import { WorkbenchService } from '../workbench/workbench.service';
import { PORTAL_API_URL } from '../in-app-config/app.tokens';

let FileSaver = require('file-saver/FileSaver.js');

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
               private activatedRoute: ActivatedRoute,
               private notificationService: NotificationService,
               private workbenchService: WorkbenchService,
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
    this.isLoading = true;
    this.workbenchService.getDownloadLink(uuid).subscribe(
      userFileResponse => {
        const linkreference = userFileResponse.linkreference;
        const originalfilename = userFileResponse.originalfilename;

        this.workbenchService.downloadFileService(userFileResponse).subscribe(
          downloadResponse => {
            this.isLoading = false;
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
}
