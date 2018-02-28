import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../notifications';
import { OwcContext, CollectionsService, OwcResource } from './';

@Component({
  selector: 'app-sac-gwh-owcresource-detail-modal',
  templateUrl: 'owc-resource-detail-modal.component.html'
})

export class OwcResourceDetailModalComponent {
  @Input() owcResource: OwcResource;
  @Input() collectionid: string;
  @Input() viewOnly = true;

  @ViewChild('owcResourceDetailModalRef') public modal: ModalDirective;

  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param notificationService - injected NotificationService
   */
  constructor(private collectionsService: CollectionsService,
              private notificationService: NotificationService) {
  }

  showOwcResourceModal(owcFeature: OwcResource, owccontextid: string) {
    if (owcFeature !== undefined && owccontextid !== undefined) {
      this.owcResource = owcFeature;
      this.collectionid = owccontextid;
      this.modal.show();
    }
  }

  hideOwcResourceModal() {
    this.modal.hide();
  }

  reloadResource(): void {
    // console.log('we reload this resource entry');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Refresh this resource entry, not yet implemented.`
    });
  }

  editProperties(): void {
    // console.log('we edit the properties');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Editing of this resource entry, not yet implemented.`
    });
  }

  deleteResource(): void {
    // console.log('we delete this resource entry');
    this.collectionsService.deleteResourceFromCollection(this.collectionid, this.owcResource.id).subscribe(
      deleted => {
        // console.log('deleted ' + deleted);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `This resource entry has been deleted. Please reload your collections to reflect the update!`
        });
        // console.log('We need to reload the collection!');
        this.hideOwcResourceModal();
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });

  }
}
