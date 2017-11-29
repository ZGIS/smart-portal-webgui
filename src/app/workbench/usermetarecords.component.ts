import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { UserMetaRecord } from '.';
import { WorkbenchService } from './workbench.service';

@Component({
  selector: 'app-sac-gwh-usermetarecords',
  templateUrl: 'usermetarecords.component.html'
})

export class UsermetarecordsComponent implements OnInit {

  userMetaRecords: UserMetaRecord[] = [];

  constructor( private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.workbenchService.getUserMetaRecords()
      .subscribe(
        usermetarecords => {
          usermetarecords.forEach(( userMetaRecord: UserMetaRecord ) => {
            this.userMetaRecords.push(userMetaRecord);
            console.log(userMetaRecord.uuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  // TODO implement and add delete and reload to component

  reloadCollections(): void {
    this.workbenchService.getUserMetaRecords()
      .subscribe(
        usermetarecords => {
          this.userMetaRecords = [];
          usermetarecords.forEach(( userMetaRecord: UserMetaRecord ) => {
            this.userMetaRecords.push(userMetaRecord);
            console.log(userMetaRecord.uuid);
          });
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The user metarecords have been reloaded.`
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
    console.log('we reload user meta records collection');
  }

  /**
   * delete Metadata Record from catalogue
   * @param {string} originaluuid
   */
  deleteMetadataRecordFromCatalogue( originaluuid: string ): void {
    this.workbenchService.deleteMetadatarecord(originaluuid)
      .subscribe(
        cswTransactionResponse => {
          console.log(cswTransactionResponse);
          this.notificationService.addNotification(
            {
              type: 'success',
              message: 'Metadata Record deleted from catalogue, for details please expand.',
              details: JSON.stringify(cswTransactionResponse)
            });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
