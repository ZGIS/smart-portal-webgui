import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from './account.service';
import { ProfileJs } from './account.types';

@Component({
  selector: 'app-sac-gwh-account',
  templateUrl: 'account.component.html'
})

/**
 * Component to view / change account information
 */
export class AccountComponent implements OnInit {

  /**
   * Account information
   * @type {ProfileJs}
   */
  @Input() userProfile: ProfileJs = this.accountService.guestProfile;

  /**
   * Constructor
   * @param accountService injected AccountService
   */
  constructor(private accountService: AccountService) {
  }

  /**
   * OnInit - queries current profile from backend
   */
  ngOnInit() {
    // get users from secure api end point
    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
        },
        error => {
          console.log(<any>error);
          this.userProfile = this.accountService.guestProfile;
        });
  }
}
