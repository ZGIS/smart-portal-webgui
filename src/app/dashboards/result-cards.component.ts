import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGeoFeatureCollection, IGeoFeature, ResultService } from '../search';
import * as moment from 'moment';
import { NotificationService } from '../notifications/notification.service';
import { CategoriesService } from './categories.service';
import { ResultDetailModalComponent } from '../search/result-detail-modal.component';
import { isNullOrUndefined } from 'util';
import { IErrorResult } from '../search/result';
import { IDashboardCategory } from './categories';

// let smallPlaceHolderImg = require('file!./../../../public/images/icon_folder_640.png');
// let largePaceHolderImg = require('file!./../../../public/images/icon_folder_1280.png');

@Component({
  selector: 'app-sac-gwh-result-cards',
  templateUrl: 'result-cards.component.html',
  styleUrls: [ 'result-cards.component.css' ],
})

/**
 * CardComponent to show search results in Dashboard
 */
export class ResultCardsComponent implements OnInit, OnDestroy {
  @ViewChild(ResultDetailModalComponent) resultDetailModalComponentRef: ResultDetailModalComponent;

  results: IGeoFeatureCollection;
  resultsGroups: String[];

  categoryName = '';
  categoryId = '';
  query = '';
  description = '';
  loading = true;

  textFilter = '';

  showModal: String;

  private subscription: Subscription;

  /**
   * Constructor
   * @param resultService       - injected ResultService
   * @param activatedRoute      - injected ActivatedRoute
   * @param notificationService - injected NotificationService
   * @param router              - injected Router
   */
  constructor( private resultService: ResultService,
               private activatedRoute: ActivatedRoute,
               private categoriesService: CategoriesService,
               private notificationService: NotificationService,
               private router: Router ) {
  }

  /**
   * OnInit - will load search results according to current query/category
   */
  ngOnInit(): void {
    this.results = <IGeoFeatureCollection>{
      'type': 'FeatureCollection',
      'crs': { 'type': 'name', 'properties': { 'name': 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      'count': 0,
      'countMatched': 0,
      'features': []
    };
    this.resultsGroups = [];

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      ( params: Params ) => {
        let categoryIdAsString = params[ 'categoryId' ];
        this.categoryId = categoryIdAsString;
        let categoryIdAsNumber = Number(categoryIdAsString).valueOf();

        this.categoriesService.getCildCategoryById(categoryIdAsNumber)
          .subscribe(
            ( catObj: IDashboardCategory ) => {
              if (catObj && catObj.id === categoryIdAsNumber) {
                console.log(catObj);
                this.categoryName = catObj.item_name;
                let keywords = '';
                catObj.keyword_content.forEach(k => keywords = k.concat(', ', keywords));
                this.description = catObj.description + ' - ' + keywords;
              }
            },
            error => {
              this.notificationService.addErrorResultNotification(error);
            });

        if (params[ 'query' ] !== this.query) {
          this.query = params[ 'query' ] || '*:*';

          this.resultService.getResults(
            this.query,
            '1970-01-01',
            moment().format('YYYY-MM-DD'),
            // 'ENVELOPE(147.7369328125,201.7896671875,-23.1815078125,-50.5154921875)'
            'ENVELOPE(-180,180,-90,90)'
          ).subscribe(
            ( results: IGeoFeatureCollection ) => {
              this.loading = false;
              this.results = results;
              // this.resultsGroups = this.getCataloguesOfResults();
              this.resultsGroups = [ 'Best results', 'Journal Articles', 'Other results' ];
            },
            ( error: any ) => {
              this.loading = false;
              this.notificationService.addErrorResultNotification(error);
            }
          );
        }

        if (!isNullOrUndefined(params[ 'showModal' ])) {
          this.showModal = params[ 'showModal' ];
          this.resultService.getResults(
            `fileIdentifier:"${params[ 'showModal' ]}"`
          ).subscribe(
            ( results: IGeoFeatureCollection ) => {
              if (results.count > 0) {
                this.resultDetailModalComponentRef.showFeatureModal(results.features[ 0 ]);
              } else {
                this.notificationService.addNotification({
                  id: NotificationService.MSG_ID_DOCUMENT_NOT_FOUND,
                  message: `Document ${params[ 'showModal' ]} could not be found in CSW index. Maybe it is not a metadata document?`,
                  type: NotificationService.NOTIFICATION_TYPE_WARNING
                });
                this.resultDetailModalComponentRef.hideFeatureModal();
              }
            },
            ( error: IErrorResult ) => {
              this.notificationService.addErrorResultNotification(error);
            });
        }

      });
  }

  /**
   * OnDestroy
   */
  ngOnDestroy(): void {
    // TODO SR this should not be needed anymore
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  /**
   * filters results by text filter and category (top 20, journal, other)
   *
   * @returns {IGeoFeature[]}
   */
  getFilteredResults( origin: String ): IGeoFeature[] {
    if (this.results) {
      let filteredByOrigin = this.results.features;

      if (origin === 'Best results') {
        filteredByOrigin = this.results.features.slice(0, 20);
      } else if (origin === 'Journal Articles') {
        filteredByOrigin = this.results.features.filter(( item ) => item.properties.origin === 'journals');
      } else if (origin === 'Other results') {
        filteredByOrigin = this.results.features.slice(20);
      }

      return filteredByOrigin.filter(( item ) =>
        item.properties.title.toLocaleLowerCase().indexOf(this.textFilter.toLocaleLowerCase()) >= 0);
    }
  }

  showFeatureModal( feature: IGeoFeature ) {
    this.showModal = feature.properties.fileIdentifier;
    console.log(this.activatedRoute.snapshot);
    this.router.navigate([ this.activatedRoute.snapshot.url.join('/') ], {
      queryParams: {
        query: this.query,
        categoryId: this.categoryId,
        showModal: this.showModal
      }
    });
  }

  onHideFeatureModal() {
    this.showModal = undefined;
    this.router.navigate([ this.activatedRoute.snapshot.url.join('/') ], {
      queryParams: {
        query: this.query,
        categoryId: this.categoryId,
        showModal: this.showModal
      }
    });
  }

  /**
   * gets all origin catalogues out of the resuls
   *  and returns them as string array
   */
  private getCataloguesOfResults() {
    let cat = this.results.features.map(
      ( feature: IGeoFeature ) => {
        return feature.properties.origin;
      }
    );
    console.log(JSON.stringify(cat));
    let uniqueCat = cat.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    console.log(uniqueCat);
    return uniqueCat;
  }
}
