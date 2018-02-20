import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PORTAL_API_URL } from '../in-app-config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap';
import { CategoriesService, IDashboardCategory } from '../dashboards';
import { CollectionsService, OwcLink } from '../owc';
import { WorkbenchService } from '../workbench';
import { GeoCitation, GeoContact, GeoDistribution, GeoExtent, GeoMetadata, SelectEntry, ValidValues } from '.';
import { NotificationService } from '../notifications';
import * as moment from 'moment';
import { Ol3MapExtent } from '../ol3-map';
import { ProfileJs } from '../account';

@Component({
  selector: 'app-sac-gwh-metadata',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './metadata-editor.component.html'
})

export class MetadataEditorComponent implements OnInit {

  public tabs: any[] = [
    { title: 'What?', active: true },
    { title: 'SAC Category', active: false },
    { title: 'Where?', active: false },
    { title: 'When?', active: false },
    { title: 'Who?', active: false },
    { title: 'Distribution', active: false }

  ];

  metadataKeywordString: String;

  basicProfile: ProfileJs;

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

  sacCategories: IDashboardCategory[] = [];

  loading = false;
  error = '';

  onlineResourceLinkageTypeahead: Observable<Array<OwcLink>>;
  typeaheadLoading: boolean;
  typeaheadNoResults: boolean;

  currentTab = 0;

  private DATE_FORMAT = 'YYYY-MM-DD';

  constructor( @Inject(PORTAL_API_URL) private portalApiUrl: string,
               private notificationService: NotificationService,
               private categoriesService: CategoriesService,
               private router: Router,
               private workbenchService: WorkbenchService,
               private collectionsService: CollectionsService ) {

    this.onlineResourceLinkageTypeahead = Observable
      .create(( observer: any ) => {
        observer.next(this.metadata.distribution.onlineResourceLinkage);
      })
      .mergeMap(( filtertoken: string ) => {
        let result: Observable<Array<OwcLink>>;
        if (this.metadata.distribution.formatVersion === 'file formats') {
          result = this.collectionsService.getUploadedFilesFromDefaultCollection(filtertoken);
        } else {
          // TODO SR in case we decide to store service URLs in collection, load other typeahead suggestions
          result = Observable.of([]);
        }
        return result;
      });
  }

  ngOnInit() {
    const uuid = this.collectionsService.getNewUuid();
    console.log(uuid);

    this.categoriesService.getAllCategories()
      .subscribe(
        result => {
          result.forEach(( catObj: IDashboardCategory ) => {
            this.sacCategories.push(catObj);
          });
        },
        error => {
          this.notificationService.addErrorResultNotification(error);
        });

    this.metadata = <GeoMetadata>{
      'fileIdentifier': uuid,
      'title': '',
      'abstrakt': '',
      'keywords': [],
      'smartCategory': [],
      'topicCategoryCode': 'geoscientificInformation',
      'hierarchyLevelName': 'dataset',
      'scale': '1000000',
      'extent': <GeoExtent> {
        'description': 'New Zealand',
        'referenceSystem': 'urn:ogc:def:crs:EPSG::4326',
        'mapExtentCoordinates': [ 162, -50, 180, -25 ],
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
        pointOfContact: 'pointOfContact',
        orgName: '',
        orgWebLinkage: ''
      },
      distribution: <GeoDistribution> {
        useLimitation: 'Creative Commons Attribution 4.0 license',
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


    // the guard makes sure we're logged in, we can provide basic fill out for contact
    this.basicProfile = JSON.parse(localStorage.getItem('currentUserProfile'));
    this.metadata.responsibleParty.individualName = `${this.basicProfile.firstname} ${this.basicProfile.lastname}`;
    this.metadata.responsibleParty.email = `${this.basicProfile.email}`;
    this.metadata.responsibleParty.orgWebLinkage = 'https://portal.smart-project.info';
  }

  public openPreviousTab() {
    if (this.currentTab > 0) {
      this.tabs[ this.currentTab-- ].active = false;
      this.tabs[ this.currentTab ].active = true;
    }
  }

  public openNextTab() {
    if (this.currentTab < this.tabs.length - 1) {
      this.tabs[ this.currentTab++ ].active = false;
      this.tabs[ this.currentTab ].active = true;
    }
  }

  submitForm() {
    this.loading = true;
    // FIXME SR either find a smooth solution to hook into the data-binding to do that, or use different input!
    this.metadata.keywords = this.metadataKeywordString.split(',');
    this.metadata.smartCategory = this.validValues.smartCategory
      .filter(function ( value, index, array ) {
        return (value.selected === true);
      })
      .map(function ( value, index, array ) {
        return value.value;
      });

    this.workbenchService.insertMetadataRecord(this.metadata)
      .subscribe(
        (response => {
          this.loading = false;
          this.notificationService.addNotification(response);
          this.router.navigateByUrl('/workbench/my-data');
        }),
        (error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
        })
      );
  }

  bboxChanged( $event: any ) {
    console.log(`bbox changed to '${$event}'`);
    this.metadata.extent.mapExtentCoordinates = (<Ol3MapExtent>$event).bbox;
  }

  // checkboxClicked( index: number ) {
  //   console.log(this.validValues.smartCategory);
  //   this.validValues.smartCategory[ index ].selected = !this.validValues.smartCategory[ index ].selected;
  // }

  sacCategoriesCheckboxClicked( event: any, indexParent: number, indexChild: number ) {
    let active = event.target.checked;
    let values = event.target.defaultValue;
    let selectDelectSacKeywords: string[] = this.sacCategories[indexParent].children[indexChild].keyword_content;
    console.log(active);
    console.log(values);
    if (active) {
      selectDelectSacKeywords.forEach(( keyword: string ) => {
        this.metadata.smartCategory.push(keyword);
      });
      // TODO filter unique keywords, so no doubles
    } else {
      // TODO filter remove all keywords from the deactivated selection
      console.log('remove');
    }
  }

  public changeTypeaheadLoading( e: boolean ): void {
    this.typeaheadLoading = e;
  }

  public changeTypeaheadNoResults( e: boolean ): void {
    this.typeaheadNoResults = e;
  }

  public typeaheadOnSelect( e: TypeaheadMatch ): void {
    console.log('Selected value: ', e.value);
    this.metadata.distribution.formatName = e.item.title;
    console.log(e);
  }

  onCitationDateSelectionDone( e: any ) {
    console.log(e);
    this.metadata.citation.ciDate = moment(e).format(this.DATE_FORMAT);
    console.log(this.metadata.citation.ciDate);
  }

  citationCiDateValid( cite: GeoCitation ): boolean {
    return (cite.ciDate !== null) && (cite.ciDateType !== null);
  }

  private loadValidValues( topic: string ) {
    this.workbenchService.loadValidValuesForTopic(topic)
      .subscribe(
        (valueEntry => {
          // FIXME AK I think we can just assign it here?
          for ( let i = 0; i < valueEntry.values.length; i++ ) {
            this.validValues[ topic ].push(<SelectEntry>{
              value: valueEntry.values[ i ],
              description: valueEntry.descriptions[ i ],
              selected: i === valueEntry.standardValue
            });
          }
        }),
        (error => this.notificationService.addErrorResultNotification(error))
      );
  }
}
