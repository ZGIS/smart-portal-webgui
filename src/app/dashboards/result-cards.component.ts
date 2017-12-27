import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGeoFeature, IGeoFeatureCollection, ResultService } from '../search';
import * as moment from 'moment';
import { NotificationService } from '../notifications/notification.service';
import { CategoriesService } from './categories.service';
import { ResultDetailModalComponent } from '../search/result-detail-modal.component';
import { isNullOrUndefined } from 'util';
import { IErrorResult } from '../search/result';
import { IDashboardCategory } from './categories';

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
  resultsGroups: string[] = [];

  currentCategory: IDashboardCategory;
  categoryName = '';
  categoryId = '';
  query = '';
  description = '';
  concatKeywords = '';
  loading = true;

  textFilter = '';
  initialKeywordsFilter: string[] = [];
  keywordsFilter: string[] = [];
  initialOriginsFilter: string[] = [];
  originsFilter: string[] = [];
  initialHierarchyLevelFilter: string[] = [ 'dataset', 'service', 'model', 'sensor', 'series', 'nonGeographicDataset' ];
  hierarchyLevelFilter: string[] = [];
  initialTopicCategoryFilter: string[] = [];
  topicCategoryFilter: string[] = [];

  // 'ENVELOPE(147.7369328125,201.7896671875,-23.1815078125,-50.5154921875)'
  // 'ENVELOPE(-180,180,-90,90)'
  defaultEnvelopeFilter = 'ENVELOPE( 168, 180, -50, -33)';
  defaultFromDate = '1970-01-01';
  defaultToDate = moment().format('YYYY-MM-DD');
  showModal: string;

  private subscription: Subscription;

  /**
   * Constructor
   * @param resultService       - injected ResultService
   * @param activatedRoute      - injected ActivatedRoute
   * @param categoriesService   - injected CategoriesService
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
        let childsubscription = this.categoriesService.getCildCategoryById(categoryIdAsNumber)
          .skipWhile<IDashboardCategory>(( data, idx ) => {
            console.log(`skipping ${idx}`);
            return isNullOrUndefined(data);
          }).subscribe(
            ( catObj: IDashboardCategory ) => {
              if (catObj && catObj.id === categoryIdAsNumber) {
                console.log(catObj);
                this.categoryName = catObj.item_name;
                let keywords = '';
                // reset the array
                this.initialKeywordsFilter = [];
                this.keywordsFilter = [];
                catObj.keyword_content.forEach(k => {
                  keywords = k.concat(', ', keywords);
                  this.initialKeywordsFilter.push(k);
                  this.keywordsFilter.push(k);
                });
                this.description = catObj.description;
                this.concatKeywords = keywords;

                if (!isNullOrUndefined(params[ 'query' ]) || params[ 'query' ] === '' || catObj.query_string === params[ 'query' ]) {

                  let customQueryString = this.buildCustomQuery(this.keywordsFilter,
                    this.hierarchyLevelFilter,
                    this.originsFilter,
                    this.topicCategoryFilter);
                  console.log(customQueryString);

                  this.resultService.getResults(
                    customQueryString,
                    this.defaultFromDate,
                    this.defaultToDate,
                    this.defaultEnvelopeFilter
                  ).subscribe(
                    ( results: IGeoFeatureCollection ) => {
                      this.loading = false;
                      this.results = results;
                      this.initialOriginsFilter = this.getCataloguesOfResults();
                      this.originsFilter = this.initialOriginsFilter;
                      this.hierarchyLevelFilter = this.getHierarchyLevelsOfResults();
                      this.initialTopicCategoryFilter = this.getTopicCategoriesOfResults();
                      this.topicCategoryFilter = this.initialTopicCategoryFilter;
                      this.resultsGroups = [ 'Best results', 'Journal Articles', 'Other results' ];
                    },
                    ( error: any ) => {
                      this.loading = false;
                      this.notificationService.addErrorResultNotification(error);
                    }
                  );
                }

              }
              // else {
              //   console.log('no child category taken, error');
              //   this.notificationService.addNotification({
              //     id: NotificationService.MSG_ID_ERROR,
              //     message: 'Category search parameters could not be reolved.',
              //     type: NotificationService.NOTIFICATION_TYPE_WARNING
              //   });
              //   this.router.navigate([ '/dashboard' ]);
              // }
            },
            error => {
              this.notificationService.addErrorResultNotification(error);
            });

        if (params[ 'query' ] !== this.query) {
          this.query = params[ 'query' ] || '*:*';

          this.resultService.getResults(
            this.query,
            this.defaultFromDate,
            this.defaultToDate,
            this.defaultEnvelopeFilter
          ).subscribe(
            ( results: IGeoFeatureCollection ) => {
              this.loading = false;
              this.results = results;
              this.originsFilter = this.getCataloguesOfResults();
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

  refreshQuery() {
    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    console.log(customQueryString);

    this.resultService.getResults(
      customQueryString,
      this.defaultFromDate,
      this.defaultToDate,
      this.defaultEnvelopeFilter
    ).subscribe(
      ( results: IGeoFeatureCollection ) => {
        this.loading = false;
        this.results = results;
        this.originsFilter = this.getCataloguesOfResults();
        this.hierarchyLevelFilter = this.getHierarchyLevelsOfResults();
        this.topicCategoryFilter = this.getTopicCategoriesOfResults();
        this.resultsGroups = [ 'Best results', 'Journal Articles', 'Other results' ];
      },
      ( error: any ) => {
        this.loading = false;
        this.notificationService.addErrorResultNotification(error);
      }
    );
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

  addRemoveHierarchyLevelFilter( event: any, index: number ) {
    let active = event.target.checked;
    let values = event.target.defaultValue;
    let selectDelect = this.initialHierarchyLevelFilter[ index ];
    let tempFilters: string[] = [];
    this.hierarchyLevelFilter.forEach(kw => tempFilters.push(kw));
    // console.log(active);
    // console.log(values);
    if (active) {
      tempFilters.push(selectDelect);
    } else {
      tempFilters = this.hierarchyLevelFilter.filter(kw => kw !== selectDelect);
    }
    let uniqueTemp = tempFilters.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    this.hierarchyLevelFilter = uniqueTemp;
    // console.log(uniqueTemp);
    this.refreshQuery();
  }

  addRemoveOriginFilter( event: any, index: number ) {
    let active = event.target.checked;
    let values = event.target.defaultValue;
    let selectDelect = this.initialOriginsFilter[ index ];
    let tempFilters: string[] = [];
    this.originsFilter.forEach(kw => tempFilters.push(kw));
    // console.log(active);
    // console.log(values);
    if (active) {
      tempFilters.push(selectDelect);
    } else {
      tempFilters = this.originsFilter.filter(kw => kw !== selectDelect);
    }
    let uniqueTemp = tempFilters.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    this.originsFilter = uniqueTemp;
    // console.log(uniqueTemp);
    this.refreshQuery();
  }

  addRemoveKeywordsFilter( event: any, index: number ) {
    let active = event.target.checked;
    let values = event.target.defaultValue;
    let selectDelect = this.initialKeywordsFilter[ index ];
    let tempFilters: string[] = [];
    this.keywordsFilter.forEach(kw => tempFilters.push(kw));
    // console.log(active);
    // console.log(values);
    if (active) {
      tempFilters.push(selectDelect);
    } else {
      tempFilters = this.keywordsFilter.filter(kw => kw !== selectDelect);
    }
    let uniqueTemp = tempFilters.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    this.keywordsFilter = uniqueTemp;
    // console.log(uniqueTemp);
    this.refreshQuery();
  }

  addRemoveTopicCategoryFilter( event: any, index: number ) {
    let active = event.target.checked;
    let values = event.target.defaultValue;
    let selectDelect = this.initialTopicCategoryFilter[ index ];
    let tempFilters: string[] = [];
    this.topicCategoryFilter.forEach(kw => tempFilters.push(kw));
    // console.log(active);
    // console.log(values);
    if (active) {
      tempFilters.push(selectDelect);
    } else {
      tempFilters = this.topicCategoryFilter.filter(kw => kw !== selectDelect);
    }
    let uniqueTemp = tempFilters.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    this.topicCategoryFilter = uniqueTemp;
    // console.log(uniqueTemp);
    this.refreshQuery();
  }

  showFeatureModal( feature: IGeoFeature ) {
    this.showModal = feature.properties.fileIdentifier;
    // console.log(this.activatedRoute.snapshot);
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
  private getCataloguesOfResults(): string[] {
    let cat = this.results.features.map(
      ( feature: IGeoFeature ) => {
        return feature.properties.origin;
      }
    );
    // console.log(JSON.stringify(cat));
    let uniqueCat = cat.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    // console.log(uniqueCat);
    return uniqueCat;
  }

  private getHierarchyLevelsOfResults(): string[] {
    let cat = this.results.features.map(
      ( feature: IGeoFeature ) => {
        if (feature.properties.hierarchyLevel) {
          return feature.properties.hierarchyLevel;
        } else {
          return 'dataset';
        }
      }
    );
    // console.log(JSON.stringify(cat));
    let uniqueCat = cat.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    // console.log(uniqueCat);
    return uniqueCat;
  }

  private getTopicCategoriesOfResults(): string[] {
    let flattenedArray: string[] = [];
    this.results.features.forEach(
      ( feature: IGeoFeature ) => {
        if (feature.properties.topicCategories) {
          feature.properties.topicCategories
            .filter(w => !isNullOrUndefined(w) && w !== '' && w.trim().length > 0)
            .forEach(( topic: string ) => {
              flattenedArray.push(topic.trim());
            });
        }
      });

    // console.log(JSON.stringify(flattenedArray));
    let uniqueCat = flattenedArray.filter(function ( item, pos, self ) {
      return self.indexOf(item) === pos;
    });
    console.log('getTopicCategoriesOfResults' + uniqueCat);
    return uniqueCat;
  }

  /**
   * nuld custum query
   * @param {string[]} keywordsArray
   * @param {string[]} hierarchyLevelArray
   * @param {string[]} originsArray
   * @param {string[]} topicCategoryArray
   * @returns {string}
   */
  private buildCustomQuery( keywordsArray: string[],
                            hierarchyLevelArray: string[],
                            originsArray: string[],
                            topicCategoryArray: string[] ): string {
    let keywordsQueryString = '';
    let hierarchyQueryString = '';
    let originsQueryString = '';
    let topicQueryString = '';
    let singleKeywordQueries = keywordsArray.map(keyword =>
      `keywords:"${keyword}"`
    );
    singleKeywordQueries.forEach(( q: string ) => {
      if (keywordsQueryString === '') {
        keywordsQueryString = q;
      } else {
        keywordsQueryString = q.concat(' OR ', keywordsQueryString);
      }
    });
    let hierarchyFilterQuery = hierarchyLevelArray.map(level =>
      `hierarchyLevel:"${level}"`
    );
    hierarchyFilterQuery.forEach(( q: string ) => {
      if (hierarchyQueryString === '') {
        hierarchyQueryString = q;
      } else {
        hierarchyQueryString = q.concat(' OR ', hierarchyQueryString);
      }
    });
    let originsFilterQuery = originsArray.map(orig =>
      `origin:"${orig}"`
    );
    originsFilterQuery.forEach(( q: string ) => {
      if (originsQueryString === '') {
        originsQueryString = q;
      } else {
        originsQueryString = q.concat(' OR ', originsQueryString);
      }
    });
    let topicsFilterQuery = topicCategoryArray.map(orig =>
      `topicCategory:"${orig}"`
    );
    topicsFilterQuery.filter(w => !isNullOrUndefined(w) && w !== '' && w.trim().length > 0)
      .forEach(( q: string ) => {
      if (topicQueryString === '') {
        topicQueryString = q;
      } else {
        topicQueryString = q.concat(' OR ', topicQueryString);
      }
    });
    let finalQuery = '';
    if (keywordsQueryString.length > 0) {
      finalQuery = this.setOrAppendWithAnd(finalQuery, keywordsQueryString);
    }
    if (hierarchyQueryString.length > 0) {
      finalQuery = this.setOrAppendWithAnd(finalQuery, hierarchyQueryString);
    }
    if (originsQueryString.length > 0) {
      finalQuery = this.setOrAppendWithAnd(finalQuery, originsQueryString);
    }
    if (topicQueryString.length > 0) {
      finalQuery = this.setOrAppendWithAnd(finalQuery, topicQueryString);
    }
    console.log(finalQuery);
    if (finalQuery.length > 0) {
      return finalQuery;
    } else {
      return '*:*';
    }
  }

  private setOrAppendWithAnd( s1: string, s2: string ): string {
    if (isNullOrUndefined(s1) || s1.length <= 0 && !(isNullOrUndefined(s2) || s2.length <= 0)) {
      return `(${s2})`;
    } else {
      if (isNullOrUndefined(s2) || s2.length <= 0) {
        return `${s1}`;
      } else {
        return `${s1} AND (${s2})`;
      }
    }
  }
}
