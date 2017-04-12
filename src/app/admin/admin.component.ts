import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sac-gwh-admin',
  templateUrl: 'admin.component.html'
})

/**
 * Admin Component, create delete organisations, add remove users for organisations, delete / moderate general stuff
 */
export class AdminComponent {

  constructor(private _location: Location) {
  }

  backClicked() {
    this._location.back();
  }
}
;

