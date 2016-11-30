import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { IGeoFeature } from './result';

// webpack html imports
let template = require('./result-detail-modal.component.html');

@Component({
  selector: 'result-detail-modal',
  template: template
})

export class ResultDetailModalComponent {
  result: IGeoFeature;
  @ViewChild('lgModal') modal: ModalDirective;

  show(result: IGeoFeature) {
    if (result !== undefined) {
      this.result = result;
      this.modal.show();
    }
  }
}
