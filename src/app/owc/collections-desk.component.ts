import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from '../notifications';
import { CollectionsService, OwcContext } from './';
import { UserFile, UserMetaRecord, WorkbenchService } from '../workbench';
import { ModalDirective } from 'ngx-bootstrap';
import { OwcContextsRightsMatrix } from '../workbench/workbench.types';

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
  fileparseerror = true;
  newdocintro: any = {};
  importOwcDoc: any = {};
  userFiles: UserFile[] = [];
  userMetaRecords: UserMetaRecord[] = [];

  myCollections: OwcContext[] = [];
  myRightsMatrix: OwcContextsRightsMatrix[] = [];
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
            // console.log(owcDoc.id);
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
          // this.notificationService.addNotification({
          //   id: NotificationService.DEFAULT_DISMISS,
          //   type: 'info',
          //   message: 'The default collections has been reloaded.'
          // });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });

    this.collectionsService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          this.myRightsMatrix = [];
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            console.log(matrix);
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
    // console.log('we create a new collection: ' + id);
    this.collectionsService.createNewCustomCollection()
      .subscribe(
        owcDoc => {
          // this.myCollections.push(owcDoc);
          let newDoc = owcDoc;
          newDoc.properties.title = title;
          newDoc.properties.subtitle = subtitle;
          // console.log(owcDoc);
          this.collectionsService.updateCollection(newDoc)
            .subscribe(
              updatedDoc => {
                this.notificationService.addNotification({
                  id: NotificationService.DEFAULT_DISMISS,
                  type: 'info',
                  message: 'A new custom collection has been created and added to your data.',
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
   * tries to load the selected file as JSON as OwcContext
   * @param event
   */
  testImportJsonFile( event: Event ): void {
    let files = event.target['files'];
    // console.log(files);
    try {
      let reader = new FileReader();
      reader.readAsText(files[0]);
      reader.onload = ( e ) => {
        let owcDoc: OwcContext = <OwcContext>JSON.parse(reader.result);
        this.fileparseerror = false;
        this.importOwcDoc = owcDoc;
      };
      reader.onerror = ( e ) => {
        console.log(e);
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'danger',
          message: 'An error has occured while reading the file',
          details: e.message
        });
      };
    } catch (ex) {
      console.log(ex);
      this.notificationService.addNotification({
        id: NotificationService.DEFAULT_DISMISS,
        type: 'danger',
        message: 'An error has occuredm this file is not compatible',
        details: `${JSON.stringify(ex)}`
      });
    }
  }

  /**
   * import a new Collection From GeoJSON File (and for security/collisions reasons make deep identifier-safe copy)
   * @param owcdoc
   */
  importCollectionFromFile( owcdoc: OwcContext ): void {
    // console.log(owcdoc);
    this.collectionsService.insertCopyOfCollection(owcdoc)
      .subscribe(
        insertedDoc => {
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: `A new custom collection has been created and added to your data.`,
            details: `Created a new collection, ${insertedDoc.id}`
          });
          this.hideCreateCollectionModal();
          this.reloadCollections();
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  /**
   * Constructor
   * @param {CollectionsService} collectionsService
   * @param {NotificationService} notificationService
   */
  constructor( private collectionsService: CollectionsService,
               private notificationService: NotificationService) {
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
            // console.log(owcDoc.id);
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

    this.collectionsService.getOwcContextsRightsMatrixForUser()
      .subscribe(
        rights => {
          rights.forEach(( matrix: OwcContextsRightsMatrix ) => {
            this.myRightsMatrix.push(matrix);
            console.log(matrix);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

}
