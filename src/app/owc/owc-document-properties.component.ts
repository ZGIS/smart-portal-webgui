import { Component, Input } from '@angular/core';
import { IOwcDocumentProperties } from './collections';

@Component({
  selector: 'app-sac-gwh-owcdocument-props',
  templateUrl: 'owc-document-properties.component.html'
})

export class OwcDocumentPropertiesComponent {
  @Input() owcDocumentProperties: IOwcDocumentProperties;

  editProperties(): void {
    console.log('we edit the properties');
  }
}
