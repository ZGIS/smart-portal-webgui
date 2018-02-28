import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OwcContext } from '../owc';
import { IGeoFeature } from './result';

@Component({
  selector: 'app-sac-gwh-result-collections-modal',
  templateUrl: 'result-collections-view-modal.component.html'
})

export class ResultCollectionsViewModalComponent {
  @Input() owcCollection: OwcContext;
  @Input() viewOnly = true;

  @Output() onHideCollectionsModalEvent = new EventEmitter();

  @ViewChild('resultCollectionsModalRef') public modal: ModalDirective;

  showFeatureModal( owc: OwcContext ) {
    if (owc !== undefined) {
      this.owcCollection = owc;
    }
    this.modal.show();
  }

  hideCollectionsModal() {
    this.modal.hide();
  }

  onHideCollectionsModal() {
    this.onHideCollectionsModalEvent.emit();
  }

}
