import { Component, Input, OnInit } from '@angular/core';
import { IOwcOffering } from './collections';

// IOwcOperation, IOwcPostRequestConfig, IOwcRequestResult

@Component({
  selector: 'app-sac-gwh-owcoffering',
  templateUrl: 'owc-offering.component.html',
  styleUrls: ['owc-offering.component.css']
})

export class OwcOfferingComponent implements OnInit {
  @Input() owcOffering: IOwcOffering;

  owcOfferingStyleClasses = 'owcOffering';

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
      case this.WmsOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'WmsOffering');
        break;
      }
      case this.WmtsOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'WmtsOffering');
        break;
      }
      case this.WfsOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'WfsOffering');
        break;
      }
      case this.WcsOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'WcsOffering');
        break;
      }
      case this.CswOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'CswOffering');
        break;
      }
      case this.WpsOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'WpsOffering');
        break;
      }
      case this.GmlOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'GmlOffering');
        break;
      }
      case this.KmlOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'KmlOffering');
        break;
      }
      case this.GeoTiffOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'GeoTiffOffering');
        break;
      }
      case this.SosOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'SosOffering');
        break;
      }
      case this.NetCdfOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'NetCdfOffering');
        break;
      }
      case this.HttpLinkOffering: {
        this.owcOfferingStyleClasses = this.owcOfferingStyleClasses.concat(' ', 'HttpLinkOffering');
        break;
      }
    }
  }

}
