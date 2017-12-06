import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AccountService } from './account';
import { CategoriesService } from './dashboards';

@Component({
  selector: 'app-sac-gwh',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'Groundwater Hub';

  private viewContainerRef: ViewContainerRef;

  constructor(private accountService: AccountService,
              private categoriesService: CategoriesService,
              viewContainerRef: ViewContainerRef) {
    // small hack for ngx-bootstrap model. See https://valor-software.com/ngx-bootstrap/#/modals
    this.viewContainerRef = viewContainerRef;
  }
}
