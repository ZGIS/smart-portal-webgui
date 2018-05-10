import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IErrorResult,
  IGeoFeature,
  IGeoFeatureCollection,
  ResultCollectionsViewModalComponent,
  ResultDetailModalComponent,
  ResultService
} from '../search';
import * as moment from 'moment';
import { NotificationService } from '../notifications';
import { CategoriesService } from './categories.service';
import { isNullOrUndefined } from 'util';
import { IDashboardCategory } from './categories';
import { CollectionsService, OwcContext, OwcLink } from '../owc';
import { AccountService } from '../account';

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

  @ViewChild(ResultCollectionsViewModalComponent) resultCollectionsModalComponentRef: ResultCollectionsViewModalComponent;

  results: IGeoFeatureCollection;
  resultsGroups: string[] = [];

  caseStudySearchResult: OwcContext[] = [];
  currentCategory: IDashboardCategory;
  categoryName = '';
  categoryId = '';
  query = '';
  description = '';
  concatKeywords = '';
  loading = true;

  textFilter = '';
  initialKeywordsFilter: string[] = [];
  initialKeywordsFilterChecked: boolean[] = [];
  keywordsFilter: string[] = [];
  initialOriginsFilter: string[] = [];
  initialOriginsFilterChecked: boolean[] = [];
  originsFilter: string[] = [];
  initialHierarchyLevelFilter: string[] = [];
  initialHierarchyLevelFilterChecked: boolean[] = [];
  hierarchyLevelFilter: string[] = [];
  initialTopicCategoryFilter: string[] = [];
  initialTopicCategoryFilterChecked: boolean[] = [];
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
   * @param accountService       - injected AccountService
   * @param collectionService       - injected CollectionsService
   * @param notificationService - injected NotificationService
   * @param _location - injected Location
   * @param router              - injected Router
   */
  constructor( private resultService: ResultService,
               private activatedRoute: ActivatedRoute,
               private categoriesService: CategoriesService,
               private accountService: AccountService,
               private collectionService: CollectionsService,
               private notificationService: NotificationService,
               private _location: Location,
               private router: Router ) {

    this.activatedRoute.data.subscribe(( { childCategoryObject } ) => {
      // console.log(`route resolved cat ${childCategoryObject.id}`);
      this.currentCategory = childCategoryObject;
    });
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
    // this.subscription = this.activatedRoute.queryParams.subscribe(
    //   ( params: Params ) => {
    //     let categoryIdAsString = params[ 'categoryId' ];
    //     this.categoryId = categoryIdAsString;
    //     let categoryIdAsNumber = Number(categoryIdAsString).valueOf();
    //     let childsubscription = this.categoriesService.getCildCategoryById(categoryIdAsNumber)
    //       .skipWhile<IDashboardCategory>(( data, idx ) => {
    //         console.log(`skipping ${idx}`);
    //         return isNullOrUndefined(data);
    //       }).subscribe(
    //         ( catObj: IDashboardCategory ) => {
    // if (catObj && catObj.id === categoryIdAsNumber) {

    console.log(this.currentCategory);
    this.categoryName = this.currentCategory.item_name;
    this.categoryId = '' + this.currentCategory.id;
    let keywords = '';
    // reset the array
    this.initialKeywordsFilter = [];
    this.keywordsFilter = [];
    this.currentCategory.keyword_content.forEach(k => {
      keywords = k.concat(', ', keywords);
      this.initialKeywordsFilter.push(k);
      this.initialKeywordsFilterChecked.push(true);
      this.keywordsFilter.push(k);
    });
    this.description = this.currentCategory.description;
    this.concatKeywords = keywords;

    // if (!isNullOrUndefined(params[ 'query' ]) || params[ 'query' ] === '' || this.currentCategory.query_string ===
    // params[ 'query' ]) {

    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    // console.log(customQueryString);
    this.query = customQueryString;

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
        this.initialOriginsFilter.forEach(e => this.initialOriginsFilterChecked.push(true));
        this.originsFilter = this.initialOriginsFilter;
        this.initialHierarchyLevelFilter = this.getHierarchyLevelsOfResults();
        this.initialHierarchyLevelFilter.forEach(e => this.initialHierarchyLevelFilterChecked.push(true));
        this.hierarchyLevelFilter = this.initialHierarchyLevelFilter;
        this.initialTopicCategoryFilter = this.getTopicCategoriesOfResults();
        this.initialTopicCategoryFilter.forEach(e => this.initialTopicCategoryFilterChecked.push(true));
        this.topicCategoryFilter = this.initialTopicCategoryFilter;
        this.resultsGroups = [ 'Best results', 'Journal Articles', 'Other results' ];
      },
      ( error: any ) => {
        this.loading = false;
        this.notificationService.addErrorResultNotification(error);
      }
    );

    // caseStudyResult
    this.accountService.isLoggedIn().subscribe(
      loggedInResult => {
        this.collectionService.queryCollectionsForViewing(loggedInResult, null, this.currentCategory.keyword_content)
          .subscribe(
            collections => {
              this.caseStudySearchResult = [];
              // console.log(response);
              collections.forEach(owc => {
                this.caseStudySearchResult.push(owc);
              });
              this.caseStudySearchResult.sort(( leftside, rightside ) => {
                if (!(leftside.searchScore && rightside.searchScore)) {
                  return 0;
                }
                if (leftside.searchScore < rightside.searchScore) {
                  return -1;
                }
                if (leftside.searchScore > rightside.searchScore) {
                  return 1;
                }
                return 0;
              });
            },
            ( error: any ) => {
              this.loading = false;
              this.notificationService.addErrorResultNotification(error);
            });
      },
      error => {
        console.log(<any>error);
      });
    // }
    // },
    // error => {
    //   this.notificationService.addErrorResultNotification(error);
    // });

    this.subscription = this.activatedRoute.queryParams.subscribe(
      ( params: Params ) => {
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

  backClicked() {
    this._location.back();
  }

  /**
   * OnDestroy
   */
  ngOnDestroy(): void {
    // TODO SR this should not be needed anymore
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  refreshQuery( keywordsFilterT: string[],
                hierarchyLevelFilterT: string[],
                originsFilterT: string[],
                topicCategoryFilterT: string[] ) {
    let customQueryString = this.buildCustomQuery(keywordsFilterT,
      hierarchyLevelFilterT,
      originsFilterT,
      topicCategoryFilterT);
    // console.log(customQueryString);
    this.query = customQueryString;

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
        this.updateCheckboxesFromResults();
        this.resultsGroups = [ 'Best results', 'Journal Articles', 'Other results' ];
      },
      ( error: any ) => {
        this.loading = false;
        this.notificationService.addErrorResultNotification(error);
      }
    );

    // caseStudyResult
    this.accountService.isLoggedIn().subscribe(
      loggedInResult => {
        this.collectionService.queryCollectionsForViewing(loggedInResult, null, keywordsFilterT)
          .subscribe(
            collections => {
              this.caseStudySearchResult = [];
              // console.log(response);
              collections.forEach(owc => {
                this.caseStudySearchResult.push(owc);
              });
              this.caseStudySearchResult.sort(( leftside, rightside ) => {
                if (!(leftside.searchScore && rightside.searchScore)) {
                  return 0;
                }
                if (leftside.searchScore < rightside.searchScore) {
                  return -1;
                }
                if (leftside.searchScore > rightside.searchScore) {
                  return 1;
                }
                return 0;
              });
            },
            ( error: any ) => {
              this.loading = false;
              this.notificationService.addErrorResultNotification(error);
            });
      },
      error => {
        console.log(<any>error);
      });
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
    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    this.query = customQueryString;
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
    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    this.query = customQueryString;
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
    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    this.query = customQueryString;
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
    let customQueryString = this.buildCustomQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
    this.query = customQueryString;
  }

  onClickRefreshQuery() {
    this.refreshQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
  }

  updateCheckboxesFromResults() {
    this.initialOriginsFilter.forEach(( w: string, index ) => {
      this.initialOriginsFilterChecked[ index ] = (this.originsFilter.indexOf(w) > -1);
    });
    this.initialTopicCategoryFilter.forEach(( w: string, index ) => {
      this.initialTopicCategoryFilterChecked[ index ] = (this.topicCategoryFilter.indexOf(w) > -1);
    });
    this.initialHierarchyLevelFilter.forEach(( w: string, index ) => {
      this.initialHierarchyLevelFilterChecked[ index ] = (this.hierarchyLevelFilter.indexOf(w) > -1);
    });
    this.initialKeywordsFilter.forEach(( w: string, index ) => {
      this.initialKeywordsFilterChecked[ index ] = (this.initialKeywordsFilter.indexOf(w) > -1);
    });
  }

  onClickResetParameters() {
    this.hierarchyLevelFilter = [];
    this.initialHierarchyLevelFilter.forEach(e => this.initialHierarchyLevelFilterChecked.push(true));
    this.initialHierarchyLevelFilter.forEach(w => this.hierarchyLevelFilter.push(w));
    this.originsFilter = [];
    this.initialOriginsFilter.forEach(e => this.initialOriginsFilterChecked.push(true));
    this.initialOriginsFilter.forEach(w => this.originsFilter.push(w));
    this.topicCategoryFilter = [];
    this.initialTopicCategoryFilter.forEach(e => this.initialTopicCategoryFilterChecked.push(true));
    this.initialTopicCategoryFilter.forEach(w => this.topicCategoryFilter.push(w));
    this.keywordsFilter = [];
    this.initialKeywordsFilter.forEach(e => this.initialKeywordsFilterChecked.push(true));
    this.initialKeywordsFilter.forEach(w => this.keywordsFilter.push(w));

    this.refreshQuery(this.keywordsFilter,
      this.hierarchyLevelFilter,
      this.originsFilter,
      this.topicCategoryFilter);
  }

  showFeatureModal( feature: IGeoFeature ) {
    this.showModal = feature.properties.fileIdentifier;
    // console.log(this.activatedRoute.snapshot);
    this.router.navigate([ this.activatedRoute.snapshot.url.join('/') ], {
      queryParams: {
        // query: this.query,
        categoryId: this.categoryId,
        showModal: this.showModal
      }
    });
  }

  onHideFeatureModal() {
    this.showModal = undefined;
    this.router.navigate([ this.activatedRoute.snapshot.url.join('/') ], {
      queryParams: {
        // query: this.query,
        categoryId: this.categoryId,
        showModal: this.showModal
      }
    });
  }

  showCollectionsModal( owc: OwcContext ): void {
    // console.log('owc modal clicked');
    this.resultCollectionsModalComponentRef.showFeatureModal(owc);
  }

  onHideCollectionsModal(): void {
    // console.log('owc modal close');
    // dont need to call anything right now this.resultCollectionsModalComponentRef.hideCollectionsModal();
  }

  /**
   * tries to find a preview icon from the embedded features, OwcContext does not have a preview itself
   * @param {OwcContext} owc
   * @param {string} defaultImage
   * @returns {string}
   */
  hasPreviewIcon( owc: OwcContext, defaultImage: string ): string {
    if (owc.features && owc.features.length > 0) {
      const previewLinks: OwcLink[][] = owc.features.filter(f => {
        return (f.properties.links && f.properties.links.previews && f.properties.links.previews.length > 0);
      }).map(f => f.properties.links.previews);
      const flattenedArray = ([] as OwcLink[]).concat(...previewLinks);
      // console.log(flattenedArray);
      if (flattenedArray && flattenedArray.length > 0) {
        const firstLink = flattenedArray.find(ol => ol.href ? ol.href.includes('http') : false);
        if (firstLink) {
          return firstLink.href;
        } else {
          return defaultImage;
        }
      } else {
        return defaultImage;
      }
    } else {
      return defaultImage;
    }
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
    // console.log('getTopicCategoriesOfResults' + uniqueCat);
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
    // console.log('finalQuery:' + finalQuery);
    if (finalQuery.length <= 0) {
      console.log('query undefined this should not happen');
    }
    return finalQuery;
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
