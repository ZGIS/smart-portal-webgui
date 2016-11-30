import { Component, Input } from '@angular/core';
import { DashboardCategory } from './category.service';

@Component({
  selector: 'sac-gwh-dashboard-button',
  templateUrl: './dashboard-button.component.html',
  styleUrls: ['./dashboard-button.component.css']
})

export class DashboardButtonComponent {

  @Input() category: DashboardCategory;
  @Input() categoryImg: string;

}
