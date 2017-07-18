import { Component, Input } from '@angular/core';
import { OwcContextProperties } from './collections';

@Component({
  selector: 'app-sac-gwh-owccontext-props',
  templateUrl: 'owc-context-properties.component.html'
})

export class OwcContextPropertiesComponent {
  @Input() owcContextProperties: OwcContextProperties;
}
