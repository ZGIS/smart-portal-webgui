import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcResource } from './';
import { IGeoFeature, IGeoFeatureProperties } from '../search';
import { defaultNzExtent } from '../ol3-map';
import { IGeoFeatureCollection } from '../search/result';

let L = require('leaflet/dist/leaflet.js');

@Component({
  selector: 'app-sac-gwh-owcresource-detail-modal',
  templateUrl: 'owc-resource-detail-modal.component.html'
})

export class OwcResourceDetailModalComponent {
  @Input() owcResource: OwcResource;
  @Input() collectionid: string;
  @Input() viewOnly = true;

  @ViewChild('owcResourceDetailModalRef') public modal: ModalDirective;

  defaultNzExtent = defaultNzExtent;

  leafletOptions: any = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ]
  };

  getLeafletCentre(geojson: any): any {
    // let layer = L.geoJSON(geojson);
    // , {
    //   onEachFeature: this.leafletOnEachFeature
    // });
    // console.log(`layer = ${layer}`);
    let polygon = L.polygon(geojson.coordinates, {color: 'red'});
    // console.log(polygon);
    // console.log(polygon.getBounds());
    // console.log(`polygon.getBounds().getCenter() = ${polygon.getBounds().getCenter()}`);
    let reverseBounds = L.latLng({
      lat: polygon.getBounds().getCenter().lng,
      lng: polygon.getBounds().getCenter().lat
    });
    return reverseBounds;
  }

  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param notificationService - injected NotificationService
   */
  constructor( private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  showOwcResourceModal( owcFeature: OwcResource, owccontextid: string ) {
    if (owcFeature !== undefined && owccontextid !== undefined) {
      this.owcResource = owcFeature;
      this.collectionid = owccontextid;
      this.modal.show();
    }
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
      return <IGeoFeatureCollection> {
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
      properties: <IGeoFeatureProperties> {
        fileIdentifier: owc.id,
        title: owc.properties.title,
        linkage: [],
        origin: owc.properties.publisher
      }
    };
    return <IGeoFeatureCollection> {
      type: 'FeatureCollection',
      crs: '',
      count: 1,
      countMatched: 1,
      features: [feature]
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
}
