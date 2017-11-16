import { Component, Input } from '@angular/core';
import { AttributeLabelBinding } from '../glossary-edu/glossary.types';

/**
 22-rdf-syntax-ns#type -> skos:core#concept
 core#inCollection
 identifier - Abreviation
 core#label - s.a.
 title - Name
 type - Funding source
 description - Description
 contributor - Contact
 relation - Link
 creator - Organisation (lead)
 */
@Component({
  selector: 'app-sac-gwh-rpg-skosdef',
  template: `<div class="list-group-item" *ngIf="binding">
    <p *ngIf="binding.att.value === 'identifier'"><small><i>Abreviation:</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'title'"><small><i>Name:</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'type'"><small><i>Funding source:</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'description'"><small><i>Description:</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'contributor'"><small><i>Contact:</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'creator'"><small><i>Organisation (lead):</i></small> {{ binding.val.value }}</p>
    <p *ngIf="binding.att.value === 'relation' && binding.val.valueAsSafeUrl">
      <small><i>Link:</i></small> <a [href]="binding.val.valueAsSafeUrl" target="_blank">
        <i class="fa fa-globe"></i> {{ binding.val.value }}</a>
    </p></div>`,
})

export class ResearchProgrammesSkosdefComponent {
  @Input() binding: AttributeLabelBinding;
}
