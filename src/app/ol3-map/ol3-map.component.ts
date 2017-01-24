import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IGeoFeature } from '../search/result';
import {
  source,
  format,
  layer,
  style,
  control,
  Map,
  View
} from 'openlayers';

// let ol = require('../../../node_modules/openlayers/dist/ol.js');
// declare var ol: any;

export class Ol3MapExtent {
  bbox: number[];
  bboxWkt: string;
}

@Component({
  selector: 'app-sac-gwh-ol3-map',
  template: '<div id="map" class="map"></div>'
})

/**
 * openlayers wrapper
 */
export class Ol3MapComponent implements OnInit {

  // public members need to be declared before private ones -> TSLINT (member-ordering)
  vectorSource = new source.Vector({'wrapX': false});


  @Output() onBboxChange = new EventEmitter<Ol3MapExtent>();

  @Input() set mapExtent(bbox: number[]) {
    if (this.map) {
      this.map.getView().fit(bbox, this.map.getSize());
    }
  }

  @Input() set searchResults(features: IGeoFeature[]) {
    if (!features || features.length === 0) {
      return;
    }

    this.vectorSource.clear();
    this.vectorSource.addFeatures((new format.GeoJSON()).readFeatures(features));
  }

  // private ol: any;
  private center: any = [174.7633, -36.8485];

  // TODO SR make this configuratble in "constructor"
  // private defaultExtent: any = [-180, -90, 180, 90];
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
  // public member functions need to be declared before private ones -> TSLINT (member-ordering)
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
        vectorLayer
      ],
      target: 'map',
      view: new View({
        projection: 'EPSG:4326',
        center: this.center,
        zoom: 5
      })
    });

    this.map.on('moveend', this.onMoveEnd, this);
  }

  /** get an object with the current map extent */
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

  private onMoveEnd() {
    let mapExtent = this.getMapExtent();
    this.onBboxChange.emit(mapExtent);
  }

}
