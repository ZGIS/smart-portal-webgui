import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProfileJs, UserFile, UserMetaRecord } from '../account';
import { UserGroup, UserLinkLogging, UserSession } from './admin.types';
import { AdminService } from './';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-sac-gwh-admin',
  templateUrl: 'admin.component.html'
})

/**
 * Admin Component, create delete organisations, add remove users for organisations, delete / moderate general stuff
 */
export class AdminComponent implements OnInit {

  userlist: ProfileJs[] = [];
  userGroups: UserGroup[] = [];
  usersessions: UserSession[] = [];

  userFiles: UserFile[] = [];
  userMetaRecords: UserMetaRecord[] = [];
  userLinkLogs: UserLinkLogging[] = [];

  @ViewChild('userlistModalRef') public userlistModal: ModalDirective;
  @ViewChild('userGroupsModalRef') public userGroupsModal: ModalDirective;
  @ViewChild('usersessionsModalRef') public usersessionsModal: ModalDirective;
  @ViewChild('linkloggingModalRef') public linkloggingModal: ModalDirective;
  @ViewChild('userFilesModalRef') public userFilesModal: ModalDirective;
  @ViewChild('userMetaRecordsModalRef') public userMetaRecordsModal: ModalDirective;

  constructor( private _location: Location,
               private adminService: AdminService,
               private notificationService: NotificationService ) {
  }

  /**
   * Shows the Userlist modal
   */
  showUserlistModal() {
    this.userlistModal.show();
  }

  /**
   * hides the userlist modal
   */
  hideUserlistModal() {
    this.userlistModal.hide();
  }

  /**
   * shows the userGroups modal
   */
  showUserGroupsModal() {
    this.userGroupsModal.show();
  }

  /**
   * hides the userGroups modal
   */
  hideUserGroupsModal() {
    this.userGroupsModal.hide();
  }

  /**
   * shows the usersessions modal
   */
  showUsersessionsModal() {
    this.usersessionsModal.show();
  }

  /**
   * hides the usersessions modal
   */
  hideUsersessionsModal() {
    this.usersessionsModal.hide();
  }

  /**
   * shows the linkloggingModal modal
   */
  showLinkloggingModalModal() {
    this.linkloggingModal.show();
  }

  /**
   * hides the linkloggingModal modal
   */
  hideLinkloggingModalModal() {
    this.linkloggingModal.hide();
  }

  /**
   * shows the userFilesModal modal
   */
  showUserFilesModalModal() {
    this.userFilesModal.show();
  }

  /**
   * hides the userFilesModal modal
   */
  hideUserFilesModalModal() {
    this.userFilesModal.hide();
  }

  /**
   * shows the userMetaRecordsModal modal
   */
  showUserMetaRecordsModalModal() {
    this.userMetaRecordsModal.show();
  }

  /**
   * hides the userMetaRecordsModal modal
   */
  hideUserMetaRecordsModalModal() {
    this.userMetaRecordsModal.hide();
  }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    // get users
    this.adminService.getAllUsers()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: ProfileJs ) => {
            this.userlist.push(elem);
            console.log(elem.email);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // get groups
    this.adminService.getAllUserGroups()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: UserGroup ) => {
            this.userGroups.push(elem);
            console.log(elem.name);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // get sessions
    this.adminService.getActiveSessions()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: UserSession ) => {
            this.usersessions.push(elem);
            console.log(elem.email);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // get links logged requests
    this.adminService.getallUserLinkLoggings()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: UserLinkLogging ) => {
            this.userLinkLogs.push(elem);
            console.log(elem.email);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // get user files
    this.adminService.getAllUserFiles()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: UserFile ) => {
            this.userFiles.push(elem);
            console.log(elem.originalfilename);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    // get user metadata records
    this.adminService.getallUserMetaRecords()
      .subscribe(
        resultlist => {
          resultlist.forEach(( elem: UserMetaRecord ) => {
            this.userMetaRecords.push(elem);
            console.log(elem.originaluuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
