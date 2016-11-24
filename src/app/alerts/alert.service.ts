import { Injectable } from '@angular/core';

export class SacGwhAlert {
  type: string;
  message: string;
}

@Injectable()
export class AlertService {

  alerts: SacGwhAlert[] = [];


  constructor() {}

  addAlert(alert: SacGwhAlert) {
    this.alerts.push(alert);
  }

  dismissAlert(i: number) {
    if (i > 0 && i < this.alerts.length) {
      this.alerts.splice(i, 1);
    }
  }

  getAlerts(): SacGwhAlert[] {
    return this.alerts;
  }
}
