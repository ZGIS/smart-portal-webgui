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

  addLinkTo( rel: string ): FormGroup {
    let newOp = this.fb.group({
      href: [ null, Validators.required ],
      type: [ null ],
      lang: [ null ],
      title: [ null ],
      length: [ null ],
      rel: [ rel ]
    });
    return newOp;
  }

  addLinkToContext( rel: string, pos: string ): void {
    let contr = this.owcForm.get('properties').get('links').get(pos) as FormArray;
    contr.push(this.addLinkTo(rel));
  }

  addLinkToFeature( index: number, rel: string, pos: string ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let contr = feat.at(index).get('properties').get('links').get(pos) as FormArray;
    contr.push(this.addLinkTo(rel));
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

  addCategoryTo(): FormGroup {
    let newOp = this.fb.group({
      term: [ null, Validators.required ],
      scheme: [ null ],
      label: [ null ]
    });
    return newOp;
  }

  addCategoryToContext(): void {
    let contr = this.owcForm.get('properties').get('categories') as FormArray;
    contr.push(this.addCategoryTo());
  }

  addCategoryToFeature( index: number ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let contr = feat.at(index).get('properties').get('categories') as FormArray;
    contr.push(this.addCategoryTo());
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

  addOfferingTo(): FormGroup {
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
    return newOp;
  }

  addOfferingToFeature( index: number ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let contr = feat.at(index).get('properties').get('offerings') as FormArray;
    contr.push(this.addOfferingTo());
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

  addOperationTo(): FormGroup {
    let newOp = this.fb.group({
      code: [ null, Validators.required ],
      method: [ null, [] ],
      type: [ null ],
      href: [ null, [] ],
      request: this.initSingleContent(undefined),
      result: this.initSingleContent(undefined)
    });
    return newOp;
  }

  addOperationToOffering( feature_index: number, offering_index: number ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let offs = feat.at(feature_index).get('properties').get('offerings') as FormArray;
    let contr = offs.at(offering_index).get('operations') as FormArray;
    contr.push(this.addOperationTo());
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

  addStyleTo(): FormGroup {
    let newOp = this.fb.group({
      name: [ null, Validators.required ],
      title: [ null, [] ],
      abstract: [ null ],
      default: [ null, [] ],
      legendURL: [ null, [] ],
      content: this.initSingleContent(undefined)
    });
    return newOp;
  }

  addStyleToOffering( feature_index: number, offering_index: number ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let offs = feat.at(feature_index).get('properties').get('offerings') as FormArray;
    let contr = offs.at(offering_index).get('styles') as FormArray;
    contr.push(this.addStyleTo());
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

  addContentTo(): FormGroup {
    let newOp = this.initSingleContent(undefined);
    return newOp;
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

  addContentToOffering( feature_index: number, offering_index: number ): void {
    let feat = this.owcForm.get('features') as FormArray;
    let offs = feat.at(feature_index).get('properties').get('offerings') as FormArray;
    let contr = offs.at(offering_index).get('contents') as FormArray;
    contr.push(this.addContentTo());
  }

  saveEdits(withReturn: boolean): void {
    console.log('we save and update the Collection');
    const owc = this.prepareForSave();
    this.collectionsService.updateCollection(owc).subscribe(
      updated => {
        this.notificationService.addNotification({
          id: NotificationService.DEFAULT_DISMISS,
          type: 'info',
          message: `This collection has been updated/saved.`
        });
        this.reloadOnSavedCollection.emit(true);
        if (withReturn && withReturn === true) {
          this.returnCloseEditor.emit(true);
        }
      },
      error => {
        console.log(<any>error);
        this.notificationService.addErrorResultNotification(error);
      });
  }

  prepareForSave(): OwcContext {
    let formModel = this.owcForm.value;
    let props = formModel.properties;

    props.authors = formModel.properties.authors.filter((o: OwcAuthor) => !this.canDropEmpty(o));
    props.categories = formModel.properties.categories.filter((o: OwcCategory) => !this.canDropEmpty(o));

    props.links.profiles = formModel.properties.links.profiles.filter((o: OwcLink) => !this.canDropEmpty(o));
    if (props.links.via) {
      props.links.via = formModel.properties.links.via.filter((o: OwcLink) => !this.canDropEmpty(o));
    }
    if (props.display && this.canDropEmpty(formModel.properties.display)) {
      delete props.display;
    }
    if (props.generator && this.canDropEmpty(formModel.properties.generator)) {
      delete props.display;
    }
    // console.log(props);

    let features = formModel.features.map(( owcResource: OwcResource ) => {
      let returnFeature = owcResource;
      let featureProps = owcResource.properties;

      featureProps.authors = owcResource.properties.authors.filter((o: OwcAuthor) => !this.canDropEmpty(o));
      featureProps.categories = owcResource.properties.categories.filter((o: OwcCategory) => !this.canDropEmpty(o));
      if (featureProps.links.alternates) {
        featureProps.links.alternates = owcResource.properties.links.alternates.filter((o: OwcLink) => !this.canDropEmpty(o));
      }
      if (featureProps.links.previews) {
        featureProps.links.previews = owcResource.properties.links.previews.filter((o: OwcLink) => !this.canDropEmpty(o));
      }
      if (featureProps.links.data) {
        featureProps.links.data = owcResource.properties.links.data.filter((o: OwcLink) => !this.canDropEmpty(o));
      }
      if (featureProps.links.via) {
        featureProps.links.via = owcResource.properties.links.via.filter((o: OwcLink) => !this.canDropEmpty(o));
      }

      featureProps.offerings = owcResource.properties.offerings.map(( offering: OwcOffering ) => {
        let returnOffering = offering;
        if (offering.operations) {
          returnOffering.operations = offering.operations.filter(( o: OwcOperation ) => {
            return !this.canDropEmpty(o);
          }).map(( o: OwcOperation ) => {
            let returnOperation = o;
            if (this.canDropEmpty(o.request)) {
              delete returnOperation.request;
            }
            if (this.canDropEmpty(o.result)) {
              delete returnOperation.result;
            }
            return returnOperation;
          });
        }
        if (offering.styles) {
          returnOffering.styles = offering.styles.filter(( o: OwcStyleSet ) => {
            return !this.canDropEmpty(o);
          }).map(( o: OwcStyleSet ) => {
            let returnStyleSet = o;
            if (this.canDropEmpty(o.content)) {
              delete returnStyleSet.content;
            }
            return returnStyleSet;
          });
        }
        if (offering.contents) {
          returnOffering.contents = offering.contents.filter(o => !this.canDropEmpty(o));
        }
        return returnOffering;
      });

      // console.log(featureProps);
      returnFeature.properties = featureProps;
      return returnFeature;
    });

    const saveOwc: OwcContext = {
      type: 'FeatureCollection',
      id: formModel.id,
      bbox: formModel.bbox,
      properties: props,
      features: features
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
   * return a true if the obj can be dropped (meaning all its keys have null values)
   * @param obj
   * @returns {boolean}
   */
  canDropEmpty( obj: any ): boolean {
    for ( let key in obj ) {
      if (obj.hasOwnProperty(key) && obj[ key ] !== null && obj[ key ] !== '') {
        return false;
      }
    }
    return true;
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
