import { Component, OnInit } from '@angular/core';
import { AccountService, UserProfile } from '../account/account.service';
import { ActivatedRoute }   from '@angular/router';
// import {DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';

// Google's login API namespace
// declare var gapi: any;

@Component({
//  directives: [DROPDOWN_DIRECTIVES],
  selector: 'sac-gwh-navigation',
  templateUrl: './navigation.component.html'
//  styleUrls: [ './navigation.component.css' ]
})

export class NavigationComponent implements OnInit {

  // FIXME make this an enum or so
  currentNav: string;

  public userProfile: UserProfile;

  username = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  ngOnInit() {

    this.accountService.getProfile()
      .subscribe(user => {
        this.userProfile = user;
      });

  };


  logout() {
    this.accountService.logout();
  }

  constructor(private accountService: AccountService, private route: ActivatedRoute) {
  };

}
