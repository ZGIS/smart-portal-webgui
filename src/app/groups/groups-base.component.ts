import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { AccountService, ProfileJs } from '../account';
import { WorkbenchService } from '../workbench';
import { UserGroup, UserGroupUsersLevel } from '../admin';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from '../owc';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';

function _window(): any {
  // return the global native browser window object
  return window;
}

@Component({
  selector: 'app-sac-gwh-groups-base',
  templateUrl: 'groups-base.component.html'
})

export class GroupsBaseComponent implements OnInit {

  @ViewChild('createGroupModalRef') public createGroupModal: ModalDirective;
  @ViewChild('editGroupModalRef') public editGroupModal: ModalDirective;

  userGroups: UserGroup[] = [];
  editUserGroup: UserGroup;
  userProfile: ProfileJs;
  loading = false;
  newgroup: any = {};

  myCollections: OwcContext[];
  activeCollectionId = '';
  emailUserToAdd = '';
  readyForAddingUser = false;
  readyForAddingConllection = false;

  constructor( private accountService: AccountService,
               private workbenchService: WorkbenchService,
               private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.workbenchService.getUserGroups()
      .subscribe(
        groups => {
          groups.forEach(( g: UserGroup ) => {
            this.userGroups.push(g);
            console.log(g.uuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          this.myCollections = [];
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            if (!owcDoc.id.includes('context\/user')) {
              this.myCollections.push(owcDoc);
              // console.log(owcDoc.id);
            }
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  get nativeWindow(): any {
    return _window();
  }

  getUserRightsNameForNumber( level: number ): string {
    return this.workbenchService.nameForUserRightsLevelNumber(level);
  }

  /**
   * create a new group with yourself as first admin member
   * @param {string} name
   * @param {string} shortinfo
   */
  createGroup( name: string, shortinfo: string ): void {
    const templateUuid = this.collectionsService.getNewUuid();

    let mySelfFirstMember = <UserGroupUsersLevel> {
      usergroups_uuid: templateUuid,
      users_accountsubject: this.userProfile.accountSubject,
      userlevel: 2
    };

    let newGroup = <UserGroup> {
      uuid: templateUuid,
      name: name,
      shortinfo: shortinfo,
      laststatuschange: moment.utc().toISOString(),
      laststatustoken: 'CREATED',
      hasUsersLevel: [ mySelfFirstMember ],
      hasOwcContextsVisibility: []
    };

    this.workbenchService.createUsersOwnUserGroup(newGroup)
      .subscribe(
        group => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: 'A new group has been created and you have been added as a group admin.',
            details: `Created a new group, ${group.name}`
          });
          this.hideCreateGroupModal();
          this.reloadGroups();
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * shows the modal
   */
  showCreateGroupModal() {
    this.createGroupModal.show();
  }

  showEditGroupModal( userGroup: UserGroup ) {
    console.log(JSON.stringify(userGroup));
    this.editUserGroup = userGroup;
    if (this.editUserGroup && userGroup) {
      this.editGroupModal.show();
    }
  }

  /**
   * hides the modal
   */
  hideCreateGroupModal() {
    this.createGroupModal.hide();
  }

  hideEditGroupModal() {
    this.editGroupModal.hide();
  }

  reloadGroups(): void {
    this.workbenchService.getUserGroups()
      .subscribe(
        groups => {
          this.userGroups = [];
          groups.forEach(( g: UserGroup ) => {
            this.userGroups.push(g);
            console.log(g.uuid);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  myGroupLevel( editUserAccSub: string, editUserGroupHandle: UserGroup ): number {
    let userIsIn = editUserGroupHandle.hasUsersLevel.find(ug => ug.users_accountsubject === editUserAccSub);
    if (userIsIn) {
      return userIsIn.userlevel;
    } else {
      return 0;
    }
  }

  iamGroupAdmin( editUserAccSub: string, editUserGroupHandle: UserGroup ): boolean {
    return this.myGroupLevel(editUserAccSub, editUserGroupHandle) >= 2;
  }

  collectionIsAlreadyInGroup( collectionid: string, editUserGroupHandle: UserGroup ): boolean {
    let collectionIsIn = editUserGroupHandle.hasOwcContextsVisibility.find(owg => owg.owc_context_id === collectionid);
    if (collectionIsIn) {
      return true;
    } else {
      return false;
    }
  }

  deleteGroup(groupId: string): void {
    console.log('we delete the group');
    this.workbenchService.deleteUsersOwnUserGroup(groupId).subscribe(
      deleted => {
        // console.log('deleted ' + deleted);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `This group has been deleted, reloading.`
        });
        this.hideEditGroupModal();
        this.reloadGroups();
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }
}
