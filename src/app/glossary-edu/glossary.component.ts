import { Component, Inject, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { ModalDirective } from 'ngx-bootstrap';
import { AttributeLabelBinding, IriLabelBinding } from './glossary.types';
import { GlossaryService } from './glossary.service';
import { NotificationService } from '../notifications/notification.service';
import { VOCAB_URL } from '../in-app-config';

@Component({
  selector: 'app-sac-gwh-glossary',
  templateUrl: 'glossary.component.html'
})

/**
 * Glossary Component
 */
export class GlossaryComponent {

  public currentCollectionUri = '';
  public currentCollectionBindings: IriLabelBinding[] = [];

  public currentConceptUri = '';
  public currentConceptBindings: AttributeLabelBinding[] = [];

  public loading = false;
  public textFilter = '';

  @ViewChild('conceptDetailsModal') public modal: ModalDirective;

  public spqGlossaryQueryUrl = this.vocabUrl + '/spq-glossary/query';
  public spqNgmpQueryUrl = this.vocabUrl + '/spq-ngmp/query';
  public spqPapawaiQueryUrl = this.vocabUrl + '/spq-papawai/query';
  public spqAwahouQueryUrl = this.vocabUrl + '/spq-awahou/query';

  public uriGlossaryCollection = 'http://vocab.smart-project.info/collection/glossary/terms';
  public uriNgmpCollection = 'http://vocab.smart-project.info/collection/ngmp/phenomena';
  public uriPapawaiCollection = 'http://vocab.smart-project.info/collection/papawai/terms';
  public uriAwahouCollection = 'http://vocab.smart-project.info/collection/awahou/terms';

  constructor( private location: Location,
               private glossaryService: GlossaryService,
               private notificationService: NotificationService,
               @Inject(VOCAB_URL) private vocabUrl: string ) {
  }

  getCollection( conceptUri: string, spqNgmpQueryUrl: string ) {
    this.loading = true;
    this.glossaryService.querySparqlCollection(conceptUri, spqNgmpQueryUrl)
      .subscribe(
        spqResult => {

          // whatever works more reliable
          this.currentCollectionBindings.length = 0;
          // this.currentCollectionBindings = [];

          // this.notificationService.addNotification(
          //   {
          //     type: 'success',
          //     message: 'Loaded ' + String(spqResult.results.bindings.length) + ' elements.'
          //   });
          this.loading = false;
          this.currentCollectionUri = conceptUri;
          spqResult.results.bindings.forEach(( binding: IriLabelBinding ) => {
            // console.log(binding.label);
            this.currentCollectionBindings.push(binding);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  getFilteredResults(): IriLabelBinding[] {
    return this.currentCollectionBindings.filter(( item ) => {
      let paramId = item.iri.value.split('/').slice(-1)[ 0 ] as string;
      return item.label.value.toLocaleLowerCase().indexOf(
        this.textFilter.toLocaleLowerCase()) >= 0 ||
        paramId.indexOf(this.textFilter) >= 0;
    });
  }

  showConceptDetailModal( conceptBinding: IriLabelBinding ) {
    if (conceptBinding !== undefined && this.currentCollectionUri.length > 0) {
      this.loading = true;
      const cur = this.currentCollectionUri;
      const s = cur.replace('http://vocab.smart-project.info/collection/', '');
      const queryUrl = `${this.vocabUrl}/spq-${s.split('/')[ 0 ]}/query`;
      // console.log(queryUrl);
      this.glossaryService.querySparqlConceptAttributes(conceptBinding.iri.value, queryUrl)
        .subscribe(
          spqResult => {

            this.currentConceptBindings.length = 0;
            // this.currentCollectionBindings = [];
            this.loading = false;
            this.currentConceptUri = conceptBinding.iri.value;
            spqResult.results.bindings.forEach(( binding: AttributeLabelBinding ) => {
              // console.log(binding.label);

              let termId = binding.att.value.split('/').slice(-1)[ 0 ] as string;

              binding.att.value = termId;
              this.currentConceptBindings.push(binding);
            });

            this.modal.show();
          },
          error => {
            console.log(<any>error);
            this.notificationService.addErrorResultNotification(error);
          });
    }
  }

  hideConceptDetailModal() {
    this.modal.hide();
  }

  backClicked() {
    this.location.back();
  }
}

