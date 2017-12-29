import { Location } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ProfileJs } from '../account';
import { UserGroup, UserLinkLogging, UserSession } from './admin.types';
import { AdminService } from './';
import { UserFile, UserMetaRecord } from '../workbench';
import { PORTAL_API_URL } from '../in-app-config';
import { CookieService } from 'ngx-cookie';
import { Headers, RequestOptions } from '@angular/http';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';
import { NotificationService } from '../notifications';

const activatedTokens: string[] = [ 'ACTIVE', 'PASSWORDRESET', 'EMAILVALIDATION' ];

const deactivatedTokens: string[] = [ 'BLOCKED', 'DELETED' ];

@Component({
  selector: 'app-sac-gwh-admin',
  templateUrl: 'admin.component.html',
  styleUrls: [ 'admin.component.css' ],
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

  uploader: FileUploader;
  hasBaseDropZoneOver = false;

  @ViewChild('userlistModalRef') public userlistModal: ModalDirective;
  @ViewChild('userGroupsModalRef') public userGroupsModal: ModalDirective;
  @ViewChild('usersessionsModalRef') public usersessionsModal: ModalDirective;
  @ViewChild('linkloggingModalRef') public linkloggingModal: ModalDirective;
  @ViewChild('userFilesModalRef') public userFilesModal: ModalDirective;
  @ViewChild('userMetaRecordsModalRef') public userMetaRecordsModal: ModalDirective;
  @ViewChild('uploadTermsModalRef') public uploadTermsModal: ModalDirective;

  constructor( private _location: Location,
               private adminService: AdminService,
               @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private cookieService: CookieService,
               private notificationService: NotificationService ) {
    let cookieToken = this.cookieService.get('XSRF-TOKEN');
    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': cookieToken
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});
    let fileUploader = new FileUploader({
      url: this.portalApiUrl + '/admin/sparql/update',
      authToken: cookieToken,
      authTokenHeader: 'X-XSRF-TOKEN',

    });
    this.uploader = fileUploader;

    this.uploader.onCompleteAll = () => {
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_FILE_UPLOADER,
        type: 'info',
        message: 'File uploaded, awaiting overall service update.'
      });

      let toRemove = this.uploader.queue.filter((item) => item.isSuccess);

      toRemove.forEach(item => this.uploader.removeFromQueue(item));
    };

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, responseHeaders: ParsedResponseHeaders) => {
      this.notificationService.addNotification({
        id: NotificationService.MSG_ID_FILE_UPLOADER,
        type: 'success',
        message: `File ${item.file.name}, awaiting overall service update.`
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

  /**
   * shows the uploadTermsModal modal
   */
  showUploadTermsModal() {
    this.uploadTermsModal.show();
  }

  /**
   * hides the uploadTermsModal modal
   */
  hideUploadTermsModal() {
    this.uploadTermsModal.hide();
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
            // console.log(elem.email);
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
            // console.log(elem.name);
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
            // console.log(elem.email);
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
            // console.log(elem.referer);
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
            // console.log(elem.originalfilename);
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
            // console.log(elem.originaluuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * basic check if user is active to be used as visual indicator
   *
   * @param {string} laststatustoken
   * @returns {boolean}
   */
  userStatusIsActive( laststatustoken: string ): boolean {
    let activeIsTrue = false;
    try {
      let tokentest = laststatustoken.split(':')[ 0 ];
      if (activatedTokens.find(v => v === tokentest)) {
        activeIsTrue = true;
      }
    } catch (e) {
      console.log(e);
    }
    return activeIsTrue;
  }

  /**
   * basic check if user is active to be used as visual indicator
   *
   * @param {string} laststatustoken
   * @returns {boolean}
   */
  userCanBeBlocked( laststatustoken: string ): boolean {
    let canBeBlocked = false;
    try {
      let tokentest = laststatustoken.split(':')[ 0 ];
      if (activatedTokens.find(v => v === tokentest)) {
        if (tokentest === 'ACTIVE') {
          canBeBlocked = true;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return canBeBlocked;
  }

  /**
   * basic check if user is BLOCKED and can be unblocked
   *
   * @param {string} laststatustoken
   * @returns {boolean}
   */
  userCanBeUnBlocked( laststatustoken: string ): boolean {
    let canBeUnBlocked = false;
    try {
      let tokentest = laststatustoken.split(':')[ 0 ];
      if (deactivatedTokens.find(v => v === tokentest)) {
        if (tokentest === 'BLOCKED') {
          canBeUnBlocked = true;
        }
      }
    } catch (e) {
      console.log(e);
    }
    return canBeUnBlocked;
  }

  blockUnblockUsers( command: string, email: string ): void {
    this.adminService.blockUnblockUsers(command, email)
      .subscribe(
        resultjson => {
          this.notificationService.addNotification(
            {
              type: 'success',
              message: `User ${email} has been ${command}(e)d.`,
              details: JSON.stringify(resultjson)
            });
          this.adminService.getAllUsers()
            .subscribe(
              resultlist => {
                this.userlist = [];
                resultlist.forEach(( elem: ProfileJs ) => {
                  this.userlist.push(elem);
                  // console.log(elem.email);
                });
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  removeActiveSessions( usersesiontoken: string, email: string ): void {
    this.adminService.removeActiveSessions(usersesiontoken, email)
      .subscribe(
        resultjson => {
          this.notificationService.addNotification(
            {
              type: 'success',
              message: `Session ${usersesiontoken} of User ${email} has been removed, forcing to re-login.`,
              details: JSON.stringify(resultjson)
            });
          this.adminService.getActiveSessions()
            .subscribe(
              resultlist => {
                this.usersessions = [];
                resultlist.forEach(( elem: UserSession ) => {
                  this.usersessions.push(elem);
                  // console.log(elem.email);
                });
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * get Extended File Info
   * @param {string} uuid
   */
  getExtendedFileInfo( uuid: string ): void {
    this.adminService.getBlobInfoForMappedLink(uuid)
      .subscribe(
        blobinfo => {
          console.log(blobinfo);
          this.notificationService.addNotification(
            {
              type: 'info',
              message:
              `BlobInfo: <br>file name: ${blobinfo.name};<br>ext. cloud link: ${blobinfo.mediaLink};` +
              `<br>file size: ${blobinfo.size}(kb);`,
              details: JSON.stringify(blobinfo),
              dismissAfter: 0
            });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
