import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { UserFile } from '.';
import { WorkbenchService } from './workbench.service';

@Component({
  selector: 'app-sac-gwh-userfiles',
  templateUrl: 'userfiles.component.html'
})

export class UserFilesComponent implements OnInit {

  userFiles: UserFile[] = [];

  constructor( private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.workbenchService.getUserFiles()
      .subscribe(
        userFiles => {
          userFiles.forEach(( userFile: UserFile ) => {
            this.userFiles.push(userFile);
            console.log(userFile.uuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  // TODO implement and add delete and reload to component

  reloadCollections(): void {
    this.workbenchService.getUserFiles()
      .subscribe(
        userFiles => {
          this.userFiles = [];
          userFiles.forEach(( userFile: UserFile ) => {
            this.userFiles.push(userFile);
            console.log(userFile.uuid);
          });
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The user files have been reloaded.`
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
    console.log('we reload user file collection');
  }

  /**
   * FIXME moved to admin, not for normal users
   * get Extended File Info
   * @param {string} uuid
   */
  // getExtendedFileInfo( uuid: string ): void {
  //   this.workbenchService.getBlobInfoForMappedLink(uuid)
  //     .subscribe(
  //       blobinfo => {
  //         console.log(blobinfo);
  //         this.notificationService.addNotification(
  //           { type: 'info', message: 'BlobInfo, please expand.', details: JSON.stringify(blobinfo), dismissAfter: 0 });
  //       },
  //       error => {
  //         console.log(<any>error);
  //         this.notificationService.addErrorResultNotification(error);
  //       });
  // }

  /**
   * delete File From Portal Storage
   * @param {string} uuid
   */
  deleteFileFromPortalStorage( uuid: string ): void {
    this.workbenchService.deleteBlobForMappedLink(uuid)
      .subscribe(
        userFileResponse => {
          console.log(userFileResponse);
          this.notificationService.addNotification(
            {
              type: 'success',
              message: 'File deleted, for details please expand.',
              details: JSON.stringify(userFileResponse)
            });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
