import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { ActivatedRoute } from '@angular/router';
import { OwcResource } from './collections';
import { IGeoFeature, IGeoFeatureCollection, IGeoFeatureProperties } from '../search';
import { AccountService } from '../account';
import { Location } from '@angular/common';
import { Feature, FeatureCollection, Polygon } from 'geojson';

const L = require('leaflet/dist/leaflet.js');
const URI = require('urijs/src/URI');
const URITemplate = require('urijs/src/URITemplate');

export interface ParsedUri {
  protocol?: string;
  username?: string;
  password?: string;
  hostname?: string;
  port?: string;
  path?: string;
  query?: OwsGetQueryParameters;
  fragment?: string;
}

export interface OwsGetQueryParameters {
  href: string;
  request: string;
  service: string;
  version: string;
}

export interface WmsGetMapQueryParams extends OwsGetQueryParameters {
  layers?: string;
  styles?: string;
  format?: string;
  transparent?: string;
  crs?: string;
  service: 'WMS';
}

@Component({
  selector: 'app-sac-gwh-owc-viewer',
  templateUrl: 'owc-leaflet-viewer.component.html',
  styleUrls: [ 'owc-leaflet-viewer.component.css' ],
})

export class OwcLeafletViewerComponent implements OnInit {
  myCollection: OwcContext;
  map: L.Map;

  getLeafletOptions( owcContext: OwcContext ): L.MapOptions {
    let prelim: L.TileLayer[] = [];
    this.myCollection.features.forEach(owcResource => {
      owcResource.properties.offerings.forEach(owcOffering => {
        owcOffering.operations.forEach(op => {
          // console.log(op);
          let parsedUri = this.parseLayerUrl(op.href);
          if (op.method === 'GET' && owcOffering.code.toLowerCase() === 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms') {
            let wmsParams = this.parseLayerUrlForWms(parsedUri);
            if (wmsParams && wmsParams.request === 'GetMap' && wmsParams.service === 'WMS') {
              const baseUrl = wmsParams.href;
              const wmsLayer = L.tileLayer.wms(baseUrl, {
                layers: wmsParams.layers,
                // styles: wmsParams.styles ? wmsParams.styles : null,
                format: wmsParams.format ? wmsParams.format : 'image/png',
                transparent: wmsParams.transparent ? wmsParams.transparent : 'true',
                version: wmsParams.version,
                attribution: `${owcResource.properties.title}`
              });
              // console.log(wmsLayer);
              prelim.push(wmsLayer);
            } else {
              console.log('not a WMS request ' + wmsParams);
            }
          }
        });
      });
    });

    const geojsonLayer: L.GeoJSON = L.geoJSON(<FeatureCollection<Polygon>>owcContext, {
      style: function ( feature: Feature<Polygon> ) {
        return {
          color: 'blue',
          weight: 2,
          opacity: 0.8,
          fill: false
        };
      }
    });

    return {
      layers: [
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }),
        geojsonLayer
      ].concat(prelim)
    };
  }

  onMapReady( map: L.Map, owcContext: OwcContext ) {
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
    // console.log(event);
    this.map.invalidateSize();
  }

  getLeafletCentre( bbox: number[] ): L.LatLng {
    let corner1 = L.latLng({ lat: bbox[ 1 ], lng: bbox[ 0 ] });
    let corner2 = L.latLng({ lat: bbox[ 3 ], lng: bbox[ 2 ] });
    let bounds = L.latLngBounds([ corner2, corner1 ]);
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

    this.route.data.subscribe(( { owc } ) => {
      // console.log(`route resolved owc ${owc.id}`);
      this.myCollection = owc;
    });
  }

  ngOnInit(): void {
    if (this.myCollection.features.length <= 0) {
      console.log('no layers in the collection context?');
      this.notificationService.addNotification({
        type: 'info',
        message: 'no layers in the collection context?'
      });
      this._location.back();
    } else {
      // console.log('need to do all layers and map setup');
      this.notificationService.addNotification({
        type: 'info',
        message: 'need to do all layers and map setup'
      });
    }
  }

  parseLayerUrl( urlFragments: string ): ParsedUri {
    const parsed: ParsedUri = URI.parse(urlFragments);
    // console.log(parsed);
    return parsed;
  }

  parseLayerUrlForWms( parsedUri: ParsedUri ): WmsGetMapQueryParams {
    const parts = {
      protocol: parsedUri.protocol,
      username: parsedUri.username,
      password: parsedUri.password,
      hostname: parsedUri.hostname,
      port: parsedUri.port,
      path: parsedUri.path,
      query: null,
      fragment: null
    };
    const baseUrl = URI.build(parts);
    let builder: any = {};
    builder[ 'href' ] = baseUrl;
    // FIXME this needs to go eventually
    builder[ 'service' ] = 'WMS';
    // console.log(parsedUri.query);
    const qpar = URI.parseQuery(parsedUri.query);
    // console.log(qpar);

    if (qpar.service || qpar.SERVICE) {
      builder[ 'service' ] = qpar.service ? qpar.service : qpar.SERVICE;
    }
    if (qpar.request || qpar.REQUEST) {
      builder[ 'request' ] = qpar.service ? qpar.request : qpar.REQUEST;
    }
    if (qpar.version || qpar.VERSION) {
      builder[ 'version' ] = qpar.version ? qpar.version : qpar.VERSION;
    }
    if (qpar.layers || qpar.LAYERS) {
      builder[ 'layers' ] = qpar.layers ? qpar.layers : qpar.LAYERS;
    }
    if (qpar.styles || qpar.STYLES) {
      builder[ 'styles' ] = qpar.styles ? qpar.styles : qpar.STYLES;
    }
    if (qpar.format || qpar.FORMAT) {
      builder[ 'format' ] = qpar.format ? qpar.format : qpar.FORMAT;
    }
    if (qpar.transparent || qpar.TRANSPARENT) {
      builder[ 'transparent' ] = qpar.transparent ? qpar.transparent : qpar.TRANSPARENT;
    }
    // FIXME not sure if needed or let automatic by leaflet
    // if (qpar.crs || qpar.CRS) {
    //   builder[ 'crs' ] = qpar.crs ? qpar.crs : qpar.CRS;
    // }
    // if (qpar.srs || qpar.SRS) {
    //   builder[ 'crs' ] = qpar.srs ? qpar.service : qpar.SRS;
    // }
    if (builder.service === 'WMS' && builder.request === 'GetMap' && <WmsGetMapQueryParams>builder) {
      return <WmsGetMapQueryParams>builder;
    } else {
      // console.log(builder);
      console.log('builder not a WMS getmap');
    }
    if (builder.service === 'WMS' && builder.request === 'GetCapabilities' && <WmsGetMapQueryParams>builder) {
      return <WmsGetMapQueryParams>builder;
    } else {
      // console.log(builder);
      console.log('builder not a WMS GetCapabilities');
    }
  }

  backClicked() {
    this._location.back();
  }
}
