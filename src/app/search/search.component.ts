import { Component, OnInit, OnDestroy } from '@angular/core';
import { IGeoFeature, IGeoFeatureCollection } from './result';
import { ResultService } from './result.service';
import * as moment from 'moment';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-sac-gwh-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
})

export class SearchComponent implements OnInit, OnDestroy {
  search: Search = {
    query: '*:*',
    fromDate: moment('1970-01-01', this.DATE_FORMAT).toDate(),
    toDate: new Date(),
    bbox: [168, -50, 180, -33],
    bboxWkt: ''
  };

  results: IGeoFeatureCollection;
  selectedResult: IGeoFeature;

  loading = false;

  private DATE_FORMAT = 'YYYY-MM-DD';
  private timeoutId: number;

  constructor(private resultService: ResultService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

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
        this.search.toDate =  new Date();
      }

      if (params['bbox']) {
        this.search.bbox = JSON.parse(params['bbox']);
      } else {
        this.search.bbox = this.search.bbox;
      }

      if (!isNullOrUndefined(params['query'])) {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.timeoutId = window.setTimeout(() => {
          this.getResults();
        }, 250);
      }

      console.log(this.search);
    });
  }

  ngOnDestroy(): void {
    // left empty
  }

  doSearch(): void {
    this.router.navigate(['/search'], {
      queryParams: {
        query: this.search.query,
        fromDate: this.formatDate(this.search.fromDate),
        toDate: this.formatDate(this.search.toDate),
        bbox: JSON.stringify(this.search.bbox)
      }});
  }

  getResults(): void {
    console.log('getResults()');
    this.loading = true;
    this.resultService.getResults(
      this.search.query,
      this.formatDate(this.search.fromDate),
      this.formatDate(this.search.toDate),
      this.search.bboxWkt)
      .then(results => {
        this.results = results;
        this.loading = false;
      });
  }

  bboxChanged($event: Ol3MapExtent) {
    console.log(`bbox changed to '${$event.bboxWkt}'`);
    this.search.bbox = $event.bbox;
    this.search.bboxWkt = $event.bboxWkt;
    this.doSearch();
  }

  onKeydownSearchform(event: any) {
    if (event.keyCode === 13) {
      this.doSearch();
    }
  }

  formatDate(date: Date) {
    return moment(date).format(this.DATE_FORMAT);
  }
}

export class Search {
  query: string;
  fromDate: Date;
  toDate: Date;
  bbox: number[];
  bboxWkt: string;
}
