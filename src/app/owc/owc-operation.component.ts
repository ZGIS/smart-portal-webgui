import { Component, Input } from '@angular/core';
import { OwcOperation } from './collections';

@Component({
  selector: 'app-sac-gwh-owcoperation',
  template: `
    <div class="owcOperation" *ngIf="owcOperation">
      <p *ngIf="owcOperation.code">{{ 'code: ' + owcOperation.code }}</p>
      <p *ngIf="owcOperation.method">{{ 'method: ' + owcOperation.method }}</p>
      <p *ngIf="owcOperation.type">
        <small><i>{{ 'type: ' + owcOperation.type }}</i></small>
      </p>
      <p *ngIf="owcOperation.href">
        <small>href: <a [href]="owcOperation.href"
                        target="_blank">{{ owcOperation.href }} <i class="fa fa-globe"></i></a>
        </small>
        /p>
      <div *ngIf="owcOperation.request">
        <app-sac-gwh-owccontent [owcContent]="owcOperation.request"></app-sac-gwh-owccontent>
      </div>
      <div *ngIf="owcOperation.result">
        <app-sac-gwh-owccontent [owcContent]="owcOperation.result"></app-sac-gwh-owccontent>
      </div>
    </div>`,
})

export class OwcOperationComponent {
  @Input() owcOperation: OwcOperation;
}
