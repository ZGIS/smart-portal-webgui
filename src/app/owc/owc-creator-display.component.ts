import { Component, Input } from '@angular/core';
import { OwcCreatorDisplay } from './collections';

@Component({
  selector: 'app-sac-gwh-owccreatordisplay',
  template: `
    <div class="owcCreatorDisplay" *ngIf="owcCreatorDisplay">
      <p *ngIf="owcCreatorDisplay.pixelWidth">
        <small><i>pixelWidth: {{ owcCreatorDisplay.pixelWidth }}</i></small>
      </p>
      <p *ngIf="owcCreatorDisplay.pixelHeight">
        <small><i>pixelHeight: {{ owcCreatorDisplay.pixelHeight }}</i></small>
      </p>
      <p *ngIf="owcCreatorDisplay.mmPerPixel">
        <small><i>mmPerPixel: {{ owcCreatorDisplay.mmPerPixel }}</i></small>
      </p>
    </div>`,
})

export class OwcCreatorDisplayComponent {
  @Input() owcCreatorDisplay: OwcCreatorDisplay;
}
