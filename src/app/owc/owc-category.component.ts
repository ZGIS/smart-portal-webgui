import { Component, Input } from '@angular/core';
import { OwcCategory } from './collections';

@Component({
  selector: 'app-sac-gwh-owccategory',
  template: `<div class="owcCategory" *ngIf="owcCategory">
    <p *ngIf="owcCategory.term">Term: {{ owcCategory.term }}</p>
    <p *ngIf="owcCategory.label">Label: {{ owcCategory.label }}</p>
    <p *ngIf="owcCategory.scheme"><small><i>Scheme: {{ owcCategory.scheme }}</i></small></p>
  </div>`,
})

export class OwcCategoryComponent {
  @Input() owcCategory: OwcCategory;
}
