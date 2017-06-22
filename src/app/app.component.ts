import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'app-sac-gwh',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'Groundwater Hub';

  private viewContainerRef: ViewContainerRef;

  constructor(private accountService: AccountService,
              viewContainerRef: ViewContainerRef) {
    // small hack for ngx-bootstrap model. See https://valor-software.com/ngx-bootstrap/#/modals
    this.viewContainerRef = viewContainerRef;
  }
}
