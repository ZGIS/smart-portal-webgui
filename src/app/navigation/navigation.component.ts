import { Component, Input, OnInit } from '@angular/core';
import { AccountService, UserProfile, createProfile } from '../account';
import { ActivatedRoute, Router }   from '@angular/router';

@Component({
  selector: 'app-sac-gwh-navigation',
  templateUrl: 'navigation.component.html'
})

export class NavigationComponent implements OnInit {

  // FIXME make this an enum or so
  currentNav: string;

  @Input() public userProfile: UserProfile;
  @Input() public checkLoggedIn: boolean;

  // username = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  logout() {
    this.accountService.logout()
      .subscribe(
        result => {
          if (result === true) {
            // logout successful
            this.checkLoggedIn = false;
            this.userProfile = this.accountService.guestProfile;
            this.router.navigateByUrl('/login');
          } else {
            // logout failed?
            console.log('logout in navigation failed, what now?');
            this.router.navigateByUrl('/dashboard');
          }
        },
        error => {
          console.log(<any>error);
        });
  }

  constructor(private accountService: AccountService, private route: ActivatedRoute,
              private router: Router) {
    let currentUserProfile = JSON.parse(localStorage.getItem('currentUserProfile'));

    if (currentUserProfile) {
      this.userProfile = createProfile(currentUserProfile);
      console.log(this.userProfile);
    } else {
      this.userProfile = this.accountService.guestProfile;
    }
    this.checkLoggedIn = false;
  };

  ngOnInit(): void {
    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
          console.log('user profile change ' + this.userProfile.firstname);
          if (user.username === this.accountService.guestProfile.username) {
            // refresh this.checkLoggedIn to false
            this.checkLoggedIn = false;
          } else {
            // refresh this.checkLoggedIn to true
            this.checkLoggedIn = true;
          }
        },
        error => {
          // console.log(<any>error);
          this.userProfile = this.accountService.guestProfile;
          this.checkLoggedIn = false;
          console.log('user profile change error ' + this.userProfile.firstname);
        });

    this.accountService.isLoggedIn()
      .subscribe(
        loggedInStatus => {
          this.checkLoggedIn = loggedInStatus;
          console.log('LoggedIn change ' + this.checkLoggedIn);
          if (loggedInStatus === true) {
            // refresh loggedin user
            let userProfile = JSON.parse(localStorage.getItem('currentUserProfile'));
            if (userProfile) {
              this.userProfile = createProfile(userProfile);
            } else {
              this.userProfile = this.accountService.guestProfile;
            }
          } else {
            // refresh to guest/empty user
            this.userProfile = this.accountService.guestProfile;
          }
        },
        error => {
          // console.log(<any>error);
          this.userProfile = this.accountService.guestProfile;
          this.checkLoggedIn = false;
          console.log('LoggedIn change error ' + this.checkLoggedIn);
        });
  }

}
