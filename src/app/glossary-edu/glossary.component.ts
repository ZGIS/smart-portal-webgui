import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sac-gwh-glossary',
  templateUrl: 'glossary.component.html'
})

/**
 * Glossary Component
 */
export class GlossaryComponent {

  constructor(private _location: Location) {
  }

  backClicked() {
    this._location.back();
  }
}

