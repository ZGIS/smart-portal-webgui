import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../notifications';
import { OwcContext, CollectionsService } from './';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sac-gwh-collection',
  templateUrl: 'collections.component.html',
  styleUrls: [ 'collections.component.css' ],
})

/**
 * Shows collections of the current user
 */
export class CollectionsComponent {
  @Input() myCollection: OwcContext;
  @Output() reloadOnChangedCollection: EventEmitter<any> = new EventEmitter<any>();

  reloadCollection(): void {
    console.log('we reload this collection');
  }

  editProperties(): void {
    console.log('we edit the properties');
    this.reloadOnChangedCollection.emit(true);
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Editing of this collection, not yet implemented.`
    });
  }

  deleteCollection(): void {
    console.log('we delete the Collection');
    this.collectionsService.deleteCollectionById(this.myCollection.id).subscribe(
      deleted => {
        console.log('deleted ' + deleted);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `This collection has been deleted, reloading.`
        });
        this.reloadOnChangedCollection.emit(true);
        this.router.navigateByUrl('/workbench/my-data');
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  /**
   * Constructor
   *
   * @param {CollectionsService} collectionsService
   * @param {NotificationService} notificationService
   * @param {Router} router
   */
  constructor(private collectionsService: CollectionsService,
              private notificationService: NotificationService,
              private router: Router) {
  }

}
