import {Component, Input} from '@angular/core';
import {IGeoFeature} from '../result';


@Component({
  selector: 'my-result-detail',
  templateUrl: './result-detail.component.html'
})

export class ResultDetailComponent {
  @Input()
  result: IGeoFeature;
}
