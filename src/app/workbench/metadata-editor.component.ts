import { Component, Injectable, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PORTAL_API_URL } from '../app.tokens';
import { GeoMetadata, GeoExtent, GeoCitation,
  GeoContact, GeoDistribution, InsertResponse } from './metadata';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NotificationService } from '../notifications/notification.service';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';

export interface SelectEntry {
  value: string;
  description: string;
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
  smartCategory: Array<SelectEntry>;
}

@Component({
  selector: 'app-sac-gwh-metadata',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metadata-editor.component.html'
})

@Injectable()
export class MetadataEditorComponent implements OnInit {

  public tabs: any[] = [
    {title: 'What?', active: true},
    {title: 'SAC Category', active: false},
    {title: 'Where?', active: false},
    {title: 'When?', active: false},
    {title: 'Who?', active: false},
    {title: 'Upload files?', active: false},
    {title: 'Distribution', active: false}

  ];

  metadataKeywordString: String;

  metadata: GeoMetadata;
  validValues: ValidValues = {
    topicCategory: [],
    hierarchyLevelName: [],
    scale: [],
    referenceSystem: [],
    ciDateType: [],
    pointOfContact: [],
    useLimitation: [],
    formatVersion: [],
    smartCategory: []
  };

  loading = false;
  error = '';

  constructor(
    @Inject(PORTAL_API_URL) private portalApiUrl: string,
    private http: Http,
    private cookieService: CookieService,
    private notificationService: NotificationService,
    private router: Router) {
  };

  ngOnInit() {
    this.metadata = <GeoMetadata>{
      'fileIdentifier': '',
      'title': '',
      'abstrakt': '',
      'keywords': [],
      'smartCategory': [],
      'topicCategoryCode': 'geoscientificInformation',
      'hierarchyLevelName': 'dataset',
      'scale': '1000000',
      'extent': <GeoExtent> {
        'description': 'New Zealand',
        'referenceSystem': 'urn:ogc:def:crs:EPSG::4328',
        'mapExtentCoordinates': [162, -50, 180, -25],
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

  public setNextTab(last: number, next: number): void {
    this.tabs[last].active = false;
    this.tabs[next].active = true;
  }

  submitForm() {
    this.loading = true;

    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let cookieToken = this.cookieService.get('XSRF-TOKEN');

    let headers = new Headers({
      // 'Authorization': 'Bearer ' + this.token,
      'X-XSRF-TOKEN': cookieToken
    });
    let options = new RequestOptions({headers: headers, withCredentials: true});


    // FIXME SR either find a smooth solution to hook into the data-binding to do that, or use different input!
    this.metadata.keywords = this.metadataKeywordString.split(',');
    this.metadata.smartCategory = this.validValues.smartCategory
      .filter(function(value, index, array) { return (value.selected === true); })
      .map(function(value, index, array) { return value.value; });
    this.http.post(this.portalApiUrl + '/csw/insert', {metadata: this.metadata}, options)
      .toPromise()
      .then(response => {
        console.log(response.toString());
        console.log(response.json());
        let insertResponse = <InsertResponse>(response.json() || {type: '', message: ''});
        this.notificationService.addNotification(insertResponse);
        this.loading = false;
        this.router.navigateByUrl('/workbench/my-data');
      })
      .catch(this.handleError);
  }

  bboxChanged($event: any) {
    console.log(`bbox changed to '${$event}'`);
    this.metadata.extent.mapExtentCoordinates = (<Ol3MapExtent>$event).bbox;
  }

  checkboxClicked(index: number) {
    console.log(this.validValues.smartCategory);
    this.validValues.smartCategory[index].selected = !this.validValues.smartCategory[index].selected;
  }

  private handleError(error: Response | any): Promise<any> {
    // In a real world app, we might use a remote logging infrastructure
    this.loading = false;
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
