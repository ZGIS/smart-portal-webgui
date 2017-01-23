import { Component, OnInit } from '@angular/core';
import { IGeoFeature, IGeoFeatureCollection } from './result';
import { ResultService } from './result.service';
import * as moment from 'moment';
import { Ol3MapExtent } from '../ol3-map/ol3-map.component';


@Component({
  selector: 'app-sac-gwh-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.css']
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
  loading = false;

  constructor(private resultService: ResultService) {
  }

  ngOnInit(): void {
    this.results = {
      'type': 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      'features': []
    };
  }

  getResults(): void {
    this.loading = true;
    this.resultService.getResults(
      this.search.query,
      moment(this.search.fromDate).format('YYYY-MM-DD'),
      moment(this.search.toDate).format('YYYY-MM-DD'),
      this.search.bboxWkt)
      .then(results => {
        this.results = results;
        this.loading = false;
      });
  }

  bboxChanged($event: Ol3MapExtent) {
    console.log(`bbox changed to '${$event.bboxWkt}'`);
    this.search.bboxWkt = $event.bboxWkt;
  }

  onEnter(event) {
    if (event.keyCode === 13) {
      this.getResults();
    }
  }
}

export class Search {
  query: string;
  fromDate: Date;
  toDate: Date;
  bboxWkt: string;
}
