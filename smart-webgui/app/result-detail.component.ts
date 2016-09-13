import { Component, Input } from '@angular/core';

import {Result} from './result';


@Component({
  selector: 'my-result-detail',
  templateUrl: 'app/result-detail.component.html'
})

export class ResultDetailComponent {
  @Input()
  result: Result;
}
