import { Component, Input } from '@angular/core';

import {Result} from "./result"


@Component({
  selector: 'my-result-detail',
  template: `
      <div *ngIf="result">
        <h2>Details for {{result.title}}</h2>
        <div class="box">
          <div><label>title: </label><input [(ngModel)]="result.title"/></div>
        </div>
      </div>
  `
})

export class ResultDetailComponent {
  @Input()
  result: Result;
}
