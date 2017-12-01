import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { OwcContext, CollectionsService } from './';
import { UserFile, UserMetaRecord } from '../workbench';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-sac-gwh-collections-desk',
  templateUrl: 'collections-desk.component.html'
})

/**
 * Shows collections of the current user
 */
export class CollectionsDeskComponent implements OnInit {

  @ViewChild('createCollectionModalRef') public createCollectionModal: ModalDirective;
  loading = false;
  newdocintro: any = {};
  userFiles: UserFile[] = [];
  userMetaRecords: UserMetaRecord[] = [];

  myCollections: OwcContext[] = [];
  private _myDefaultCollection: OwcContext;

  /**
   * shows the modal
   */
  showCreateCollectionModal() {
    this.createCollectionModal.show();
  }

  /**
   * hides the modal
   */
  hideCreateCollectionModal() {
    this.createCollectionModal.hide();
  }

  reloadCollections(): void {
    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          this.myCollections = [];
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            this.myCollections.push(owcDoc);
            console.log(owcDoc.id);
          });
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The collections have been reloaded.`
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this._myDefaultCollection = owcDoc;
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `The default collections has been reloaded.`
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * shouldn't trust the client I guess, request fresh empty custom collection and adds initial edits
   * @param {string} title
   * @param {string} abstract
   */
  createCollection( title: string, subtitle: string ): void {
    const templateUuid = this.collectionsService.getNewUuid();
    const id = 'https://portal.smart-project.info/context/user/' + templateUuid;
    console.log('we create a new collection: ' + id);
    this.collectionsService.createNewCustomCollection()
      .subscribe(
        owcDoc => {
          // this.myCollections.push(owcDoc);
          let newDoc = owcDoc;
          newDoc.properties.title = title;
          newDoc.properties.subtitle = subtitle;
          console.log(owcDoc);
          this.collectionsService.updateCollection(newDoc)
            .subscribe(
              updatedDoc => {
                this.notificationService.addNotification({
                  id: NotificationService.DEFAULT_DISMISS,
                  type: 'info',
                  message: `A new custom collection has been created and added to your data.`,
                  details: `Created a new collection, ${id}`
                });
                this.hideCreateCollectionModal();
                this.reloadCollections();
              },
              error => {
                console.log(<any>error);
                this.notificationService.addErrorResultNotification(error);
              });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * Constructor
   * @param collectionsService  - injected CollectionsService
   * @param notificationService - injected NotificationService
   */
  constructor( private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  /**
   * OnInit - load current user's collections
   */
  ngOnInit(): void {
    // get owcDoc from secure api end point
    this.collectionsService.getCollections()
      .subscribe(
        owcDocs => {
          owcDocs.forEach(( owcDoc: OwcContext ) => {
            this.myCollections.push(owcDoc);
            console.log(owcDoc.id);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this._myDefaultCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

}
