import { Component, Input } from '@angular/core';
import { IOwcLink } from './collections';

@Component({
  selector: 'app-sac-gwh-owclink',
  template: `<div class="owcLink" *ngIf="owcLink">
    <p *ngIf="owcLink.title">{{ 'Title: ' + owcLink.title }}</p>
    <p *ngIf="owcLink.href">Link: <a [href]="owcLink.href" target="_blank">{{ owcLink.href }} <i class="fa fa-globe"></i></a></p>
    <p *ngIf="owcLink.rel"><small><i>{{ 'Relation: ' + owcLink.rel }}</i></small></p>
    <p *ngIf="owcLink.type"><small><i>{{ 'Type: ' + owcLink.type }}</i></small></p>
  </div>`,
})

export class OwcLinkComponent {
  @Input() owcLink: IOwcLink;
}
