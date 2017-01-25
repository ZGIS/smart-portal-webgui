import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { IOwcDocument } from './';
import { CollectionsService } from './';



@Component({
  selector: 'app-sac-gwh-collections',
  templateUrl: 'collections.component.html',
  styleUrls: []
})

export class CollectionsComponent implements OnInit {

  myCollection: IOwcDocument;

  constructor(private collectionsService: CollectionsService,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    // get owcDoc from secure api end point
    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this.myCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addNotification({type: 'warning', message: error.toString()});
        });
  }
}
