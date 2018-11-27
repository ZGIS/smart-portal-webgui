import { Component, Inject, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { OwcContext, OwcResource, OwcResourceDetailModalComponent } from '../owc';
import { PORTAL_API_URL } from '../in-app-config';
import { NotificationService } from '../notifications';

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

  dataA2aUrlExt_base = this.portalApiUrl.replace('/api/v1', '/#/context/document/');
  dataA2aUrlExt = this.dataA2aUrlExt_base;

  constructor( private notificationService: NotificationService,
               @Inject(PORTAL_API_URL) private portalApiUrl: string ) {
  }

  /**
   * on URL sucessfully copied to clipboard
   */
  onClipboardSuccess() {
    this.notificationService.addNotification({
      id: NotificationService.MSG_ID_URL_COPIED_TO_CLIPBOARD,
      message: 'URL successfully copied to clipboard', type: 'success',
      dismissAfter: 1500
    });
  }

  showFeatureModal( owc: OwcContext ) {
    if (owc !== undefined) {
      this.owcCollection = owc;
      if (this.checkIfUrl(this.owcCollection.id)) {
        // will know if it's complete url identifier
        this.dataA2aUrlExt = this.owcCollection.id;
      } else {
        this.dataA2aUrlExt = this.dataA2aUrlExt_base + this.owcCollection.id;
      }
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

  private checkIfUrl( testUrl: string ): boolean {
    return new RegExp('[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?').test(testUrl);
  }

}
