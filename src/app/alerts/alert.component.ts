import { Component, OnInit } from '@angular/core';
import {AlertService, SacGwhAlert} from './alert.service';


@Component({
  selector: 'sac-gwh-alerts',
  templateUrl: './alert.component.html',
//  styleUrls: ['./alerts.component.css']
})

export class AlertComponent implements OnInit {
  alerts: SacGwhAlert[];

  constructor(private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.alerts = this.alertService.getAlerts();
  }

  dismissAlert(i: number) {
    this.alertService.dismissAlert(i);
  }
}
