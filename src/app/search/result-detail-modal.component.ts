import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IGeoFeature } from './result';

@Component({
  selector: 'app-sac-gwh-result-detail-modal',
  templateUrl: 'result-detail-modal.component.html'
})

export class ResultDetailModalComponent {
  feature: IGeoFeature;

  @Output() onHide = new EventEmitter();

  @ViewChild('resultModalRef') public modal: ModalDirective;

  showFeatureModal(geoFeature: IGeoFeature) {
    if (geoFeature !== undefined) {
      this.feature = geoFeature;
      this.modal.show();
    }
  };

  hideFeatureModal() {
    this.modal.hide();
  };

  onHideModal() {
    this.onHide.emit();
  }
}
