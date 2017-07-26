import { Component, ViewChild } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Location } from '@angular/common';
import { IErrorResult } from '../search/result';
import { Observable } from 'rxjs/Observable';
import { GlossaryService } from './glossary.service';
import { NotificationService } from '../notifications/notification.service';
import { AttributeLabelBinding, IriLabelBinding, SparqlResult } from './glossary.types';
import { ModalDirective } from 'ngx-bootstrap';

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

  public spqGlossaryQueryUrl = 'http://vocab.smart-project.info/spq-glossary/query';
  public spqNgmpQueryUrl = 'http://vocab.smart-project.info/spq-ngmp/query';
  public spqPapawaiQueryUrl = 'http://vocab.smart-project.info/spq-papawai/query';
  public spqAwahouQueryUrl = 'http://vocab.smart-project.info/spq-awahou/query';

  public uriGlossaryCollection = 'http://vocab.smart-project.info/collection/glossary/terms';
  public uriNgmpCollection = 'http://vocab.smart-project.info/collection/ngmp/phenomena';
  public uriPapawaiCollection = 'http://vocab.smart-project.info/collection/papawai/terms';
  public uriAwahouCollection = 'http://vocab.smart-project.info/collection/awahou/terms';

  constructor( private location: Location, private http: Http,
               private glossaryService: GlossaryService,
               private notificationService: NotificationService ) {
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
      const queryUrl = `http://vocab.smart-project.info/spq-${s.split('/')[ 0 ]}/query`;
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

