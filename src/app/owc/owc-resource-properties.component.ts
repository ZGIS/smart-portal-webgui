import { Component, Input } from '@angular/core';
import { OwcResourceProperties } from './collections';

@Component({
  selector: 'app-sac-gwh-owcresource-props',
  templateUrl: 'owc-resource-properties.component.html'
})

export class OwcResourcePropertiesComponent {
  @Input() owcResourceProperties: OwcResourceProperties;

  editProperties(): void {
    console.log('we edit the properties');
  }
}
