import {Component, OnInit} from '@angular/core';

import {Result} from './result';
import {ResultService} from './result.service';

@Component({
  selector: 'sac-gwh-app',
  templateUrl: 'app/app.component.html',
  styleUrls: [ 'app/app.component.css' ]
})

export class AppComponent {
  title = 'Groundwater Hub';
}
