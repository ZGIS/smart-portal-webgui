import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WorkbenchService } from '../../workbench';
import { CollectionsService } from '../index';
import { NotificationService } from '../../notifications';
import { Validators, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import {
  OwcAuthor,
  OwcCategory, OwcContent,
  OwcContext, OwcContextLinks,
  OwcContextProperties, OwcCreatorApplication, OwcCreatorDisplay,
  OwcLink,
  OwcOffering, OwcOperation,
  OwcResource, OwcResourceLinks, OwcStyleSet
} from '../collections';
import { noop } from 'rxjs/util/noop';

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
    console.log(iOwc);
    this.owcForm = this.fb.group({
      type: [ { value: iOwc.type, disabled: false }, Validators.pattern('FeatureCollection') ],
      id: [ { value: iOwc.id, disabled: false }, [ Validators.required ] ],
      properties: this.fb.group({
        lang: [ iOwc.properties.lang, [] ],
        title: [ iOwc.properties.title, [ Validators.required, Validators.minLength(5) ] ],
        subtitle: [ iOwc.properties.subtitle, [] ],
        links_profiles: this.fb.array(
          this.initLinks(iOwc.properties.links.profiles),
        ),
        links_via: this.fb.array(
          this.initLinks(iOwc.properties.links.via),
        ),
        updated: [ iOwc.properties.updated, [] ],
        authors: this.fb.array(
          this.initAuthors(iOwc.properties.authors),
        ),
        publisher: [ iOwc.properties.publisher, [] ],
        // generator?: OwcCreatorApplication;
        generator_title: [ iOwc.properties.generator.title, [] ],
        generator_uri: [ iOwc.properties.generator.uri, [] ],
        generator_version: [ iOwc.properties.generator.version, [] ],
        generator_uuid: [ iOwc.properties.generator.uuid, [] ],
        // display?: OwcCreatorDisplay;
        rights: [ iOwc.properties.rights, [] ],
        date: [ iOwc.properties.date, [] ],
        categories: this.fb.array(
          this.initCategories(iOwc.properties.categories),
        )
      }),
      bbox: [ iOwc.bbox, [] ],
      features: this.fb.array(
        this.initFeatures(iOwc.features),
      )
    });
  }

  initFeatures( res: OwcResource[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = res.map(iOwc => {
      return this.fb.group({
        type: [ { value: iOwc.type, disabled: false }, Validators.pattern('Feature') ],
        id: [ { value: iOwc.id, disabled: false }, [ Validators.required ] ],
        geometry: [ iOwc.geometry ],
        properties: this.fb.group({
          title: [ iOwc.properties.title, [ Validators.required ] ],
          abstract: [ iOwc.properties.abstract, [] ],
          updated: [ iOwc.properties.updated, [] ],
          // authors?: OwcAuthor[];
          publisher: [ iOwc.properties.publisher, [] ],
          rights: [ iOwc.properties.rights, [] ],
          date: [ iOwc.properties.date, [] ],
          links_alternates: this.fb.array(
            this.initLinks(iOwc.properties.links.alternates),
          ),
          links_previews: this.fb.array(
            this.initLinks(iOwc.properties.links.previews),
          ),
          links_data: this.fb.array(
            this.initLinks(iOwc.properties.links.data),
          ),
          links_via: this.fb.array(
            this.initLinks(iOwc.properties.links.via),
          ),
          offerings: this.fb.array(
            this.initOfferings(iOwc.properties.offerings),
          ),
          categories: this.fb.array(
            this.initCategories(iOwc.properties.categories),
          ),
          active: [ iOwc.properties.active, [] ],
          minscaledenominator: [ iOwc.properties.minscaledenominator, [] ],
          maxscaledenominator: [ iOwc.properties.maxscaledenominator, [] ],
          folder: [ iOwc.properties.folder, [] ]
        })
      });
    });
    return owcFGs;
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

  initOfferings( res: OwcOffering[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = [];
    this.fb.group({
      code: [ '', Validators.required ],
      type: [ '' ]
    });
    return owcFGs;
  }

  initOperations( res: OwcOperation[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = [];
    this.fb.group({
      code: [ '', Validators.required ],
      type: [ '' ]
    });
    return owcFGs;
  }

  initStyles( res: OwcStyleSet[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = [];
    this.fb.group({
      title: [ '', Validators.required ],
      subtiltle: [ '' ]
    });
    return owcFGs;
  }

  initContents( res: OwcContent[] ): FormGroup[] {
    if (!res) {
      return [];
    }
    let owcFGs: FormGroup[] = [];
    this.fb.group({
      content: [ '', Validators.required ],
      href: [ '' ]
    });
    return owcFGs;
  }

  saveEdits( formdata: OwcContext ): void {
    console.log(JSON.stringify(this.owcForm.value));
    console.log(JSON.stringify(formdata));
    this.notificationService.addNotification({
      id: NotificationService.DEFAULT_DISMISS,
      type: 'info',
      message: `Saving edits for this collection, not yet implemented.`
    });
    this.reloadOnSavedCollection.emit(true);
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
}
