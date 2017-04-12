import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { IOwcDocument, CollectionsService } from './';

@Component({
  selector: 'app-sac-gwh-collections',
  templateUrl: 'collections.component.html'
})

/**
 * Shows collections of the current user
 */
export class CollectionsComponent implements OnInit {

  myCollection: IOwcDocument;

  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param notificationService - injected NotificationService
   */
  constructor(private collectionsService: CollectionsService,
              private notificationService: NotificationService) {
  }

  /**
   * OnInit - load current user's collections
   */
  ngOnInit() {
    // get owcDoc from secure api end point
    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this.myCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
