import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sac-gwh-not-found',
  templateUrl: 'not-found.component.html'
})

/**
 * NotFound Component
 */
export class NotFoundComponent {

  constructor(private _location: Location) {
  }

  backClicked() {
    this._location.back();
  }
}
;

