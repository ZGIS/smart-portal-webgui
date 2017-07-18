import { Component, Input } from '@angular/core';
import { OwcStyleSet } from './collections';

@Component({
  selector: 'app-sac-gwh-owcstyleset',
  template: `<div class="owcStyleSet" *ngIf="owcStyleSet">
    <p *ngIf="owcStyleSet.name">{{ 'Name: ' + owcStyleSet.name }}</p>
    <p *ngIf="owcStyleSet.title">{{ 'Title: ' + owcStyleSet.title }}</p>
    <p *ngIf="owcStyleSet.abstract"><small><i>{{ 'abstract: ' + owcStyleSet.abstract }}</i></small></p>
    <p *ngIf="owcStyleSet.legendURL"><small>legendURL: <a [href]="owcStyleSet.legendURL"
              target="_blank">{{ owcStyleSet.legendURL }} <i class="fa fa-globe"></i></a></small>/p>
    <p *ngIf="owcStyleSet.default"><small><i>{{ 'is default: ' + owcStyleSet.default }}</i></small></p>
    <div *ngIf="owcStyleSet.content"><app-sac-gwh-owccontent [owcContent]="owcStyleSet.content"></app-sac-gwh-owccontent></div>
  </div>`,
})

export class OwcStyleSetComponent {
  @Input() owcStyleSet: OwcStyleSet;
}
