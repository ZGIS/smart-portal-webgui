import { Component, Input, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { NotificationService } from '../notifications';
import { WorkbenchService } from '../workbench';
import { OwcContext } from '../owc';
import { AccountService } from '../account';

@Component({
  selector: 'app-sac-gwh-licensedexitlink',
  templateUrl: 'licensedlink.component.html'
})

export class LicensedlinkComponent {
  @Input() theLink: string;
  @Input() licenseComment: string;
  @ViewChild('pop') pop: PopoverDirective;

  constructor( private _location: Location,
               private accountService: AccountService,
               private workbenchService: WorkbenchService ) {
  }

  okAgreeLink(link: string): void {
    this.accountService.isLoggedIn().subscribe(
      loggedInResult => {
          this.workbenchService.logLinkInfo(link, loggedInResult)
            .subscribe(
              response => {
                console.log(response);
              },
              error => {
                console.log(<any>error);
              });
      },
      error => {
        console.log(<any>error);
      });
    this.pophide();
  }
  pophide() {
    this.pop.hide();
  }

  backClicked() {
    this._location.back();
  }
}
