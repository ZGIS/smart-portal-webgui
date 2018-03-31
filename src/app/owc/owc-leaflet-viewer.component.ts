import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { ActivatedRoute, Params } from '@angular/router';
import { OwcResource } from './collections';
import { IGeoFeature, IGeoFeatureCollection, IGeoFeatureProperties } from '../search';
import { AccountService } from '../account';
import { Location } from '@angular/common';
import { MapOptions, latLng, LatLng, tileLayer, geoJSON, GeoJSON, latLngBounds, Map } from 'leaflet';

// let L = require('leaflet/dist/leaflet.js');

@Component({
  selector: 'app-sac-gwh-owc-viewer',
  templateUrl: 'owc-leaflet-viewer.component.html',
  styleUrls: [ 'owc-leaflet-viewer.component.css' ],
})

export class OwcLeafletViewerComponent implements OnInit {
  myCollection: OwcContext;
  loading = true;
  map: Map;

  getLeafletOptions( owcContext: OwcContext ): MapOptions {
    let geojsonLayer: GeoJSON = geoJSON(owcContext, {
      style: function ( feature: GeoJSONFeature<GeoJSONPolygon> ) {
        return { color: 'blue' };
      }
    });

    return {
      layers: [
        tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        geojsonLayer
      ]
    };
  }

  onMapReady(map: Map, owcContext: OwcContext) {
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

  handleOnShown(event: any) {
    console.log(event);
    this.map.invalidateSize();
  }

  getLeafletCentre(bbox: number[]): LatLng {
    let corner1 = latLng({lat: bbox[1], lng: bbox[0]});
    let corner2 = latLng({lat: bbox[3], lng: bbox[2]});
    let bounds = latLngBounds([corner2, corner1]);
    return bounds.getCenter();
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

  constructor( private route: ActivatedRoute,
               private _location: Location,
               private accountService: AccountService,
               private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(({ owc }) => {
      this.myCollection = owc;
    });

    this.route.params.forEach(( params: Params ) => {

      let owcId = params[ 'id' ];

      this.accountService.isLoggedIn().subscribe(
        loggedInResult => {
          this.collectionsService.queryCollectionsForViewing(loggedInResult, owcId, [])
            .subscribe(
              collections => {
                if (collections.length > 0) {
                  this.myCollection = collections[0];
                }
              },
              ( error: any ) => {
                this.loading = false;
                this.notificationService.addErrorResultNotification(error);
              });
        },
        error => {
          console.log(<any>error);
        });
    });
  }

  backClicked() {
    this._location.back();
  }
}
