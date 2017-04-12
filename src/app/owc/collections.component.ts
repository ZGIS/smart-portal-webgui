import { Component, Input } from '@angular/core';
import { NotificationService } from '../notifications';
import { IOwcDocument, CollectionsService } from './';

@Component({
  selector: 'app-sac-gwh-collection',
  templateUrl: 'collections.component.html'
})

/**
 * Shows collections of the current user
 */
export class CollectionsComponent {
  @Input() myCollection: IOwcDocument;


  reloadCollection(): void {
    console.log('we reload this collection');
  }

  editProperties(): void {
    console.log('we edit the properties');
  }


  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param notificationService - injected NotificationService
   */
  constructor(private collectionsService: CollectionsService,
              private notificationService: NotificationService) {
  }

}
