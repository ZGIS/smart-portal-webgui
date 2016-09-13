import {Component, OnInit} from "@angular/core";

import {Result} from "./result"
import {ResultDetailComponent} from "./result-detail.component"
import {ResultService} from "./result.service";

@Component({
  selector: 'my-app',
  template: `
      <h1>{{title}}</h1><br/>
      <h2>Search</h2><br/>
      <div class="box">
        <div><label>query</label><input [(ngModel)]="search.query" placeholder="search query"/></div>
        <div><label>date</label><input [(ngModel)]="search.fromDate" placeholder="1970-01-01"/><input value="{{search.toDate}}" placeholder="1970-01-01"/></div>
        <div><label>bboxWkt</label><input [(ngModel)]="search.bboxWkt" placeholder="ENVELOPE(-180,180,90,-90)"/></div>
      </div>
      
      <h2>Results</h2>
      <div class="box">
        <ul class="results">
          <li *ngFor="let result of results"
              [class.selected]="result===selectedResult"
              (click)="onSelect(result)">
             <span class="badge">{{result.title}}</span> {{result.title}}
          </li>
        </ul>
      </div>
      
      <my-result-detail [result]="selectedResult"></my-result-detail>
  `,

  styles: [`
  .selected {
    background-color: #CFD8DC !important;
    color: white;
  }
  .results {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;
  }
  .results li {
    cursor: pointer;
    position: relative;
    left: 0;
    background-color: #EEE;
    margin: .5em;
    padding: .3em 0;
    height: 1.6em;
    border-radius: 4px;
  }
  .results li.selected:hover {
    background-color: #BBD8DC !important;
    color: white;
  }
  .results li:hover {
    color: #607D8B;
    background-color: #DDD;
    left: .1em;
  }
  .results .text {
    position: relative;
    top: -3px;
  }
  .results .badge {
    display: inline-block;
    font-size: small;
    color: white;
    padding: 0.8em 0.7em 0 0.7em;
    background-color: #607D8B;
    line-height: 1em;
    position: relative;
    left: -1px;
    top: -4px;
    height: 1.8em;
    margin-right: .8em;
    border-radius: 4px 0 0 4px;
  }
`]
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

