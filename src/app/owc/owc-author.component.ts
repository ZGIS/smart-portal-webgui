import { Component, Input } from '@angular/core';
import { OwcAuthor } from './collections';

@Component({
  selector: 'app-sac-gwh-owcauthor',
  template: `<div class="owcAuthor" *ngIf="owcAuthor">
    <p *ngIf="owcAuthor.name">{{ 'Name: ' + owcAuthor.name }}</p>
    <p *ngIf="owcAuthor.email">{{ 'Email: ' + owcAuthor.email }}</p>
    <p *ngIf="owcAuthor.uri">Link: <a [href]="owcAuthor.uri" target="_blank">{{ owcAuthor.uri }}<i class="fa fa-globe">
      </i></a></p>
    </div>`,
})

export class OwcAuthorComponent {
  @Input() owcAuthor: OwcAuthor;
}
