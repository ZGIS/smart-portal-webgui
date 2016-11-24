import { Component, Injectable, Inject, OnInit } from '@angular/core';
import { PORTAL_API_URL } from '../app.tokens';
import { GeoMetadata, GeoExtent, GeoCitation,
  GeoContact, GeoDistribution, InsertResponse } from './metadata';
import { Http } from '@angular/http';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'sac-gwh-metadata',
  templateUrl: './metadata-editor.component.html'
})

@Injectable()
export class MetadataEditorComponent implements OnInit {

  metadata: GeoMetadata;

  constructor(
    @Inject(PORTAL_API_URL) private portalApiUrl: string,
    private http: Http,
    private notificationService: NotificationService) {
  };

  ngOnInit() {
    this.metadata = <GeoMetadata>{
      'fileIdentifier': '',
      'title': 'Test Title',
      'abstrakt': 'This is an abstract abstract',
      'keywords': ['test keyword one', 'keyword test two'],
      'topicCategoryCode': 'boundaries',
      'hierarchyLevelName': 'nonGeographicDataset',
      'scale': '1000000',
      'extent': <GeoExtent> {
        'description': 'World',
        'referenceSystem': 'urn:ogc:def:crs:EPSG::4328',
        'mapExtentCoordinates': [180, -180, -90, 90],
        'temporalExtent': ''
      },
      'citation': <GeoCitation> {
        'ciDate': '2016-01-01',
        'ciDateType': 'publication'
      },

      'lineageStatement': '',
      'responsibleParty': <GeoContact> {
        individualName: 'Hans Wurst',
        telephone: '+01 2334 5678910',
        email: 'wurst.hand@test.com',
        pointOfContact: 'pointOfContact',
        orgName: 'Test Org',
        orgWebLinkage: 'http://www.test.com'
      },
      distribution: <GeoDistribution> {
        'license': 'public domain'
      }
    };

  }

  submitForm() {

    this.http.post(this.portalApiUrl + '/csw/insert', {metadata: this.metadata})
      .toPromise()
      .then(response => {
        console.log(response.toString());
        console.log(response.json());
        let insertResponse = <InsertResponse>(response.json() || {type: '', message: ''});
        this.notificationService.addNotification(insertResponse);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
