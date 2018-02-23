import { Component, Input, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from '../owc';
import { ProfileJs } from '../account';

@Component({
  selector: 'app-sac-gwh-groupscontextdisplay',
  template: `
    <div *ngIf="theCollection" class="contextdisplayshort">
      <b>{{ theCollection.properties.title }}</b> <i class="fa fa-search" aria-hidden="true"
                                                    popover="{{ theCollection.properties.subtitle }}"></i>
    </div>`,
})

export class GroupsUserContextComponent implements OnInit {
  @Input() context_id: string;
  theCollection: OwcContext;

  constructor( private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.collectionsService.getCollectionById(this.context_id)
      .subscribe(
        owcDocs => {
          this.theCollection = <OwcContext>owcDocs;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
