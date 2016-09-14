import {Component} from '@angular/core';
import {Result} from '../result';
import {ResultService} from '../result.service';


@Component({
  selector: 'sac-gwh-home',
  templateUrl: 'app/search/search.component.html',
  styleUrls: ['app/search/search.component.css']
})

export class SearchComponent {
  search: Search = {
    query: '*:*',
    fromDate: '1970-01-01',
    toDate: '2020-01-01',
    bboxWkt: ''
  };
  results: Result[];
  selectedResult: Result;

  constructor(private resultService: ResultService) {
  }

  ngOnInit(): void {
    this.getResults();
  }

  onSelect(result: Result): void {
    this.selectedResult = result;
  }

  getResults(): void {
    this.resultService.getResults().then(results => this.results = results);
  }
}

export class Search {
  query: string;
  fromDate: string;
  toDate: string;
  bboxWkt: string;
}
