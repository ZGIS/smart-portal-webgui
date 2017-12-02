import { Component, Input } from '@angular/core';
import { OwcLink } from './collections';

@Component({
  selector: 'app-sac-gwh-owclink',
  template: `
    <div class="owcLink" *ngIf="owcLink">
      <p *ngIf="owcLink.href">Link:
        <app-sac-gwh-licensedexitlink [theLink]="owcLink.href" [licenseComment]=""></app-sac-gwh-licensedexitlink>
        <i class="fa fa-globe"></i></p>
      <p *ngIf="owcLink.type">
        <small><i>{{ 'Type: ' + owcLink.type }}</i></small>
      </p>
      <p *ngIf="owcLink.title">{{ 'Title: ' + owcLink.title }}</p>
      <p *ngIf="owcLink.lang">
        <small><i>{{ 'Language: ' + owcLink.lang }}</i></small>
      </p>
      <p *ngIf="owcLink.length">
        <small><i>{{ 'size (kb): ' + owcLink.length }}</i></small>
      </p>
    </div>`,
})

export class OwcLinkComponent {
  @Input() owcLink: OwcLink;
}
