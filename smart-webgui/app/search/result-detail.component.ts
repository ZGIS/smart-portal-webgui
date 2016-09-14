import {Component, Input} from '@angular/core';
import {Result, IGeoFeature} from '../result';


@Component({
  selector: 'my-result-detail',
  templateUrl: 'app/search/result-detail.component.html'
})

export class ResultDetailComponent {
  @Input()
  result: IGeoFeature;
}
