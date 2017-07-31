import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IErrorResult, IGeoFeature } from './result';
import { OwcContext, OwcResource } from '../owc/collections';
import { ResultService } from './result.service';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-sac-gwh-result-detail-modal',
  templateUrl: 'result-detail-modal.component.html'
})

export class ResultDetailModalComponent {
  feature: IGeoFeature;
  owcFeature: OwcResource;

  @Output() onHide = new EventEmitter();

  @ViewChild('resultModalRef') public modal: ModalDirective;

  constructor( private resultService: ResultService,
               private notificationService: NotificationService ) {
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

  hideFeatureModal() {
    this.modal.hide();
  }

  onHideModal() {
    this.onHide.emit();
  }
}
