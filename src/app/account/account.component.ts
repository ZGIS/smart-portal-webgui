import { Component, OnInit } from '@angular/core';
import { AccountService, UserProfile } from './account.service';

@Component({
  selector: 'sac-gwh-useraccount',
  templateUrl: './account.component.html'
})

export class AccountComponent implements OnInit {

  public userProfile: UserProfile;

  constructor(private accountService: AccountService) {
  };

  ngOnInit() {
    // get users from secure api end point
    this.accountService.getProfile()
      .subscribe(user => {
        this.userProfile = user;
      });
  }

  setProfile() {
    let profile = this.accountService.getProfile();
    console.log(profile);
    // this.userProfile = profile;
  }
}
