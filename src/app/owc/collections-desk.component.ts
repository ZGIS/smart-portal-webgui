import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { OwcContext, CollectionsService } from './';

@Component({
  selector: 'app-sac-gwh-collections-desk',
  templateUrl: 'collections-desk.component.html'
})

/**
 * Shows collections of the current user
 */
export class CollectionsDeskComponent implements OnInit {

  myCollections: OwcContext[] = [];
  private _myDefaultCollection: OwcContext;

  reloadCollections(): void {
    console.log('we reload collections');
  }

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
  ngOnInit(): void {
    // get owcDoc from secure api end point
    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          owcDocs.forEach((owcDoc: OwcContext) => {
            this.myCollections.push(owcDoc);
            console.log(owcDoc.id);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this._myDefaultCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }


}
