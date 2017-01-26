import { Component, Injectable, Inject, OnInit } from '@angular/core';
import { PORTAL_API_URL } from '../app.tokens';
import { GeoMetadata, GeoExtent, GeoCitation,
  GeoContact, GeoDistribution, InsertResponse } from './metadata';
import { Http, Response } from '@angular/http';
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
  selector: 'app-sac-gwh-metadata',
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

  loading = false;

  constructor(
    @Inject(PORTAL_API_URL) private portalApiUrl: string,
    private http: Http,
    private notificationService: NotificationService) {
  };

  ngOnInit() {
    this.metadata = <GeoMetadata>{
      'fileIdentifier': '',
      'title': '',
      'abstrakt': '',
      'keywords': [],
      'topicCategoryCode': 'geoscientificInformation',
      'hierarchyLevelName': 'dataset',
      'scale': '1000000',
      'extent': <GeoExtent> {
        'description': 'New Zealand',
        'referenceSystem': 'urn:ogc:def:crs:EPSG::4328',
        'mapExtentCoordinates': [162, 180, -50, -25],
        'temporalExtent': ''
      },
      'citation': <GeoCitation> {
        'ciDate': '2016-01-01',
        'ciDateType': 'publication'
      },

      'lineageStatement': '',
      'responsibleParty': <GeoContact> {
        individualName: '',
        telephone: '',
        email: '',
        pointOfContact: 'publisher',
        orgName: '',
        orgWebLinkage: ''
      },
      distribution: <GeoDistribution> {
        useLimitation: 'Check with source agency',
        formatName: '',
        formatVersion: '',
        onlineResourceLinkage: ''
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

  private handleError(error: Response | any): Promise<any> {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || 'An error occurred'} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.notificationService.addNotification({
      type: 'warning',
      message: 'An error occurred: ' + errMsg
    });
    return Promise.reject(error.message || error);
  };

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
