import { Component, OnInit, ViewChild } from '@angular/core';
import { AccountService, ProfileJs } from '../account';
import { WorkbenchService } from '../workbench';
import { UserGroup, UserGroupContextsVisibility, UserGroupUsersLevel } from '../admin';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from '../owc';
import { ModalDirective } from 'ngx-bootstrap';
import * as moment from 'moment';
import { OwcContextsRightsMatrix } from '../workbench/workbench.types';

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
  myRightsMatrix: OwcContextsRightsMatrix[] = [];

  activeCollectionId = '';
  emailUserToAdd = '';
  readyForAddingUser = false;
  readyForAddingConllection = false;

  constructor( private accountService: AccountService,
               private collectionsService: CollectionsService,
               private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.workbenchService.getUserGroups()
      .subscribe(
        groups => {
          groups.forEach(( g: UserGroup ) => {
            this.userGroups.push(g);
            // console.log(g.uuid);
          });
          this.userGroups.sort(( leftside, rightside ) => {
            if (leftside.name.toLowerCase() < rightside.name.toLowerCase()) {
              return -1;
            }
            if (leftside.name.toLowerCase() > rightside.name.toLowerCase()) {
              return 1;
            }
            return 0;
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

    this.workbenchService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          this.myRightsMatrix = [];
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            console.log(matrix);
          });
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
          this.myCollections.sort(( leftside, rightside ) => {
            if (leftside.properties.title.toLowerCase() < rightside.properties.title.toLowerCase()) {
              return -1;
            }
            if (leftside.properties.title.toLowerCase() > rightside.properties.title.toLowerCase()) {
              return 1;
            }
            return 0;
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
          this.newgroup = {};
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
            // console.log(g.uuid);
          });
          this.userGroups.sort(( leftside, rightside ) => {
            if (leftside.name.toLowerCase() < rightside.name.toLowerCase()) {
              return -1;
            }
            if (leftside.name.toLowerCase() > rightside.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.workbenchService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          this.myRightsMatrix = [];
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            console.log(matrix);
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

  isMyOwnNativeCoollection( editUserAccSub: string, collectionHandle: UserGroupContextsVisibility ): boolean {
    return this.myRightsMatrix.filter(m => {
      return m.owcContextId === collectionHandle.owc_context_id &&
        m.origOwnerAccountSubject === editUserAccSub;
    }).length > 0;
  }

  iamGroupAdmin( editUserAccSub: string, editUserGroupHandle: UserGroup ): boolean {
    return this.myGroupLevel(editUserAccSub, editUserGroupHandle) >= 2;
  }

  amiLastGroupAdmin( editUserAccSub: string, editUserGroupHandle: UserGroup ): boolean {
    let admin = this.myGroupLevel(editUserAccSub, editUserGroupHandle) >= 2;
    let howManyAdmins = editUserGroupHandle.hasUsersLevel.filter(ul => ul.userlevel >= 2).length;
    return admin && howManyAdmins === 1;
  }

  collectionIsAlreadyInGroup( collectionid: string, editUserGroupHandle: UserGroup ): boolean {
    let collectionIsIn = editUserGroupHandle.hasOwcContextsVisibility.find(owg => owg.owc_context_id === collectionid);
    if (collectionIsIn) {
      return true;
    } else {
      return false;
    }
  }

  myCollectionsGroupLevelPrivate( collectionid: string ): boolean {
    return this.myRightsMatrix.filter(m => {
      return m.owcContextId === collectionid && m.contextIntrinsicVisibility <= 0;
    }).length > 0;
  }

  deleteGroup( groupId: string ): void {
    if (this.iamGroupAdmin(this.userProfile.accountSubject, this.editUserGroup)) {
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
    } else {
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'warning',
        message: `You are not a group admin.`
      });
    }
  }

  isValidEmail( email: string ): boolean {
    console.log(email + ' ' + email.trim().length);
    // and pattern for email?
    if (email) {
      return email.trim().length > 0;
    } else {
      return false;
    }
  }

  addUserByEmail( myself: string ): void {
    if (this.isValidEmail(this.emailUserToAdd)) {
      this.loading = true;
      this.workbenchService.findUserForEmail(this.emailUserToAdd).subscribe(
        found => {
          if (this.editUserGroup.hasUsersLevel.findIndex(p => p.users_accountsubject === found.accountSubject) < 0 &&
            found.accountSubject !== myself) {
            let newGroupUserLevel: UserGroupUsersLevel = <UserGroupUsersLevel>{
              usergroups_uuid: this.editUserGroup.uuid,
              users_accountsubject: found.accountSubject,
              userlevel: 0
            };
            this.editUserGroup.hasUsersLevel.push(newGroupUserLevel);
            this.workbenchService.updateUsersOwnUserGroup(this.editUserGroup).subscribe(
              success => {
                this.notificationService.addNotification({
                  id: NotificationService.DEFAULT_DISMISS,
                  type: 'info',
                  message: `The user has been added, reloading.`
                });
                this.readyForAddingUser = false;
                this.emailUserToAdd = '';
                this.loading = false;
                this.hideEditGroupModal();
                this.reloadGroups();
              },
              error => {
                this.loading = false;
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
          } else {
            this.loading = false;
            this.notificationService.addNotification({
              id: NotificationService.DEFAULT_DISMISS,
              type: 'warning',
              message: `User to add is already a member.`
            });
          }
        },
        error => {
          this.loading = false;
          console.log(<any>error);
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'warning',
            message: `User couldn not be found.`
          });
        });
    } else {
      this.loading = false;
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'warning',
        message: `Not a valid user email to add.`
      });
    }
    this.readyForAddingUser = false;
    this.emailUserToAdd = '';
    this.loading = false;
  }

  removeUserFromGroup( users_accountsub: string ): void {
    // the editUserGroup is given, can only be successful on server if calling user has rights
    let fitered = this.editUserGroup.hasUsersLevel.filter(p => p.users_accountsubject !== users_accountsub);
    this.editUserGroup.hasUsersLevel = fitered;
    this.loading = true;
    this.workbenchService.updateUsersOwnUserGroup(this.editUserGroup).subscribe(
      success => {
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `The user has been removed, reloading.`
        });
        this.readyForAddingConllection = false;
        this.emailUserToAdd = '';
        this.loading = false;
        this.hideEditGroupModal();
        this.reloadGroups();
      },
      error => {
        this.loading = false;
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  updateUsersRightInGroup( users_accountsub: string, new_level: number ): void {
    let changed = this.editUserGroup.hasUsersLevel.map(lvl => {
      if (lvl.users_accountsubject === users_accountsub) {
        lvl.userlevel = new_level;
      }
      return lvl;
    });
    this.editUserGroup.hasUsersLevel = changed;
    this.loading = true;
    this.workbenchService.updateUsersOwnUserGroup(this.editUserGroup).subscribe(
      success => {
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `The user level has been updated, reloading.`
        });
        this.loading = false;
        this.hideEditGroupModal();
        this.reloadGroups();
      },
      error => {
        this.loading = false;
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  addCollectionToGroup( collectionHandle: string ): void {
    const isReallyMy = this.myRightsMatrix.filter(m => {
      return m.owcContextId === collectionHandle &&
        m.origOwnerAccountSubject === this.userProfile.accountSubject;
    }).length > 0;
    const nativeVis = this.myRightsMatrix.find(p => p.owcContextId === collectionHandle && p.contextIntrinsicVisibility > 0);
    if (this.editUserGroup.hasOwcContextsVisibility.findIndex(p => p.owc_context_id === collectionHandle) < 0 &&
      isReallyMy && nativeVis) {
      let newGroupContextsVisibility: UserGroupContextsVisibility = <UserGroupContextsVisibility>{
        usergroups_uuid: this.editUserGroup.uuid,
        owc_context_id: collectionHandle,
        visibility: nativeVis.contextIntrinsicVisibility
      };
      this.editUserGroup.hasOwcContextsVisibility.push(newGroupContextsVisibility);
      this.workbenchService.updateUsersOwnUserGroup(this.editUserGroup).subscribe(
        success => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The collection has been added, reloading.`
          });
          this.readyForAddingConllection = false;
          this.loading = false;
          this.hideEditGroupModal();
          this.reloadGroups();
        },
        error => {
          this.loading = false;
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
    } else {
      this.loading = false;
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'warning',
        message: `Collection to add is already a member,or not enabled to group-share.`
      });
    }
  }

  removeCollectionFromGroup( collectionHandle: UserGroupContextsVisibility ): void {
    // the editUserGroup is given, can only be successful on server if calling user has rights
    let fitered = this.editUserGroup.hasOwcContextsVisibility.filter(v => v.owc_context_id !== collectionHandle.owc_context_id);
    this.editUserGroup.hasOwcContextsVisibility = fitered;
    this.loading = true;
    this.workbenchService.updateUsersOwnUserGroup(this.editUserGroup).subscribe(
      success => {
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `The collection has been removed, reloading.`
        });
        this.readyForAddingConllection = false;
        this.loading = false;
        this.hideEditGroupModal();
        this.reloadGroups();
      },
      error => {
        this.loading = false;
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  getContextVisibilityForNumber( level: number ): string {
    return this.workbenchService.nameForContextVisibilityNumber(level);
  }

  iconClassForContextVisibilityNumber( level: number ): string {
    return this.workbenchService.iconClassForContextVisibilityNumber(level);
  }

  getUserRightsNameForNumber( level: number ): string {
    return this.workbenchService.nameForUserRightsLevelNumber(level);
  }

  iconClassForUserRightsLevelNumber( level: number ): string {
    return this.workbenchService.iconClassForUserRightsLevelNumber(level);
  }
}
