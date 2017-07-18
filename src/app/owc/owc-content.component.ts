import { Component, Input } from '@angular/core';
import { OwcContent } from './collections';

@Component({
  selector: 'app-sac-gwh-owccontent',
  template: `<div class="owcContent" *ngIf="owcContent">
    <p *ngIf="owcContent.title">{{ 'Title: ' + owcContent.title }}</p>
    <p *ngIf="owcContent.href">Link: <a [href]="owcContent.href" target="_blank">{{ owcContent.href }} <i class="fa fa-globe"></i></a></p>
    <p *ngIf="owcContent.type"><small><i>{{ 'Type: ' + owcContent.type }}</i></small></p>
    <p *ngIf="owcContent.content"><small><i>{{ 'Data content: ' + owcContent.content }}</i></small></p>
  </div>`,
})

export class OwcContentComponent {
  @Input() owcContent: OwcContent;
}
