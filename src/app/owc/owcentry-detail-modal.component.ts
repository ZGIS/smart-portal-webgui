import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOwcEntry } from './';

@Component({
  selector: 'app-sac-gwh-owcentry-detail-modal',
  templateUrl: 'owcentry-detail-modal.component.html'
})

export class OwcEntryDetailModalComponent {
  owcEntry: IOwcEntry;

  @ViewChild('owcEntryDetailModalRef') public modal: ModalDirective;

  showOwcEntryModal(owcFeature: IOwcEntry) {
    if (owcFeature !== undefined) {
      this.owcEntry = owcFeature;
      this.modal.show();
    }
  }

  hideOwcEntryModal() {
    this.modal.hide();
  }
}
