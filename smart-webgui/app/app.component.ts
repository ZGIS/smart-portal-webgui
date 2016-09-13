import {Component, OnInit} from "@angular/core";

import {Result} from "./result"
import {ResultDetailComponent} from "./result-detail.component"
import {ResultService} from "./result.service";

@Component({
  selector: 'my-app',
  templateUrl: 'app/app.component.html'
})

export class AppComponent implements OnInit{
  title = 'SMART webgui'
  search: Search = {
    query: '*:*',
    fromDate: '1970-01-01',
    toDate: '2020-01-01',
    bboxWkt: ''
  }
  results: Result[];
  selectedResult: Result;

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {
    this.getResults();
  }

  onSelect(result: Result): void {
    this.selectedResult = result;
  }

  getResults(): void {
    this.resultService.getResults().then(results => this.results = results)
  }
}

export class Search {
  query: string;
  fromDate: string;
  toDate: string;
  bboxWkt: string;
}

