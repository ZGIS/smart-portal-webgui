import { Component, Input, OnInit } from '@angular/core';
import { OwcOffering } from './collections';

@Component({
  selector: 'app-sac-gwh-owcoffering',
  templateUrl: 'owc-offering.component.html',
  styleUrls: [ 'owc-offering.component.css' ]
})

export class OwcOfferingComponent implements OnInit {
  @Input() owcOffering: OwcOffering;

  owcOfferingStyleClasses = 'OwcOffering';
  owcOfferingType = 'OwcOffering';

  public readonly WmsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms';
  public readonly WfsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wfs';
  public readonly WcsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wcs';
  public readonly CswOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/csw';
  public readonly WpsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wps';
  public readonly GeoTiffOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/geotiff';
  public readonly SosOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/sos';

  ngOnInit(): void {
    switch (this.owcOffering.code) {
      case this.WmsOffering:
        this.owcOfferingType = 'WmsOffering';
        break;

      case this.WfsOffering:
        this.owcOfferingType = 'WfsOffering';
        break;

      case this.WcsOffering:
        this.owcOfferingType = 'WcsOffering';
        break;

      case this.CswOffering:
        this.owcOfferingType = 'CswOffering';
        break;

      case this.WpsOffering:
        this.owcOfferingType = 'WpsOffering';
        break;

      case this.GeoTiffOffering:
        this.owcOfferingType = 'GeoTiffOffering';
        break;

      case this.SosOffering:
        this.owcOfferingType = 'SosOffering';
        break;

    }
    this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', this.owcOfferingType);
  }

}
