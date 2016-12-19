import { Component, Injectable, Inject, OnInit } from '@angular/core';
import { PORTAL_API_URL } from '../app.tokens';
import { GeoMetadata, GeoExtent, GeoCitation,
  GeoContact, GeoDistribution, InsertResponse } from './metadata';
import { Http } from '@angular/http';
import { NotificationService } from '../notifications/notification.service';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';

export interface SelectEntry {
  value: String;
  description: String;
  selected: boolean;
}

export interface ValidValues {
  topicCategory: Array<SelectEntry>;
  hierarchyLevelName: Array<SelectEntry>;
  scale: Array<SelectEntry>;
  referenceSystem: Array<SelectEntry>;
  ciDateType: Array<SelectEntry>;
  pointOfContact: Array<SelectEntry>;
  useLimitation: Array<SelectEntry>;
  formatVersion: Array<SelectEntry>;
}

@Component({
  selector: 'sac-gwh-metadata',
  templateUrl: './metadata-editor.component.html'
})

@Injectable()
export class MetadataEditorComponent implements OnInit {

  metadata: GeoMetadata;
  validValues: ValidValues = {
    topicCategory: [],
    hierarchyLevelName: [],
    scale: [],
    referenceSystem: [],
    ciDateType: [],
    pointOfContact: [],
    useLimitation: [],
    formatVersion: []
  };

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
        email: 'wurst.hans@test.com',
        pointOfContact: 'publisher',
        orgName: 'Test Org',
        orgWebLinkage: 'http://www.test.com'
      },
      distribution: <GeoDistribution> {
        useLimitation: 'I don\'t know',
        formatName: 'CSW',
        formatVersion: 'web service type',
        onlineResourceLinkage: 'http://www.test.com/?service=CSW' +
                               '&version=2.0.2&request=GetCapabilities'
      }
    };

    // iterate through interface properties of validValues and load them from backend
    Object.getOwnPropertyNames(this.validValues).forEach(property => {
      console.log(`Loading data for ${property}`);
      this.loadValidValues(property);
    });
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

  bboxChanged($event: any) {
    console.log(`bbox changed to '${$event}'`);
    this.metadata.extent.mapExtentCoordinates = (<Ol3MapExtent>$event).bbox;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  private loadValidValues(topic: string) {
    this.http.get(this.portalApiUrl + '/csw/get-valid-values-for/' + topic)
      .toPromise()
      .then(response => {
        console.log(`response for ${topic}`);
        console.log(response.json());
        let foobar = response.json();
        if (!foobar.descriptions || foobar.descriptions.length === 0) {
          foobar.descriptions = foobar.values;
        }
        for (let i = 0; i < foobar.values.length; i++) {
          this.validValues[topic].push({
              value: foobar.values[i],
              description: foobar.descriptions[i],
              selected: i === foobar.standardValue
            });
        }
      })
      // TODO SR handle errors properly!
      .catch(this.handleError);
  }
}
