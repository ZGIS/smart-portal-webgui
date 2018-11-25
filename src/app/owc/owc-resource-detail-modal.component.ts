import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext, OwcResource } from './';
import { IErrorResult, IGeoFeature, IGeoFeatureCollection, IGeoFeatureProperties } from '../search';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService } from '../account';

let L = require('leaflet/dist/leaflet.js');

@Component({
  selector: 'app-sac-gwh-owcresource-detail-modal',
  templateUrl: 'owc-resource-detail-modal.component.html'
})

export class OwcResourceDetailModalComponent implements OnInit {
  @Input() owcResource: OwcResource;
  @Input() collectionid: string;
  @Input() viewOnly = true;

  // this is the self modal
  @ViewChild('owcResourceDetailModalRef') public modal: ModalDirective;

  map: any;

  myCollections: OwcContext[] = [];
  loggedIn = false;
  activeCollectionId = '';

  ngOnInit(): void {
    this.accountService.isLoggedIn().subscribe(
      loggedInResult => {
        if (loggedInResult === true) {
          this.loggedIn = true;
          this.collectionsService.getCollections()
            .subscribe(
              owcDocs => {
                this.myCollections = [];
                owcDocs.forEach(( owcDoc: OwcContext ) => {
                  this.myCollections.push(owcDoc);
                  // console.log(owcDoc.id);
                });
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        } else {
          console.log('logged in? ' + loggedInResult);
        }
      },
      error => {
        console.log(<any>error);
        console.log('not logged in');
      });
  }

  getLeafletOptions( owcResource: OwcResource ): any {
    let geojsonLayer = L.geoJSON(owcResource, {
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

  getLeafletCentre( geojson: any ): any {
    let jsonPolygon = L.polygon(geojson.coordinates);
    let reverseBounds = L.latLng({
      lat: jsonPolygon.getBounds().getCenter().lng,
      lng: jsonPolygon.getBounds().getCenter().lat
    });
    return reverseBounds;
  }

  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param accountService - injected AccountService
   * @param notificationService - injected NotificationService
   */
  constructor( private collectionsService: CollectionsService,
               private accountService: AccountService,
               private notificationService: NotificationService ) {
  }

  showOwcResourceModal( owcFeature: OwcResource, owccontextid: string ) {
    if (owcFeature !== undefined && owccontextid !== undefined) {
      this.owcResource = owcFeature;
      this.collectionid = owccontextid;
      this.modal.show();
    }
  }

  onMapReady( map: any, owcResource: OwcResource ) {
    this.map = map;
    let jsonPolygon = L.polygon(owcResource.geometry.coordinates);
    console.log(owcResource);
    let bounds = jsonPolygon.getBounds();
    let corner1 = bounds.getSouthWest();
    let corner2 = bounds.getNorthEast();
    console.log(corner1);
    console.log(corner2);
    this.map.fitBounds([ [ corner1.lng, corner1.lat ], [ corner2.lng, corner2.lng ] ], {
      animate: true,
      maxZoom: 17
    });
  }

  handleOnShown() {
    this.map.invalidateSize();
  }

  hideOwcResourceModal() {
    this.modal.hide();
  }

  reloadResource(): void {
    // console.log('we reload this resource entry');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Refresh this resource entry, not yet implemented.`
    });
  }

  editProperties(): void {
    // console.log('we edit the properties');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Editing of this resource entry, not yet implemented.`
    });
  }

  getAsGeoFeatureCollection( owc: OwcResource ): IGeoFeatureCollection {
    if (!owc.geometry) {
      return <IGeoFeatureCollection>{
        type: 'FeatureCollection',
        crs: '',
        count: 0,
        countMatched: 0,
        features: []
      };
    }
    const feature = <IGeoFeature>{
      type: 'Feature',
      geometry: owc.geometry,
      properties: <IGeoFeatureProperties>{
        fileIdentifier: owc.id,
        title: owc.properties.title,
        linkage: [],
        origin: owc.properties.publisher
      }
    };
    return <IGeoFeatureCollection>{
      type: 'FeatureCollection',
      crs: '',
      count: 1,
      countMatched: 1,
      features: [ feature ]
    };
  }

  deleteResource(): void {
    // console.log('we delete this resource entry');
    this.collectionsService.deleteResourceFromCollection(this.collectionid, this.owcResource.id).subscribe(
      deleted => {
        // console.log('deleted ' + deleted);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `This resource entry has been deleted. Please reload your collections to reflect the update!`
        });
        // console.log('We need to reload the collection!');
        this.hideOwcResourceModal();
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });

  }

  // private leafletOnEachFeature(feature: any, layer: any): void {
  //   // does this feature have a property named popupContent?
  //   console.log(feature);
  // }

  copyToMyCollection( owcResource: OwcResource ) {
    if (this.activeCollectionId.length > 0) {
      this.collectionsService.addCopyOfResourceResourceToCollection(this.activeCollectionId, owcResource).subscribe(
        ( results: OwcContext ) => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            message: `Entry was successfully added to ${results.properties.title}.`,
            type: NotificationService.NOTIFICATION_TYPE_SUCCESS
          });
          // console.log('We need to reload the collection!');
        }, ( error: IErrorResult ) => {
          this.notificationService.addErrorResultNotification(error);
        });
    } else {
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        message: `Please select a collection to which you would to add this to!`,
        type: NotificationService.NOTIFICATION_TYPE_WARNING
      });
    }
  }

}
