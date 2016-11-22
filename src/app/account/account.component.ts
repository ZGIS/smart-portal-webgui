import { Component, OnInit } from '@angular/core';
import { AccountService, UserProfile } from './account.service';
import { error } from 'util';

@Component({
  selector: 'sac-gwh-useraccount',
  templateUrl: './account.component.html'
})

export class AccountComponent implements OnInit {

  userProfile: UserProfile = this.accountService.guestProfile;

  constructor(private accountService: AccountService) {
  };

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
