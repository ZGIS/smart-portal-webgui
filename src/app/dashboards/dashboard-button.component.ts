import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sac-gwh-dashboard-button',
  templateUrl: 'dashboard-button.component.html',
  styleUrls: ['dashboard-button.component.css']
})

export class DashboardButtonComponent {

  @Input() category: any;
  @Input() categoryImg: string;

}
