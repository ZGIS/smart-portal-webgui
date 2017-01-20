import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap';
import { IGeoFeature } from './result';

@Component({
  selector: 'result-detail-modal',
  templateUrl: 'result-detail.component.html'
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
