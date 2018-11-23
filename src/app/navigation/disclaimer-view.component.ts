import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sac-disclaimer-view',
  templateUrl: 'disclaimer-view.component.html'
})

export class DisclaimerViewComponent implements OnInit {

  constructor( private accountService: AccountService,
               private router: Router ) {
  }

  acceptDisclaimer() {
    this.accountService.setHasGdprCookieAccepted();
    this.router.navigateByUrl('/dashboard');
  }

  ngOnInit(): void {
    this.accountService.hasGdprCookieAccepted()
      .subscribe(
        cookieExists => {
          console.log(`cookie is accepted: ${cookieExists}`);
          this.router.navigateByUrl('/dashboard');
          if (!cookieExists) {
            console.log(`cookie not accepted: ${cookieExists}`);
            // this.showDisclaimerModal();
          }
        },
        error => {
          console.log(<any>error);
          // this.showDisclaimerModal();
        });
  }
}

