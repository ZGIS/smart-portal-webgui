import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { OwcContext } from '../owc';
import { OwcResource } from '../owc/collections';
import { OwcResourceDetailModalComponent } from '../owc/owc-resource-detail-modal.component';

@Component({
  selector: 'app-sac-gwh-result-collections-modal',
  templateUrl: 'result-collections-view-modal.component.html'
})

export class ResultCollectionsViewModalComponent {
  @Input() owcCollection: OwcContext;
  @Input() viewOnly = true;

  // this is the self modal
  @ViewChild('resultCollectionsModalRef') public modal: ModalDirective;
  @ViewChild(OwcResourceDetailModalComponent) owcResourceDetailModalComponentRef: OwcResourceDetailModalComponent;

  showFeatureModal( owc: OwcContext ) {
    if (owc !== undefined) {
      this.owcCollection = owc;
    }
    this.modal.show();
  }

  hideCollectionsModal() {
    this.modal.hide();
  }

  handleShowChildResourceModal( $event: any ) {
    console.log('handleShowChildResourceModal()');
    if ($event.data.owcResource && $event.data.owcResource && $event.data.collectionId) {
      console.log($event.data);
      if (<OwcResource>$event.data.owcResource) {
        console.log('need to send one deeper??');
        this.owcResourceDetailModalComponentRef.showOwcResourceModal($event.data.owcResource, $event.data.collectionId);
      }
    }
  }

}
