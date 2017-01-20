import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { IGeoFeature } from './result';

@Component({
  selector: 'app-sac-gwh-result-detail-modal',
  templateUrl: 'result-detail-modal.component.html'
})

export class ResultDetailModalComponent {
  feature: IGeoFeature;
  // @ViewChild('lgModal') public modal: ModalDirective;
  @ViewChild('resultModalRef') public modal: ModalDirective;

  showFeatureModal(geoFeature: IGeoFeature) {
    if (geoFeature !== undefined) {
      this.feature = geoFeature;
      this.modal.show();
    }
  }
}
