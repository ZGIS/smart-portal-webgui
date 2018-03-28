import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { Router } from '@angular/router';
import { OwcContextsRightsMatrix, WorkbenchService } from '../workbench';
import { Extent } from 'openlayers';
import { worldExtent } from '../ol3-map';
import { OwcResource } from './collections';
import { IGeoFeature, IGeoFeatureProperties } from '../search';
import { IGeoFeatureCollection } from '../search/result';

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

  worldExtent = worldExtent;

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

  getAsGeoFeatureCollection( owcList: OwcResource[] ): IGeoFeatureCollection {
    if (!owcList) {
      return <IGeoFeatureCollection> {
        type: 'FeatureCollection',
        crs: '',
        count: 0,
        countMatched: 0,
        features: []
      };
    }
    const features = <IGeoFeature[]>owcList.filter(( owc: OwcResource ) => {
        return owc.geometry;
      })
      .map(( owc: OwcResource ) => {
        return <IGeoFeature>{
          type: 'Feature',
          geometry: owc.geometry,
          properties: <IGeoFeatureProperties> {
            fileIdentifier: owc.id,
            title: owc.properties.title,
            linkage: [],
            origin: owc.properties.publisher
          }
        };
      });
    return <IGeoFeatureCollection> {
      type: 'FeatureCollection',
      crs: '',
      count: features.length,
      countMatched: features.length,
      features: features
    };
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
