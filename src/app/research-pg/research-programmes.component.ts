import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { AttributeLabelBinding, IriLabelBinding } from '../glossary-edu/glossary.types';
import { ModalDirective } from 'ngx-bootstrap';
import { NotificationService } from '../notifications/notification.service';
import { GlossaryService } from '../glossary-edu/glossary.service';

/*
identifier - Abreviation
 core#label - s.a.
 title - Name
 type - Funding source
 description - Description
 contributor - Contact
 relation - Link
 creator - Organization
 */
const visualMembers = ['identifier', 'title', 'type', 'description', 'contributor', 'relation', 'creator'];

@Component({
  selector: 'app-sac-gwh-research-programmes',
  templateUrl: 'research-programmes.component.html'
})

/**
 * Admin Component, create delete organisations, add remove users for organisations, delete / moderate general stuff
 */
export class ResearchProgrammesComponent implements OnInit {

  public spqResearchPGQueryUrl = 'https://vocab.smart-project.info/spq-researchpg/query';
  public uriResearchPGCollection = 'http://vocab.smart-project.info/collection/researchpg/terms';

  public researchPGCollectionBindings: IriLabelBinding[] = [];

  public currentConceptUri = '';
  public currentConceptBindings: AttributeLabelBinding[] = [];

  public loading = false;
  public textFilter = '';

  @ViewChild('conceptDetailsModal') public modal: ModalDirective;

  constructor( private location: Location,
               private glossaryService: GlossaryService,
               private notificationService: NotificationService,
               private sanitizer: DomSanitizer) {
  }

  /**
   * load all research programmes from sparql collections
   */
  ngOnInit(): void {
    this.loading = true;
    this.glossaryService.querySparqlCollection(this.uriResearchPGCollection, this.spqResearchPGQueryUrl)
      .subscribe(
        spqResult => {

          // reset list
          this.researchPGCollectionBindings.length = 0;
          // this.currentCollectionBindings = [];

          this.loading = false;
          spqResult.results.bindings.forEach(( binding: IriLabelBinding ) => {
            // console.log(binding.label);
            this.researchPGCollectionBindings.push(binding);
          });
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
        });
  }

  isInVisualMembers(concept: string): Boolean {
    return visualMembers.indexOf(concept) > -1;
  }
  /**
   * load details for a research programme
   *
   * @param {IriLabelBinding} conceptBinding
   */
  showConceptDetailModal( conceptBinding: IriLabelBinding ) {
    if (conceptBinding !== undefined) {
      this.loading = true;

      this.glossaryService.querySparqlConceptAttributes(conceptBinding.iri.value, this.spqResearchPGQueryUrl)
        .subscribe(
          spqResult => {

            this.currentConceptBindings.length = 0;
            this.loading = false;
            this.currentConceptUri = conceptBinding.iri.value;
            spqResult.results.bindings.forEach(( binding: AttributeLabelBinding ) => {
              // console.log(binding.label);

              let termId = binding.att.value.split('/').slice(-1)[ 0 ] as string;
              binding.att.value = termId;

              if (binding.att.value === 'relation') {
                let safeUrl = this.sanitizer.bypassSecurityTrustUrl(binding.val.value);
                binding.val.valueAsSafeUrl = safeUrl;
              }
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

  getFilteredResults(): IriLabelBinding[] {
    return this.researchPGCollectionBindings.filter(( item ) => {
      let paramId = item.iri.value.split('/').slice(-1)[ 0 ] as string;
      return item.label.value.toLocaleLowerCase().indexOf(
        this.textFilter.toLocaleLowerCase()) >= 0 ||
        paramId.indexOf(this.textFilter) >= 0;
    });
  }

  hideConceptDetailModal() {
    this.modal.hide();
  }

  backClicked() {
    this.location.back();
  }
}

