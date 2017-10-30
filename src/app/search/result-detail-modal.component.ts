import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IErrorResult, IGeoFeature } from './result';
import { OwcContext, OwcResource, CollectionsService } from '../owc';
import { ResultService } from './result.service';
import { NotificationService } from '../notifications/notification.service';
import { logger } from 'codelyzer/util/logger';

@Component({
  selector: 'app-sac-gwh-result-detail-modal',
  templateUrl: 'result-detail-modal.component.html'
})

export class ResultDetailModalComponent {
  feature: IGeoFeature;
  owcFeature: OwcResource;
  myCollections: OwcContext[];
  activeCollectionId = '';

  @Output() onHide = new EventEmitter();

  @ViewChild('resultModalRef') public modal: ModalDirective;

  constructor( private resultService: ResultService,
               private notificationService: NotificationService,
               private collectionsService: CollectionsService ) {

    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          this.myCollections = [];
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            this.myCollections.push(owcDoc);
            console.log(owcDoc.id);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  showFeatureModal( geoFeature: IGeoFeature ) {
    if (geoFeature !== undefined) {
      this.feature = geoFeature;

      this.resultService.getResultsAsOwcGeoJson(
        `fileIdentifier:"${geoFeature.properties.fileIdentifier}"`
      ).subscribe(
        ( results: OwcContext ) => {
          if (results.features.length > 0) {
            this.owcFeature = results.features[ 0 ];
          } else {
            this.notificationService.addNotification({
              id: NotificationService.MSG_ID_DOCUMENT_NOT_FOUND,
              message: `Document ${geoFeature.properties.fileIdentifier}
              could not be found in CSW index. Maybe it is not a metadata document?`,
              type: NotificationService.NOTIFICATION_TYPE_WARNING
            });
            this.hideFeatureModal();
          }
        },
        ( error: IErrorResult ) => {
          this.notificationService.addErrorResultNotification(error);
        });

      this.modal.show();
    }
  }

  copyToMyCollection( owcResource: OwcResource ) {
    if (this.activeCollectionId.length > 0) {
      this.collectionsService.addCopyOfResourceResourceToCollection(this.activeCollectionId, owcResource).subscribe(
        ( results: OwcContext ) => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            message: `Document was successfully added to ${results.properties.title}.`,
            type: NotificationService.NOTIFICATION_TYPE_SUCCESS
          });
          console.log('We need to reload the collection!');
        }, ( error: IErrorResult ) => {
          this.notificationService.addErrorResultNotification(error);
        });
    } else {
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        message: `Please select a collection to which you would to add this to!`,
        type: NotificationService.NOTIFICATION_TYPE_WARNING
      });
    }
  }

  hideFeatureModal() {
    this.modal.hide();
  }

  onHideModal() {
    this.onHide.emit();
  }
}
