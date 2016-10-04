import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IGeoFeature } from '../result';

declare var ol: any;

@Component({
  selector: 'sac-gwh-ol3-map',
  template: '<div id="map" class="map"></div>'
})

/**
 * openlayers wrapper
 */
export class Ol3MapComponent implements OnInit {

  // public members need to be declared before private ones -> TSLINT (member-ordering)
  vectorSource = new ol.source.Vector({});

  @Output() onBboxChange = new EventEmitter<string>();

  @Input() set searchResults(features: IGeoFeature[]) {
    if (!features || features.length === 0) {
      return;
    }

    this.vectorSource.clear();
    this.vectorSource.addFeatures((new ol.format.GeoJSON()).readFeatures(features));
  }

  // private ol: any;
  private center: any = [174.7633, 36.8485];

  private defaultExtent: any = [-180, -90, 180, 90]; // [165, -53.1, 360 - 175, -28.8];
  private map: any;

  // public member functions need to be declared before private ones -> TSLINT (member-ordering)
  ngOnInit(): void {
    let vectorLayer = new ol.layer.Vector({
      source: this.vectorSource,
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new ol.style.Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      })
    });

    this.map = new ol.Map({
      controls: ol.control.defaults({
        attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
          collapsible: false
        })
      }).extend([
        new ol.control.ZoomToExtent({
          extent: this.defaultExtent
        })
      ])
      ,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        vectorLayer
      ],
      target: 'map',
      view: new ol.View({
        projection: 'EPSG:4326',
        center: this.center,
        zoom: 5
      })
    });

    this.map.getView().fit(this.defaultExtent, this.map.getSize());
    this.map.on('moveend', this.onMoveend, this);
  }

  private getBboxWkt(): string {
    if (this.map) {
      let temp = this.map.getView().calculateExtent(this.map.getSize());
      if (Math.abs(temp[0] - temp[2]) >= 360) {
        temp[0] = -180;
        temp[2] = 180;
      } else {
        if (temp[0] < -180 || temp[0] > 180) {
          temp[0] = /*-1 * */Math.sign(temp[0]) * 180; // + temp[0] % 180;
        }
        if (temp[2] < -180 || temp[2] > 180) {
          temp[2] = /*-1 * */Math.sign(temp[2]) * 180; // + temp[2] % 180;
        }
      }

      if (temp[1] < -90 || temp[1] > 90) {
        temp[1] = Math.sign(temp[1]) * 90;
      }
      if (temp[3] < -90 || temp[3] > 90) {
        temp[3] = Math.sign(temp[3]) * 90;
      }
      return `ENVELOPE(${temp[0]},${temp[2]},${temp[3]},${temp[1]})`;
    } else {
      return 'ENVELOPE(-180,180,90,-90)';
    }
  }

  private onMoveend() {
    console.log('moveend');

    let bboxWkt = this.getBboxWkt();
    console.log(`${bboxWkt}`);
    this.onBboxChange.emit(bboxWkt);
  }

}
