import { Component, Input } from '@angular/core';
import { IDashboardCategory } from './categories';

@Component({
  selector: 'app-sac-gwh-dashboard-button',
  templateUrl: 'dashboard-button.component.html',
  styleUrls: ['dashboard-button.component.css']
})

export class DashboardButtonComponent {

  @Input() category: IDashboardCategory;
  @Input() categoryImg: string;

}
