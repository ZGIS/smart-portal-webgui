import { Component, Input, OnInit } from '@angular/core';
import { ProfileJs } from '../account';
import { WorkbenchService } from '../workbench';
import { NotificationService } from '../notifications';

@Component({
  selector: 'app-sac-gwh-groupsuserdisplay',
  template: `
    <div class="userProfileDisplay" *ngIf="userProfile">
      <b>{{ userProfile.firstname}} {{ userProfile.lastname }}</b> / <i>{{ userProfile.email}}</i>
    </div>`,
})

export class GroupsUserDisplayComponent implements OnInit {

  @Input() usersAccountid: string;
  userProfile: ProfileJs;

  constructor( private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    console.log(this.usersAccountid);
    this.workbenchService.findUserForAccountSubject(this.usersAccountid)
      .subscribe(
        profile => {
          this.userProfile = <ProfileJs>profile;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
