import { Component, OnInit } from '@angular/core';
import { IGeoFeature, IGeoFeatureCollection, IErrorResult } from './result';
import { ResultService } from './result.service';
import * as moment from 'moment';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { NotificationService } from '../notifications/notification.service';
import { Extent } from 'openlayers';

@Component({
  selector: 'app-sac-gwh-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})

/**
 * Search Component
 */
export class SearchComponent implements OnInit {

  /**
   * initial search
   * @type {{query: string; fromDate: Date; toDate: Date; bbox: [number,number,number,number];
   *         bboxWkt: string; maxNumberOfResults: number}}
   */
  search: Search = {
    query: '*:*',
    fromDate: moment('1970-01-01', this.DATE_FORMAT).toDate(),
    toDate: new Date(),
    bbox: [168, -50, 180, -33],
    bboxWkt: '',
    maxNumberOfResults: 100
  };

  /**
   * Search results
   */
  results: IGeoFeatureCollection;
  selectedResult: IGeoFeature;

  isLoading = false;
  currentUrl: String;

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
        console.log('setting bbox');
        this.search.bbox = JSON.parse(params['bbox']);
      } else {
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
    console.log(`bbox changed to '${$event.bboxWkt}'`);
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
    this.notificationService.addNotification({message: 'URL successfully copied to clipboard', type: 'success'});
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
