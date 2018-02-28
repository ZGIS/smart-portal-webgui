import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { Router } from '@angular/router';
import { OwcContextsRightsMatrix, WorkbenchService } from '../workbench';

let FileSaver = require('file-saver/FileSaver.js');

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
  @Input() visibility: OwcContextsRightsMatrix;
  @Input() viewOnly = true;
  @Output() reloadOnChangedCollection: EventEmitter<any> = new EventEmitter<any>();

  reloadCollection(): void {
    console.log('we reload this collection');
    this.reloadOnChangedCollection.emit(true);
  }

  editProperties(): void {
    // console.log('we edit the properties');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Editing of this collection, not yet implemented.`
    });
    this.reloadOnChangedCollection.emit(true);
  }

  changeVisibility( collectionid: string, visibility: number ): void {
    // console.log('we edit the properties');
    this.workbenchService.updateOwcContextVisibility(collectionid, visibility).subscribe(
      result => {
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `Changing visibility of this collection.` +
          `${collectionid} visibility level to ${this.getContextVisibilityForNumber(visibility)}`
        });
        this.reloadOnChangedCollection.emit(true);
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  /**
   * delete the collection
   */
  deleteCollection(): void {
    console.log('we delete the Collection');
    this.collectionsService.deleteCollectionById(this.myCollection.id).subscribe(
      deleted => {
        // console.log('deleted ' + deleted);
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
   * export to Json
   */
  exportCollectionToJson( collectionid: string ): void {
    this.collectionsService.getCollectionById(collectionid).subscribe(
      owcContext => {
        const blob = new Blob([ JSON.stringify(owcContext, null, ' ') ], { type: 'application/geojson' });
        FileSaver.saveAs(blob, `export-${collectionid}.geojson`);
      },
      error => {
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

  /**
   * Constructor
   *
   * @param {CollectionsService} collectionsService
   * @param {WorkbenchService} workbenchService
   * @param {NotificationService} notificationService
   * @param {Router} router
   */
  constructor( private collectionsService: CollectionsService,
               private workbenchService: WorkbenchService,
               private notificationService: NotificationService,
               private router: Router ) {
  }

}
