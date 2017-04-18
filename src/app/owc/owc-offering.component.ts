import { Component, Input, OnInit } from '@angular/core';
import { IOwcOffering } from './collections';

// IOwcOperation, IOwcPostRequestConfig, IOwcRequestResult

@Component({
  selector: 'app-sac-gwh-owcoffering',
  templateUrl: 'owc-offering.component.html',
  styleUrls: [ 'owc-offering.component.css' ]
})

export class OwcOfferingComponent implements OnInit {
  @Input() owcOffering: IOwcOffering;

  owcOfferingStyleClasses = 'OwcOffering';
  owcOfferingType = 'OwcOffering';

  // wms|wmts|wfs|wcs|csw|wps|gml|kml|geotiff|sos|netcdf|http-link
  public readonly WmsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wms';
  public readonly WmtsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wmts';
  public readonly WfsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wfs';
  public readonly WcsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wcs';
  public readonly CswOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/csw';
  public readonly WpsOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/wps';
  public readonly GmlOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/gml';
  public readonly KmlOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/kml';
  public readonly GeoTiffOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/geotiff';
  public readonly SosOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/sos';
  public readonly NetCdfOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/netcdf';
  public readonly HttpLinkOffering = 'http://www.opengis.net/spec/owc-geojson/1.0/req/http-link';

  ngOnInit(): void {
    switch (this.owcOffering.code) {
      case this.WmsOffering:
        this.owcOfferingType = 'WmsOffering';
        break;

      case this.WmtsOffering:
        this.owcOfferingType = 'WmtsOffering';
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

      case this.GmlOffering:
        this.owcOfferingType = 'GmlOffering';
        break;

      case this.KmlOffering:
        this.owcOfferingType = 'KmlOffering';
        break;

      case this.GeoTiffOffering:
        this.owcOfferingType = 'GeoTiffOffering';
        break;

      case this.SosOffering:
        this.owcOfferingType = 'SosOffering';
        break;

      case this.NetCdfOffering:
        this.owcOfferingType = 'NetCdfOffering';
        break;

      case this.HttpLinkOffering:
        this.owcOfferingType = 'HttpLinkOffering';
        break;

    }
    this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', this.owcOfferingType);
  }

}
