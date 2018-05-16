import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkbenchService } from '../../workbench';
import { CollectionsService } from '../index';
import { NotificationService } from '../../notifications';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  OwcAuthor,
  OwcCategory,
  OwcContent,
  OwcContext, OwcContextProperties,
  OwcCreatorApplication,
  OwcCreatorDisplay,
  OwcLink,
  OwcOffering,
  OwcOperation,
  OwcResource,
  OwcStyleSet
} from '../collections';

@Component({
  selector: 'app-sac-gwh-owc-collection-editor-component',
  templateUrl: 'owc-collection-editor.component.html'
})

export class OwcCollectionEditorComponent implements OnInit {

  owcForm: FormGroup;
  @Input() owcData: OwcContext;

  @Output() reloadOnSavedCollection: EventEmitter<any> = new EventEmitter<any>();
  @Output() returnCloseEditor: EventEmitter<any> = new EventEmitter<any>();

  collectionProps: any[] = [];

  constructor( private fb: FormBuilder,
               private collectionsService: CollectionsService,
               private workbenchService: WorkbenchService,
               private notificationService: NotificationService ) {
  }

  ngOnInit() {
    let iOwc = this.owcData;
    // let iOwc = (JSON.parse(JSON.stringify(this.owcData)));
    // console.log(iOwc);
    this.owcForm = this.fb.group({
      type: [ { value: iOwc.type, disabled: false }, Validators.pattern('FeatureCollection') ],
      id: [ { value: iOwc.id, disabled: false }, [ Validators.required ] ],
      properties: this.fb.group({
        lang: [ this.initForStr(iOwc.properties.lang), [] ],
        title: [ this.initForStr(iOwc.properties.title), [ Validators.required, Validators.minLength(5) ] ],
        subtitle: [ this.initForStr(iOwc.properties.subtitle), [] ],
        links: this.fb.group({
          profiles: this.fb.array(
            this.initLinks(iOwc.properties.links.profiles),
          ),
          via: this.fb.array(
            this.initLinks(iOwc.properties.links.via),
          )
        }),
        updated: [ iOwc.properties.updated, [] ],
        authors: this.fb.array(
          this.initAuthors(iOwc.properties.authors),
        ),
        publisher: [ this.initForStr(iOwc.properties.publisher), [] ],
        generator: this.initGenerator(iOwc.properties.generator),
        display: this.initDisplay(iOwc.properties.display),
        rights: [ this.initForStr(iOwc.properties.rights), [] ],
        date: [ this.initForStr(iOwc.properties.date), [] ],
        categories: this.fb.array(
          this.initCategories(iOwc.properties.categories),
        )
      }),
      bbox: [ this.initForStr(iOwc.bbox), [] ],
      features: this.fb.array(
        this.initFeatures(iOwc.features),
      )
    });
    this.logChanges();
  }

  initFeatures( res: OwcResource[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        type: [ { value: iOwc.type, disabled: false }, Validators.pattern('Feature') ],
        id: [ { value: iOwc.id, disabled: false }, [ Validators.required ] ],
        geometry: [ this.initForStr(iOwc.geometry) ],
        properties: this.fb.group({
          title: [ this.initForStr(iOwc.properties.title), [ Validators.required ] ],
          abstract: [ this.initForStr(iOwc.properties.abstract), [] ],
          updated: [ this.initForStr(iOwc.properties.updated), [] ],
          authors: this.fb.array(
            this.initAuthors(iOwc.properties.authors),
          ),
          publisher: [ this.initForStr(iOwc.properties.publisher), [] ],
          rights: [ this.initForStr(iOwc.properties.rights), [] ],
          date: [ this.initForStr(iOwc.properties.date), [] ],
          links: this.fb.group({
            alternates: this.fb.array(
              this.initLinks(iOwc.properties.links.alternates),
            ),
            previews: this.fb.array(
              this.initLinks(iOwc.properties.links.previews),
            ),
            data: this.fb.array(
              this.initLinks(iOwc.properties.links.data),
            ),
            via: this.fb.array(
              this.initLinks(iOwc.properties.links.via),
            )
          }),
          offerings: this.fb.array(
            this.initOfferings(iOwc.properties.offerings),
          ),
          categories: this.fb.array(
            this.initCategories(iOwc.properties.categories),
          ),
          active: [ this.initForStr(iOwc.properties.active), [] ],
          minscaledenominator: [ this.initForNum(iOwc.properties.minscaledenominator), [] ],
          maxscaledenominator: [ this.initForNum(iOwc.properties.maxscaledenominator), [] ],
          folder: [ this.initForStr(iOwc.properties.folder), [] ]
        })
      });
    });
    return owcFGs;
  }

  /**
   * FIXME oohuuuhhh not really great, need magic sauce
   *
   * @param val
   * @returns {string}
   */
  initForStr( val: any ): string {
    if (val) {
      return val;
    } else {
      // return '';
      return null;
    }
  }

  initForNum( val: any ): number {
    if (val) {
      return val;
    } else {
      // return 0;
      return null;
    }
  }

  initLinks( res: OwcLink[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        href: [ iOwc.href, Validators.required ],
        type: [ iOwc.type ],
        lang: [ iOwc.lang ],
        title: [ iOwc.title ],
        length: [ iOwc.length ],
        rel: [ iOwc.rel ],
        uuid: [ iOwc.uuid ]
      });
    });
    return owcFGs;
  }

  addLinkTo( rel: string, here: FormArray ): void {
    let newOp = this.fb.group({
      href: [ null, Validators.required ],
      type: [ null ],
      lang: [ null ],
      title: [ null ],
      length: [ null ],
      rel: [ rel ]
    });
    here.push(newOp);
  }

  initAuthors( res: OwcAuthor[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        name: [ iOwc.name, Validators.required ],
        email: [ iOwc.email ],
        uri: [ iOwc.uri ],
        uuid: [ iOwc.uuid ]
      });
    });
    return owcFGs;
  }

  addAuthorToContext(): void {
    let contr = this.owcForm.get('properties').get('authors') as FormArray;
    contr.push(this.addAuthorTo());
  }

  addAuthorToFeature( index: number ): void {
    console.log(index);
    let feat = this.owcForm.get('features') as FormArray;
    let contr = feat.at(index).get('properties').get('authors') as FormArray;
    contr.push(this.addAuthorTo());
  }

  addAuthorTo(): FormGroup {
    let newOp = this.fb.group({
      name: [ null, Validators.required ],
      email: [ null ],
      uri: [ null ]
    });
    return newOp;
  }

  initCategories( res: OwcCategory[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        term: [ iOwc.term, Validators.required ],
        scheme: [ iOwc.scheme ],
        label: [ iOwc.label ],
        uuid: [ iOwc.uuid ]
      });
    });
    return owcFGs;
  }

  addCategoryTo( here: FormArray ): void {
    let newOp = this.fb.group({
      term: [ null, Validators.required ],
      scheme: [ null ],
      label: [ null ]
    });
    here.push(newOp);
  }

  initGenerator( res: OwcCreatorApplication ): FormGroup {
    if (!res) {
      res = {
        title: null,
        uri: null,
        version: null,
      };
    }
    // generator?: OwcCreatorApplication;
    return this.fb.group({
      title: [ this.initForStr(res.title), [] ],
      uri: [ this.initForStr(res.uri), [] ],
      version: [ this.initForStr(res.version), [] ],
      uuid: [ this.initForStr(res.uuid), [] ]
    });
  }

  initDisplay( res: OwcCreatorDisplay ): FormGroup {
    if (!res) {
      res = {
        pixelWidth: null,
        pixelHeight: null,
        mmPerPixel: null,
      };
    }
    // display?: OwcCreatorDisplay;
    return this.fb.group({
      pixelWidth: [ this.initForNum(res.pixelWidth), [] ],
      pixelHeight: [ this.initForNum(res.pixelHeight), [] ],
      mmPerPixel: [ this.initForNum(res.mmPerPixel), [] ],
      uuid: [ this.initForStr(res.uuid), [] ]
    });
  }

  initOfferings( res: OwcOffering[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        code: [ iOwc.code, Validators.required ],
        operations: this.fb.array(
          this.initOperations(iOwc.operations),
        ),
        contents: this.fb.array(
          this.initContents(iOwc.contents),
        ),
        styles: this.fb.array(
          this.initStyles(iOwc.styles),
        ),
        uuid: [ iOwc.uuid, [] ]
      });
    });
    return owcFGs;
  }

  addOfferingTo( here: FormArray ): void {
    let newOp = this.fb.group({
      code: [ null, Validators.required ],
      operations: this.fb.array(
        this.initOperations([]),
      ),
      contents: this.fb.array(
        this.initContents([]),
      ),
      styles: this.fb.array(
        this.initStyles([]),
      ),
    });
    here.push(newOp);
  }

  initOperations( res: OwcOperation[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        code: [ iOwc.code, Validators.required ],
        method: [ iOwc.method, [] ],
        type: [ iOwc.type ],
        href: [ iOwc.href, [] ],
        request: this.initSingleContent(iOwc.request),
        result: this.initSingleContent(iOwc.result),
        uuid: [ iOwc.uuid, [] ]
      });
    });
    return owcFGs;
  }

  addOperationTo( here: FormArray ): void {
    let newOp = this.fb.group({
      code: [ null, Validators.required ],
      method: [ null, [] ],
      type: [ null ],
      href: [ null, [] ],
      request: this.initSingleContent(undefined),
      result: this.initSingleContent(undefined)
    });
    here.push(newOp);
  }

  initStyles( res: OwcStyleSet[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        name: [ iOwc.name, Validators.required ],
        title: [ iOwc.title, [] ],
        abstract: [ iOwc.abstract ],
        default: [ iOwc.default, [] ],
        legendURL: [ iOwc.legendURL, [] ],
        content: this.initSingleContent(iOwc.content),
        uuid: [ iOwc.uuid, [] ]
      });
    });
    return owcFGs;
  }

  addStyleTo( here: FormArray ): void {
    let newOp = this.fb.group({
      name: [ null, Validators.required ],
      title: [ null, [] ],
      abstract: [ null ],
      default: [ null, [] ],
      legendURL: [ null, [] ],
      content: this.initSingleContent(undefined)
    });
    here.push(newOp);
  }

  initContents( res: OwcContent[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.initSingleContent(iOwc);
    });
    return owcFGs;
  }

  addContentTo( here: FormArray ): void {
    let newOp = this.initSingleContent(undefined);
    here.push(newOp);
  }

  initSingleContent( res: OwcContent ): FormGroup {
    if (!res) {
      res = {
        type: null,
        href: null,
        title: null,
        content: null
      };
    }
    return this.fb.group({
      title: [ this.initForStr(res.title), [] ],
      href: [ this.initForStr(res.href), [] ],
      type: [ this.initForStr(res.type), [] ],
      content: [ this.initForStr(res.content), [] ],
      uuid: [ this.initForStr(res.uuid), [] ]
    });
  }

  saveEditsAndReturn(): void {
    this.saveEdits();
    this.returnCloseEditor.emit(true);
  }

  saveEdits(): void {
    console.log('we save and update the Collection');
    const owc = this.prepareForSave();
    /*    this.collectionsService.updateCollection(owc).subscribe(
          updated => {
            this.notificationService.addNotification({
              id: NotificationService.DEFAULT_DISMISS,
              type: 'info',
              message: `This collection has been updated/saved.`
            });
            this.reloadOnSavedCollection.emit(true);
          },
          error => {
            console.log(<any>error);
            this.notificationService.addErrorResultNotification(error);
          });*/
  }

  prepareForSave(): OwcContext {
    const formModel = this.owcForm.value;

    const authors = formModel.properties.authors;
    console.log(authors);

    const saveOwc: OwcContext = {
      type: 'FeatureCollection',
      id: formModel.id,
      bbox: formModel.bbox,
      properties: formModel.properties,
      features: formModel.features
    };
    console.log(saveOwc);
    return saveOwc;
  }

  closeEditor(): void {
    // console.log('we edit the properties');
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'warning',
      message: `Closing editor and returning to list view.`
    });
    this.returnCloseEditor.emit(true);
  }

  logChanges() {
    const nameControl = this.owcForm.get('properties').get('authors');
    nameControl.valueChanges.forEach(
      ( value: OwcAuthor ) => console.log(value)
    );
  }

  trackByFn( index: any, item: any ) {
    return index;
  }

  /**
   * cant be OWC because has the links props wrong
   * @param formValue
   * @returns {OwcContext}
   */
  private fixOwcLinksFromForm( formValue: any ): OwcContext {
    return <OwcContext>formValue;
  }
}
