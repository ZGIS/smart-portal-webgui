import { Component } from '@angular/core';
import { AccountService } from '../account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sac-disclaimer-view',
  templateUrl: 'disclaimer-view.component.html'
})

export class DisclaimerViewComponent {

  constructor( private accountService: AccountService,
               private router: Router ) {
  }

  acceptDisclaimer() {
    this.accountService.setHasGdprCookieAccepted();
    this.router.navigateByUrl('/dashboard');
  }

}

