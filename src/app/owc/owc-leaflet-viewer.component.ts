import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { ActivatedRoute } from '@angular/router';
import { OwcResource } from './collections';
import { IGeoFeature, IGeoFeatureCollection, IGeoFeatureProperties } from '../search';
import { AccountService } from '../account';
import { Location } from '@angular/common';
import { Feature, FeatureCollection, Polygon } from 'geojson';

import * as $ from 'jquery';
import { ModalDirective } from 'ngx-bootstrap/modal';

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

export interface MapActiveTracker {
  id: string;
  layer: any;
  active: boolean;
}

@Component({
  selector: 'app-sac-gwh-owc-viewer',
  templateUrl: 'owc-leaflet-viewer.component.html',
  styleUrls: [ 'owc-leaflet-viewer.component.css' ],
})

export class OwcLeafletViewerComponent implements OnInit, AfterViewInit {

  @ViewChild('featureInfoModalRef') public featureInfoModal: ModalDirective;
  @ViewChild('spanRef') public spanRef: ElementRef;
  myCollection: OwcContext;
  map: L.Map;
  activeLayers: MapActiveTracker[] = [];
  featureInfoNodes: any[] = [];

  BetterWMS = L.TileLayer.WMS.extend({

    viewRef: ElementRef,

    onAdd: function ( map: L.Map ) {
      // Triggered when the layer is added to a map.
      //   Register a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onAdd.call(this, map);
      map.on('click', this.getFeatureInfo, this);
    },

    onRemove: function ( map: L.Map ) {
      // Triggered when the layer is removed from a map.
      //   Unregister a click listener, then do all the upstream WMS things
      L.TileLayer.WMS.prototype.onRemove.call(this, map);
      map.off('click', this.getFeatureInfo, this);
    },

    getFeatureInfo: function ( evt: any ) {
      // Make an AJAX request to the server and hope for the best
      let url = this.getFeatureInfoUrl(evt.latlng),
        showResults = L.Util.bind(this.showGetFeatureInfo, this);
      // console.log(url);
      $.ajax({
        url: url,
        success: function ( data: any, status: any, xhr: any ) {
          let err = typeof data === 'string' ? null : data;
          showResults(err, evt.latlng, data);
        },
        error: function ( xhr, status, error ) {
          showResults(error);
        }
      });
    },

    getFeatureInfoUrl: function ( latlng: L.LatLng ) {
      let point = this._map.latLngToContainerPoint(latlng),
        size = this._map.getSize(),

        params = {
          request: 'GetFeatureInfo',
          service: 'WMS',
          srs: 'EPSG:4326',
          styles: this.wmsParams.styles,
          transparent: this.wmsParams.transparent,
          version: this.wmsParams.version,
          format: this.wmsParams.format,
          bbox: this._map.getBounds().toBBoxString(),
          height: size.y,
          width: size.x,
          layers: this.wmsParams.layers,
          query_layers: this.wmsParams.layers,
          info_format: 'text/html'
        };
      // params[ params.version === '1.3.0' ? 'i' : 'x' ] = point.x;
      // params[ params.version === '1.3.0' ? 'j' : 'y' ] = point.y;
      params[ 'x' ] = point.x;
      params[ 'y' ] = point.y;
      // console.log(point);
      return this._url + L.Util.getParamString(params, this._url, true);
    },

    showGetFeatureInfo: function ( err: any, latlng: L.LatLng, content: L.Content ) {
      if (err) {
        console.log(err);
        return;
      } // do nothing if there's an error

      // const contentHigh = L.Content(content);
      let elementRef = this.viewRef.nativeElement;
      console.log(elementRef.textContent);
      console.log(content);
      // Otherwise show the content in a popup, or something.
      // L.popup({ maxWidth: 600 })
      //   .setLatLng(latlng)
      //   .setContent(content)
      //   .openOn(this._map);
    }
  });

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
              const wmsLayer = new this.BetterWMS(baseUrl, {
                viewRef: this.spanRef,
                layers: wmsParams.layers,
                // styles: wmsParams.styles ? wmsParams.styles : null,
                format: wmsParams.format ? wmsParams.format : 'image/png',
                transparent: wmsParams.transparent ? wmsParams.transparent : 'true',
                version: wmsParams.version,
                attribution: `${owcResource.properties.title}`
              });
              // console.log(wmsLayer);
              prelim.push(wmsLayer);
              this.activeLayers.push(<MapActiveTracker>{ id: owcResource.id, layer: wmsLayer, active: true});
            } else {
              // console.log('not a WMS request ' + JSON.stringify(wmsParams));
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
    console.log('map ready');
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

  handleOnShown( $event: any ) {
    // console.log($event);
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
        message: '... layers and map setup (the map viewer feature is currently in development and currently has limited functionality)'
      });
    }
  }

  ngAfterViewInit() {
    let elementRef = this.spanRef.nativeElement;
    // outputs `template bindings={}`
    console.log(elementRef.textContent);
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
      path: parsedUri.path
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
      // console.log('builder not a WMS getmap');
    }
    if (builder.service === 'WMS' && builder.request === 'GetCapabilities' && <WmsGetMapQueryParams>builder) {
      return <WmsGetMapQueryParams>builder;
    } else {
      // console.log(builder);
      // console.log('builder not a WMS GetCapabilities');
    }
  }

  backClicked() {
    this._location.back();
  }

  eventChangeActive($event: any, owcResource: OwcResource): void {
    // console.log($event.target.checked);
    // console.log(owcResource.id);
    let idx = this.activeLayers.findIndex(act => act.id === owcResource.id);
    if (idx >= 0) {
      if ($event.target.checked) {
        this.map.addLayer(this.activeLayers[idx].layer);
      } else {
        this.map.removeLayer(this.activeLayers[idx].layer);
      }
      this.activeLayers[idx].active = !this.activeLayers[idx].active;
    }
  }
}
