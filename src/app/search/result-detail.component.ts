import { Component, Input } from '@angular/core';
import { IGeoFeature } from './result';


@Component({
  selector: 'app-sac-gwh-result-detail',
  templateUrl: 'result-detail.component.html'
})

export class ResultDetailComponent {
  @Input()
  feature: IGeoFeature;
}
