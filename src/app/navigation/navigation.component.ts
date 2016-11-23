import { Component, OnChanges } from '@angular/core';
import { AccountService, UserProfile } from '../account/account.service';
import { ActivatedRoute, Router }   from '@angular/router';
// import {DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';

// Google's login API namespace
// declare var gapi: any;

@Component({
//  directives: [DROPDOWN_DIRECTIVES],
  selector: 'sac-gwh-navigation',
  templateUrl: './navigation.component.html'
//  styleUrls: [ './navigation.component.css' ]
})

export class NavigationComponent implements OnChanges {

  // FIXME make this an enum or so
  currentNav: string;

  public userProfile: UserProfile;

  // username = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  ngOnChanges() {
  };

  logout() {
    this.accountService.logout()
      .subscribe(
        result => {
          if (result === true) {
            // login successful
            this.router.navigateByUrl('/login');
          } else {
            // logout failed?
            this.router.navigateByUrl('/account');
          }
        },
        error => {
          console.log(<any>error);
        });
  }

  constructor(private accountService: AccountService, private route: ActivatedRoute,
              private router: Router) {
    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
        },
        error => {
          console.log(<any>error);
          this.userProfile = this.accountService.guestProfile;
        });
  };

}
