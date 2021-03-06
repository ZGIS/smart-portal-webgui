import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IErrorResult, IGeoFeature } from './result';
import { CollectionsService, OwcContext, OwcResource } from '../owc';
import { ResultService } from './result.service';
import { NotificationService } from '../notifications/notification.service';
import { AccountService } from '../account';
import { PORTAL_API_URL } from '../in-app-config';

@Component({
  selector: 'app-sac-gwh-result-detail-modal',
  templateUrl: 'result-detail-modal.component.html'
})

export class ResultDetailModalComponent implements OnInit {
  feature: IGeoFeature;
  owcFeature: OwcResource;
  myCollections: OwcContext[] = [];
  loggedIn = false;
  activeCollectionId = '';

  dataA2aUrlExt_base = this.portalApiUrl.replace('/api/v1', '/#/context/resource/');
  dataA2aUrlExt = this.dataA2aUrlExt_base;

  @Output() onHide = new EventEmitter();

  @ViewChild('resultModalRef') public modal: ModalDirective;

  constructor( private resultService: ResultService,
               private notificationService: NotificationService,
               private accountService: AccountService,
               private collectionsService: CollectionsService,
               @Inject(PORTAL_API_URL) private portalApiUrl: string ) {
  }

  ngOnInit(): void {
    this.accountService.isLoggedIn().subscribe(
      loggedInResult => {
        if (loggedInResult === true) {
          this.loggedIn = true;
          this.collectionsService.getCollections()
            .subscribe(
              owcDocs => {
                this.myCollections = [];
                owcDocs.forEach(( owcDoc: OwcContext ) => {
                  this.myCollections.push(owcDoc);
                  // console.log(owcDoc.id);
                });
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        } else {
          console.log('logged in? ' + loggedInResult);
        }
      },
      error => {
        console.log(<any>error);
        console.log('not logged in');
      });
  }

  showFeatureModal( geoFeature: IGeoFeature ) {
    if (geoFeature !== undefined) {
      this.feature = geoFeature;

      if (this.checkIfUrl(geoFeature.properties.fileIdentifier)) {
        // will know if it's complete url identifier
        this.dataA2aUrlExt = geoFeature.properties.fileIdentifier;
      } else {
        this.dataA2aUrlExt = this.dataA2aUrlExt_base + geoFeature.properties.fileIdentifier;
      }

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
          // console.log('We need to reload the collection!');
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

  private checkIfUrl( testUrl: string ): boolean {
    return new RegExp('[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?').test(testUrl);
  }
}
