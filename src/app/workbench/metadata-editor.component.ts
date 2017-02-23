import { Component, Injectable, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PORTAL_API_URL } from '../app.tokens';
import { GeoMetadata, GeoExtent, GeoCitation, GeoContact, GeoDistribution, InsertResponse } from './metadata';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { NotificationService } from '../notifications/notification.service';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';
import { Router } from '@angular/router';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { IErrorResult } from '../search/result';
import { Observable } from 'rxjs';
import { CollectionsService } from './collections.service';
import { TypeaheadMatch } from 'ng2-bootstrap';
import * as moment from 'moment';

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
  _distributionCiDate: Date = new Date();

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

  onlineResourceLinkageTypeahead: Observable<any>;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;

  private DATE_FORMAT = 'YYYY-MM-DD';

  constructor(@Inject(PORTAL_API_URL) private portalApiUrl: string,
              private http: Http,
              private cookieService: CookieService,
              private notificationService: NotificationService,
              private collectionsService: CollectionsService,
              private router: Router) {

    this.onlineResourceLinkageTypeahead = Observable
      .create((observer: any) => {
        observer.next(this.metadata.distribution.onlineResourceLinkage);
      })
      .mergeMap((token: string) => {
        let result: Observable<Array<any>>;
        if (this.metadata.distribution.formatVersion === 'file formats') {
          result = this.collectionsService.getUploadedFilesFromDefaultCollection(token);
        } else {
        // TODO SR in case we decide to store service URLs in collection, load other typeahead suggestions
          result = Observable.of([]);
        }
        return result;
      });
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
        'ciDate': moment(this._distributionCiDate).format(this.DATE_FORMAT),
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
        formatVersion: 'file formats',
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
      .filter(function (value, index, array) {
        return (value.selected === true);
      })
      .map(function (value, index, array) {
        return value.value;
      });
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

  public changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  public changeTypeaheadNoResults(e: boolean): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value);
    this.metadata.distribution.formatName = e.item.operation.type;
    console.log(e);
  }

  onCitationDateSelectionDone(e: any) {
    console.log(e);
    this.metadata.citation.ciDate = moment(e).format(this.DATE_FORMAT);
    console.log(this.metadata.citation.ciDate);
  }

  private loadValidValues(topic: string) {
    this.http.get(this.portalApiUrl + '/csw/get-valid-values-for/' + topic)
      .map((response: Response) => {
        console.log(`response for ${topic}`);
        console.log(response.json());
        let foobar = response.json();
        if (!foobar.descriptions || foobar.descriptions.length === 0) {
          foobar.descriptions = foobar.values;
        }

        for (let i = 0; i < foobar.values.length; i++) {
          // TODO SR this should push in some internal structure, return that and then subscribe should assign it!
          this.validValues[topic].push({
            value: foobar.values[i],
            description: foobar.descriptions[i],
            selected: i === foobar.standardValue
          });
        }
        return this.validValues;
      })
      .catch((errorResponse: Response) => this.handleError(errorResponse))
      .subscribe(
        (validValues => this.validValues = validValues),
        (error => this.notificationService.addErrorResultNotification(error))
      );
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying backend: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()});
    }
  }

/*
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
*/

}
