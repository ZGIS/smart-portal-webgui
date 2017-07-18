import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { OwcResource } from './';

@Component({
  selector: 'app-sac-gwh-owcresource-detail-modal',
  templateUrl: 'owc-resource-detail-modal.component.html'
})

export class OwcResourceDetailModalComponent {
  owcResource: OwcResource;

  @ViewChild('owcResourceDetailModalRef') public modal: ModalDirective;

  showOwcResourceModal(owcFeature: OwcResource) {
    if (owcFeature !== undefined) {
      this.owcResource = owcFeature;
      this.modal.show();
    }
  }

  hideOwcResourceModal() {
    this.modal.hide();
  }

  reloadResource(): void {
    console.log('we reload this resource entry');
  }

  editProperties(): void {
    console.log('we edit the properties');
  }

  deleteResource(): void {
    console.log('we delete this resource entry');
  }
}
