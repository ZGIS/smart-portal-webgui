import { Component, Input } from '@angular/core';
import { OwcCreatorApplication } from './collections';

@Component({
  selector: 'app-sac-gwh-owccreatorapplication',
  template: `
    <div class="owcCreatorApplication" *ngIf="owcCreatorApplication">
      <p *ngIf="owcCreatorApplication.title">{{ 'Application name: ' + owcCreatorApplication.title
        }}</p>
      <p *ngIf="owcCreatorApplication.version">
        <small><i>{{ 'version: ' + owcCreatorApplication.version }}</i></small>
      </p>
      <p *ngIf="owcCreatorApplication.uri">
        <small>Link: <a [href]="owcCreatorApplication.uri"
                        target="_blank">{{
          owcCreatorApplication.uri }} <i class="fa fa-globe"></i></a></small>
      </p>
    </div>`,
})

export class OwcCreatorApplicationComponent {
  @Input() owcCreatorApplication: OwcCreatorApplication;
}
