import { Component, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { NotificationService } from '../notifications/notification.service';
import { PopoverDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-sac-gwh-licensedexitlink',
  templateUrl: 'licensedlink.component.html'
})

export class LicensedlinkComponent {
  @Input() theLink: string;
  @Input() licenseComment: string;
  @ViewChild('pop') pop: PopoverDirective;

  constructor( private _location: Location,
               private notificationService: NotificationService ) {
  }

  pophide() {
    this.pop.hide();
  }

  backClicked() {
    this._location.back();
  }
}
