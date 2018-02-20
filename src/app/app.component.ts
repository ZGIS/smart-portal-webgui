import { Component, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sac-gwh',
  templateUrl: 'app.component.html',
  encapsulation: ViewEncapsulation.None
})

export class AppComponent {
  title = 'Groundwater Hub';

  private viewContainerRef: ViewContainerRef;

  constructor(viewContainerRef: ViewContainerRef ) {
    this.viewContainerRef = viewContainerRef;
  }
}
