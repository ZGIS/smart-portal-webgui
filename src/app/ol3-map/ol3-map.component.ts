import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { IGeoFeature } from '../search/result';
import {
  control,
  Coordinate,
  extent,
  Extent,
  format,
  layer,
  Map,
  MapBrowserEvent,
  MapEvent,
  ObjectEvent,
  render,
  source,
  style,
  View
} from 'openlayers';
import { isNullOrUndefined } from 'util';

export class Ol3MapExtent {
  bbox: Extent;
  bboxWkt: string;
}

export const defaultNzCenter: Coordinate = [ 174.7633, -36.8485 ];
export const defaultNzExtent: Extent = [ 168, -50, 180, -33 ];
export const defaultNzZoom = 5;

export const worldCenter: Coordinate = [ 0, 0 ];
export const worldExtent: Extent = [ -180, -90, 180, 90 ];
export const worldZoom = 9;

@Component({
  selector: 'app-sac-gwh-ol3-map',
  template: '<div #mapRef [id]="mapDivId" class="map"></div>',
  styleUrls: [ 'ol3-map.component.css' ]
})

/**
 * openlayers wrapper
 */
export class Ol3MapComponent implements OnInit, AfterViewInit, OnChanges {

  mapDivId: string;

  @Output() onBboxChange = new EventEmitter<Ol3MapExtent>();

  @Output() onClick: EventEmitter<MapBrowserEvent>;
  @Output() onDblClick: EventEmitter<MapBrowserEvent>;
  @Output() onMoveEnd: EventEmitter<MapEvent>;
  @Output() onPointerDrag: EventEmitter<MapBrowserEvent>;
  @Output() onPointerMove: EventEmitter<MapBrowserEvent>;
  @Output() onPostCompose: EventEmitter<render.Event>;
  @Output() onPostRender: EventEmitter<MapEvent>;
  @Output() onPreCompose: EventEmitter<render.Event>;
  @Output() onPropertyChange: EventEmitter<ObjectEvent>;
  @Output() onSingleClick: EventEmitter<MapBrowserEvent>;

  @Input() mapDefaultCenter: Coordinate;
  @Input() mapDefaultExtent: Extent;
  @Input() mapDefaultZoom: number;

  @Input() set mapExtent( bbox: Extent ) {
    if (extent.isEmpty(bbox)) {
      console.log(`reset input extent.isEmpty '${defaultNzExtent}'`);
      this._mapExtent = this.mapDefaultExtent ? this.mapDefaultExtent : defaultNzExtent;
    } else {
      console.log(`set input extent bbox '${bbox}'`);
      this._mapExtent = bbox;
    }

    if (this.map) {
      console.log(`map.getView().fit() with '${this._mapExtent}'`);
      this.map.getView().fit(this._mapExtent, this.map.getSize());
    }
  }

  @Input() set searchResults( features: IGeoFeature[] ) {
    if (!features || features.length === 0) {
      return;
    }

    this._features = features;
    this.vectorSource.clear();
    this.vectorSource.addFeatures((new format.GeoJSON()).readFeatures(this._features));
  }

  @Input() set highlightFeature( feature: IGeoFeature ) {
    if (!this._features || this._features.length === 0) {
      return;
    }

    this.highlightSource.clear();
    // console.log(feature);
    if (!isNullOrUndefined(feature)) {
      this.highlightSource.addFeature((new format.GeoJSON()).readFeature(feature));
    }
  }

  @ViewChild('mapRef') private mapRef: ElementRef;

  private vectorSource = new source.Vector({ 'wrapX': false });
  private highlightSource = new source.Vector({ 'wrapX': false });
  private _mapExtent: Extent;
  private _features: IGeoFeature[];
  private map: Map;

  constructor() {
    this.mapDivId = this.guidGenerator();
    this.onClick = new EventEmitter<MapBrowserEvent>();
    this.onDblClick = new EventEmitter<MapBrowserEvent>();
    this.onMoveEnd = new EventEmitter<MapEvent>();
    this.onPointerDrag = new EventEmitter<MapBrowserEvent>();
    this.onPointerMove = new EventEmitter<MapBrowserEvent>();
    this.onPostCompose = new EventEmitter<render.Event>();
    this.onPostRender = new EventEmitter<MapEvent>();
    this.onPreCompose = new EventEmitter<render.Event>();
    this.onPropertyChange = new EventEmitter<ObjectEvent>();
    this.onSingleClick = new EventEmitter<MapBrowserEvent>();
  }

  /**
   * OnInit - load map and initalize OL3
   */
  ngOnInit(): void {
    this.mapDivId = this.guidGenerator();
    if (!this.mapDefaultExtent) {
      this.mapDefaultExtent = defaultNzExtent;
    }
    if (!this.mapDefaultCenter) {
      this.mapDefaultCenter = defaultNzCenter;
    }
    if (!this.mapDefaultZoom) {
      this.mapDefaultZoom = defaultNzZoom;
    }
    let vectorLayer = new layer.Vector({
      source: this.vectorSource,
      style: new style.Style({
        stroke: new style.Stroke({
          color: 'blue',
          lineDash: [ 4 ],
          width: 2
        }),
        fill: new style.Fill({
          color: 'rgba(0, 0, 255, 0.01)'
        })
      })
    });

    let highlightLayer = new layer.Vector({
      source: this.highlightSource,
      style: new style.Style({
        stroke: new style.Stroke({
          color: 'orange',
          lineDash: [ 1 ],
          width: 2
        }),
        fill: new style.Fill({
          color: 'rgba(255, 255, 0, 0.5)'
        })
      })
    });

    /** {olx.control.AttributionOptions} */
    this.map = new Map({
      controls: control.defaults().extend([
        new control.ZoomToExtent({
          extent: this.mapDefaultExtent
        })
      ])
      ,
      layers: [
        new layer.Tile({
          source: new source.OSM()
        }),
        vectorLayer,
        highlightLayer
      ],
      view: new View({
        projection: 'EPSG:4326',
        center: this.mapDefaultCenter,
        zoom: this.mapDefaultZoom
      })
    });
    // let elem = this.mapRef.nativeElement;
    this.map.setTarget(this.mapRef.nativeElement);
    this.map.getView().fit(this._mapExtent, this.map.getSize());

    this.map.on('moveend', this.doOnMoveEnd, this);

    this.map.on('click', ( event: MapBrowserEvent ) => this.onClick.emit(event));
    this.map.on('dblclick', ( event: MapBrowserEvent ) => this.onDblClick.emit(event));
    this.map.on('moveend', ( event: MapEvent ) => this.onMoveEnd.emit(event));
    this.map.on('pointerdrag', ( event: MapBrowserEvent ) => this.onPointerDrag.emit(event));
    this.map.on('pointermove', ( event: MapBrowserEvent ) => this.onPointerMove.emit(event));
    this.map.on('postcompose', ( event: render.Event ) => this.onPostCompose.emit(event));
    this.map.on('postrender', ( event: MapEvent ) => this.onPostRender.emit(event));
    this.map.on('precompose', ( event: render.Event ) => this.onPreCompose.emit(event));
    this.map.on('propertychange', ( event: ObjectEvent ) => this.onPropertyChange.emit(event));
    this.map.on('singleclick', ( event: MapBrowserEvent ) => this.onSingleClick.emit(event));
  }

  ngOnChanges( changes: SimpleChanges ) {
    let properties: { [ index: string ]: any } = {};
    if (!this.map) {
      return;
    }
    for ( let key in changes ) {
      if (changes.hasOwnProperty(key)) {
        properties[ key ] = changes[ key ].currentValue;
      }
    }
    console.log('changes detected in map, could react to new properties: ', properties);
    // this.map.setProperties(properties, false);
  }

  ngAfterViewInit() {
    // this.map.updateSize();
    console.log('olmap after view init');
  }

  /**
   * Gets the current map extent and normalizes it to WORLD if out of bounds.
   */
  private getMapExtent(): Ol3MapExtent {
    if (this.map) {
      let temp = this.map.getView().calculateExtent(this.map.getSize());

      if (Math.abs(temp[ 0 ] - temp[ 2 ]) >= 360) {
        temp[ 0 ] = -180;
        temp[ 2 ] = 180;
      }

      if (temp[ 1 ] < -90 || temp[ 1 ] > 90) {
        temp[ 1 ] = Math.sign(temp[ 1 ]) * 90;
      }
      if (temp[ 3 ] < -90 || temp[ 3 ] > 90) {
        temp[ 3 ] = Math.sign(temp[ 3 ]) * 90;
      }
      return <Ol3MapExtent> {
        bbox: temp,
        bboxWkt: `ENVELOPE(${temp[ 0 ]},${temp[ 2 ]},${temp[ 3 ]},${temp[ 1 ]})`
      };
    } else {
      return <Ol3MapExtent> {
        bbox: worldExtent,
        bboxWkt: 'ENVELOPE(-180,180,90,-90)'
      };
    }
  }

  /**
   * Event Handler when map move ends. Fires BboxChange event to listeners
   */
  private doOnMoveEnd( event: any ) {
    let tmpOl3Extent = this.getMapExtent();
    // console.log(`onMoveEnd tmpOl3Extent '${tmpOl3Extent.bbox.toString()}'`);
    this._mapExtent = tmpOl3Extent.bbox;
    this.onBboxChange.emit(tmpOl3Extent);
  }

  private guidGenerator(): string {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
  }

}
