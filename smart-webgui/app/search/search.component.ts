import {Component, OnInit} from '@angular/core';
import {IGeoFeature, IGeoFeatureCollection} from '../result';
import {ResultService} from '../result.service';
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
  results: IGeoFeatureCollection;
  selectedResult: IGeoFeature;

  constructor(private resultService: ResultService) {
  }

  ngOnInit(): void {
    this.results = {
      'type': 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      'features': []
    };
  }

  onSelect(result: IGeoFeature): void {
    this.selectedResult = result;
  }

  getResults(): void {
    this.resultService.getResults(
      this.search.query,
      moment(this.search.fromDate).format('YYYY-MM-DD'),
      moment(this.search.toDate).format('YYYY-MM-DD'),
      this.search.bboxWkt)
      .then(results => this.results = results);
  }

  bboxChanged($event: any) {
    console.log(`bbox changed to '${$event}'`);
    this.search.bboxWkt = $event;
  }
}

export class Search {
  query: string;
  fromDate: Date;
  toDate: Date;
  bboxWkt: string;
}
