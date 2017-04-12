import { Component, Input } from '@angular/core';
import { IOwcEntryProperties } from './collections';

@Component({
  selector: 'app-sac-gwh-owcentry-props',
  templateUrl: 'owc-entry-properties.component.html'
})

export class OwcEntryPropertiesComponent {
  @Input() owcEntryProperties: IOwcEntryProperties;

  editProperties(): void {
    console.log('we edit the properties');
  }
}
