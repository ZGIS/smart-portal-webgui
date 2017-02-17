import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IGeoFeature } from '../search/result';
import { source, format, layer, style, extent, control, Map, View, Extent } from 'openlayers';
import { isNullOrUndefined } from 'util';

export class Ol3MapExtent {
  bbox: Extent;
  bboxWkt: string;
}

@Component({
  selector: 'app-sac-gwh-ol3-map',
  template: '<div id="map" class="map"></div>',
  styleUrls: ['ol3-map.component.css']
})

/**
 * openlayers wrapper
 */
export class Ol3MapComponent implements OnInit {

  @Output() onBboxChange = new EventEmitter<Ol3MapExtent>();

  @Input() set mapExtent(bbox: Extent) {
    if (extent.isEmpty(bbox)) {
      this._mapExtent = this.nzExtent;
    } else {
      this._mapExtent = bbox;
    }

    if (this.map) {
      this.map.getView().fit(this._mapExtent, this.map.getSize());
    }
  }

  @Input() set searchResults(features: IGeoFeature[]) {
    if (!features || features.length === 0) {
      return;
    }

    this._features = features;
    this.vectorSource.clear();
    this.vectorSource.addFeatures((new format.GeoJSON()).readFeatures(this._features));
  }

  @Input() set highlightFeature(feature: IGeoFeature) {
    if (!this._features || this._features.length === 0) {
      return;
    }

    this.highlightSource.clear();
    console.log(feature);
    if (!isNullOrUndefined(feature)) {
      this.highlightSource.addFeature((new format.GeoJSON()).readFeature(feature));
    }
  }


  private vectorSource = new source.Vector({'wrapX': false});
  private highlightSource = new source.Vector({'wrapX': false});
  private _mapExtent: number[];
  private _features: IGeoFeature[];

  // TODO SR make this configurable in constructor
  private center: any = [174.7633, -36.8485];
  private nzExtent: any = [168, -50, 180, -33];
  private map: any;

  /*
   * private ESRI_STREET = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/' +
   'MapServer/tile/${z}/${y}/${x}.jpg';
   private ESRI_IMAGERY = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/' +
   'MapServer/tile/${z}/${y}/${x}.jpg';

   *  private ESRI_ATTRIBUTION1 = '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX,' +
   ' GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
   private const ESRI_ATTRIBUTION2 = '&copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, ' +
   'Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom,
   2012';
   */
  ngOnInit(): void {
    let vectorLayer = new layer.Vector({
      source: this.vectorSource,
      style: new style.Style({
        stroke: new style.Stroke({
          color: 'blue',
          lineDash: [4],
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
          lineDash: [1],
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
          extent: this.nzExtent
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
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: this.center,
        zoom: 5
      })
    });

    this.map.getView().fit(this._mapExtent, this.map.getSize());
    this.map.on('moveend', this.onMoveEnd, this);
  }

  /**
   * Gets the current map extent and normalizes it to WORLD if out of bounds.
   */
  private getMapExtent(): Ol3MapExtent {
    if (this.map) {
      let temp = this.map.getView().calculateExtent(this.map.getSize());

      if (Math.abs(temp[0] - temp[2]) >= 360) {
        temp[0] = -180;
        temp[2] = 180;
      }

      if (temp[1] < -90 || temp[1] > 90) {
        temp[1] = Math.sign(temp[1]) * 90;
      }
      if (temp[3] < -90 || temp[3] > 90) {
        temp[3] = Math.sign(temp[3]) * 90;
      }
      return <Ol3MapExtent> {
        bbox: temp,
        bboxWkt: `ENVELOPE(${temp[0]},${temp[2]},${temp[3]},${temp[1]})`
      };
    } else {
      return <Ol3MapExtent> {
        bbox: [-180, -90, 180, 90],
        bboxWkt: 'ENVELOPE(-180,180,90,-90)'
      };
    }
  }

  /**
   * Event Handler when map move ends. Fires BboxChange event to listeners
   */
  private onMoveEnd() {
    this._mapExtent = this.getMapExtent().bbox;
    this.onBboxChange.emit(this.getMapExtent());
  }

}
