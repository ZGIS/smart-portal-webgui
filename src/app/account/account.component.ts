import { Component } from '@angular/core';
import { AccountService, UserProfile } from './account.service';

@Component({
  selector: 'sac-gwh-useraccount',
  templateUrl: './account.component.html'
})

export class AccountComponent {

  userProfile: UserProfile;

  constructor(private accountService: AccountService) {
  };

  setProfile() {
    let profile = this.accountService.getProfile();
    console.log(profile);
    this.userProfile = profile;
  }

}
