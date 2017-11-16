import { Inject, Component, Input, OnInit } from '@angular/core';
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

  reloadCollections(): void {
    console.log('we reload user file collection');
  }
}
