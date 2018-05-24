import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { Router } from '@angular/router';
import { OwcContextsRightsMatrix, WorkbenchService } from '../workbench';
import { OwcResource } from './collections';
import { IGeoFeature, IGeoFeatureCollection, IGeoFeatureProperties } from '../search';
import { ModalDirective } from 'ngx-bootstrap/modal';

let L = require('leaflet/dist/leaflet.js');
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
  @Output() editCollectionRequest: EventEmitter<any> = new EventEmitter<any>();
  @Output() showResourceDetails: EventEmitter<any> = new EventEmitter<any>();

  propertiesGroup = false;
  featuresGroup = true;

  map: any;

  getLeafletOptions( owcContext: OwcContext ): any {
    let geojsonLayer: any = L.geoJSON(owcContext, {
      style: function ( feature: any ) {
        return { color: 'blue' };
      }
    });

    return {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        geojsonLayer
      ]
    };
  }

  onMapReady( map: any, owcContext: OwcContext ) {
    this.map = map;
    // if (owcContext.features && owcContext.features.length > 0) {
    //   let foiArr: any[] = [];
    //   owcContext.features.forEach(owcResource => {
    //     let jsonPolygon = L.polygon(owcResource.geometry.coordinates);
    //     let bounds = jsonPolygon.getBounds();
    //     let corner1 = bounds.getSouthWest();
    //     let corner2 = bounds.getNorthEast();
    //     console.log(corner1);
    //     console.log(corner2);
    //     foiArr.push([corner1.lng, corner1.lat]);
    //     foiArr.push([corner2.lng, corner2.lng]);
    //   });
    //
    //   this.map.fitBounds(foiArr, {
    //     animate: true
    //   });
    // }
  }

  handleOnShown( event: any ) {
    console.log(event);
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  getLeafletCentre( bbox: number[] ): any {
    let corner1 = L.latLng({ lat: bbox[ 1 ], lng: bbox[ 0 ] });
    let corner2 = L.latLng({ lat: bbox[ 3 ], lng: bbox[ 2 ] });
    let bounds = L.latLngBounds([ corner2, corner1 ]);
    return bounds.getCenter();
  }

  reloadCollection(): void {
    console.log('we reload this collection');
    this.reloadOnChangedCollection.emit(true);
  }

  editProperties(): void {
    console.log('we edit the properties');
    this.editCollectionRequest.emit({ event: event, data: this.myCollection });
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

  emitShowResourceDetails( owcResource: OwcResource, collectionId: string ): void {
    this.showResourceDetails.emit({
      event: event,
      data: { owcResource: owcResource, collectionId: collectionId }
    });
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
