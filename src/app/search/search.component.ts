import { Component, OnInit } from '@angular/core';
import { IGeoFeature, IGeoFeatureCollection, IErrorResult } from './result';
import { ResultService } from './result.service';
import * as moment from 'moment';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { NotificationService } from '../notifications/notification.service';
import { Extent } from 'openlayers';

/**
 * Search Component
 */
@Component({
  selector: 'app-sac-gwh-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})

export class SearchComponent implements OnInit {

  /** initial search */
  search: Search = {
    query: '*:*',
    fromDate: moment('1970-01-01', this.DATE_FORMAT).toDate(),
    toDate: new Date(),
    bbox: [168, -50, 180, -33],
    bboxWkt: '',
    maxNumberOfResults: 100
  };

  /** Search results */
  results: IGeoFeatureCollection;

  /** The selected search result */
  selectedResult: IGeoFeature;

  /** indicator if search mask is waiting for ajax request */
  isLoading = false;

  textFilter = '';

  /** current URL */
  currentUrl: String;

  /** default date format */
  private DATE_FORMAT = 'YYYY-MM-DD';

  private timeoutId: number;

  /**
   * Constructor
   * @param resultService       - injected ResultService
   * @param router              - injected Router
   * @param activatedRoute      - injected ActivatedRoute
   * @param notificationService - injected NotificationService
   */
  constructor(private resultService: ResultService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notificationService: NotificationService) {
  }

  /**
   * initializes the component. Specifically reads the URL parameters and makes the search.
   */
  ngOnInit(): void {
    // parse values from
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.search.query = params['query'] || this.search.query;

      if (moment(params['fromDate'], this.DATE_FORMAT).isValid()) {
        this.search.fromDate = moment(params['fromDate'], this.DATE_FORMAT).toDate();
      } else {
        this.search.fromDate = moment('1970-01-01', this.DATE_FORMAT).toDate();
      }

      if (moment(params['toDate'], this.DATE_FORMAT).isValid()) {
        this.search.toDate = moment(params['toDate'], this.DATE_FORMAT).toDate();
      } else {
        this.search.toDate = new Date();
      }

      if (params['bbox']) {
        let paramBbox = JSON.parse(params['bbox']);
        console.log(`params bbox for search '${paramBbox}'`);
        this.search.bbox = paramBbox;
      } else {
        console.log(`keep bbox for search '${this.search.bbox}'`);
        this.search.bbox = this.search.bbox;
      }

      if (params['maxNumberOfResults']) {
        this.search.maxNumberOfResults = params['maxNumberOfResults'];
      } else {
        this.search.maxNumberOfResults = undefined;
      }

      if (!isNullOrUndefined(params['query'])) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(() => {
          this.getResults();
          this.currentUrl = window.location.href;
        }, 250);
      }
    });
  }

  /**
   * navigates to /serach with the correct parameters
   */
  doSearch(): void {
    this.router.navigate(['/search'], {
      queryParams: this.getQueryParams()
    });
  }

  /**
   * Parse query parameters
   * @param maxNumberOfResults
   * @returns {{query: string, fromDate: string, toDate: string, bbox: string, maxNumberOfResults: number}}
   */
  getQueryParams(maxNumberOfResults?: number): any {
    return {
      query: this.search.query,
      fromDate: this.formatDate(this.search.fromDate),
      toDate: this.formatDate(this.search.toDate),
      bbox: JSON.stringify(this.search.bbox),
      maxNumberOfResults: maxNumberOfResults
    };
  }

  /**
   * calls the ResultService with the current query and handles the search result / error
   */
  getResults(): void {
    this.isLoading = true;
    this.resultService.getResults(
      this.search.query,
      this.formatDate(this.search.fromDate),
      this.formatDate(this.search.toDate),
      this.search.bboxWkt,
      this.search.maxNumberOfResults)
      .subscribe(
        (results: IGeoFeatureCollection) => {
          this.results = results;

          // we got less results than matched documents => create alert with notification
          if (results.count < results.countMatched) {
            // creates the URL for the alert-box notification
            let urlTree = this.router.createUrlTree(['/search'], {
              queryParams: {
                query: this.search.query,
                fromDate: this.formatDate(this.search.fromDate),
                toDate: this.formatDate(this.search.toDate),
                bbox: JSON.stringify(this.search.bbox),
                maxNumberOfResults: -1
              }
            });
            let url = '#' + urlTree.toString();
            this.notificationService.addNotification({
              id: NotificationService.MSG_ID_SHOW_ALL_RESULTS,
              type: 'info',
              message: `Ommited some search results. <a href="${url}"><i class="fa fa-eye"></i>&nbsp;show all</a>`
            });
          }
          this.isLoading = false;
        },
        (error: IErrorResult) => {
          this.notificationService.addErrorResultNotification(error);
          this.isLoading = false;
        });
  }

  /**
   * eventhandler when bounding box in map was changed
   * @param $event
   */
  bboxChanged($event: Ol3MapExtent) {
    console.log(`bboxChanged emitted '${$event.bbox}'`);
    this.search.bbox = $event.bbox;
    this.search.bboxWkt = $event.bboxWkt;
    this.doSearch();
  }

  /**
   * event handler when key is pressed in search form. This enables search on press ENTER in search form.
   * @param event
   */
  onKeydownSearchform(event: any) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  /**
   * helper function to format date to string defined in this.DATE_FORMAT
   * @param date
   * @returns {string}
   */
  formatDate(date: Date) {
    return moment(date).format(this.DATE_FORMAT);
  }

  /**
   * on URL sucessfully copied to clipboard
   */
  onClipboardSuccess() {
    this.notificationService.addNotification({
      id: NotificationService.MSG_ID_URL_COPIED_TO_CLIPBOARD,
      message: 'URL successfully copied to clipboard', type: 'success',
      dismissAfter: 1500
    });
  }

  /**
   * filter results by textFilter
   *
   * @returns {IGeoFeature[]}
   */
  getFilteredResults(): IGeoFeature[] {
    if (this.results) {
      return this.results.features
        .filter((item) =>
          item.properties.title.toLocaleLowerCase().indexOf(this.textFilter.toLocaleLowerCase()) >= 0);
    }
  }
}

/**
 * helper class that defines all parameter used for a search
 */
export class Search {
  query: string;
  fromDate: Date;
  toDate: Date;
  bbox: Extent;
  bboxWkt: string;
  maxNumberOfResults: number;
}
