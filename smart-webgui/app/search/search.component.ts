import {Component, OnInit} from '@angular/core';
import {IGeoFeature} from '../result';
import {ResultService} from '../result.service';

import { DatepickerModule } from 'ng2-bootstrap/ng2-bootstrap';

import * as moment from 'moment';


@Component({
  selector: 'sac-gwh-home',
  templateUrl: 'app/search/search.component.html',
  styleUrls: ['app/search/search.component.css']
})

export class SearchComponent implements OnInit {
  search: Search = {
    query: '*:*',
    fromDate: moment('1970-01-01', 'YYYY-MM-DD').toDate(),
    toDate: new Date(),
    bboxWkt: ''
  };
  results: IGeoFeature[];
  selectedResult: IGeoFeature;

  constructor(private resultService: ResultService) {
  }

  ngOnInit(): void {
    this.results = [];
  }

  onSelect(result: IGeoFeature): void {
    this.selectedResult = result;
  }

  getResults(): void {
    this.resultService.getResults(
          this.search.query,
          moment(this.search.fromDate).format("YYYY-MM-DD"),
          moment(this.search.toDate).format("YYYY-MM-DD"),
          this.search.bboxWkt)
      .then(results => this.results = results);
  }
}

export class Search {
  query: string;
  fromDate: Date;
  toDate: Date;
  bboxWkt: string;
}
