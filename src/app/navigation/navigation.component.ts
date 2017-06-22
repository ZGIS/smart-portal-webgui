import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService, UserProfile, createProfile } from '../account';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-sac-gwh-navigation',
  templateUrl: 'navigation.component.html',
  styles: ['.fa-stack { margin-top: -5px; margin-bottom: -7px; }']
})

/**
 * Navigation Component
 */
export class NavigationComponent implements OnInit {

  // FIXME make this an enum or so
  currentNav: string;

  @Input() public userProfile: UserProfile;
  @Input() public checkLoggedIn: boolean;

  @ViewChild('disclaimerModalRef') public disclaimerModal: ModalDirective;
  @ViewChild('aboutModalRef') public aboutModal: ModalDirective;

  // accountSubject = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  public PORTAL_WEBGUI_VERSION = '';
  public PORTAL_BACKEND_VERSION = '';
  public CSW_INGESTER_VERSION = '';

  /**
   * Constructor
   * @param accountService      - injected AccountService
   * @param activatedRoute      - injected ActivatedRoute
   * @param router              - injected Router
   * @param notificationService - injected NotificationService
   */
  constructor(private accountService: AccountService,
              private router: Router,
              private notificationService: NotificationService) {

    this.PORTAL_WEBGUI_VERSION = this.accountService.webguiAppVersion;

    let currentUserProfile = JSON.parse(localStorage.getItem('currentUserProfile'));

    if (currentUserProfile) {
      this.userProfile = createProfile(currentUserProfile);
      console.log(this.userProfile);
    } else {
      this.userProfile = this.accountService.guestProfile;
    }
    this.checkLoggedIn = false;
  };

  /**
   * Shows the Disclaimer modal
   */
  showDisclaimerModal() {
    this.disclaimerModal.show();
  };

  /**
   * hides the disclaimer modal
   */
  hideDisclaimerModal() {
    this.disclaimerModal.hide();
  };

  /**
   * shows the about modal
   */
  showAboutModal() {
    this.aboutModal.show();
  };

  /**
   * hides the about modal
   */
  hideAboutModal() {
    this.aboutModal.hide();
  };

  /**
   * performs user logout
   */
  logout() {
    this.accountService.logout()
      .subscribe(
        result => {
          // TODO SR This should never happen!
          // if (result === true) {
          // logout successful
          this.checkLoggedIn = false;
          this.userProfile = this.accountService.guestProfile;
          this.router.navigateByUrl('/login');
          // } else {
          //   // logout failed?
          //   console.log('logout in navigation failed, what now?');
          //   this.router.navigateByUrl('/dashboard');
          // }
        },
        error => {
          console.log(<any>error);
          this.notificationService.addErrorResultNotification(error);
          this.router.navigateByUrl('/dashboard');
        });
  }

  /**
   * OnInit - check login, get profile etc.
   */
  ngOnInit(): void {
    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
          console.log('user profile change ' + this.userProfile.firstname);
          if (user.accountSubject === this.accountService.guestProfile.email) {
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
          console.log('user profile change error ' + this.userProfile.email);
          // this.notificationService.addErrorResultNotification(error);
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
          // this.notificationService.addErrorResultNotification(error);
        });

    this.accountService.getPortalBackendVersion()
      .subscribe(
        versionString => {
          this.PORTAL_BACKEND_VERSION = versionString;
        },
        error => {
          this.PORTAL_BACKEND_VERSION = 'n/a';
          console.log('could not retrieve backend version: ' + error);
        });

    this.accountService.getCswIngesterVersion()
      .subscribe(
        versionString => {
          this.CSW_INGESTER_VERSION = versionString;
        },
        error => {
          this.CSW_INGESTER_VERSION = 'n/a';
          console.log('could not retrieve cswi version: ' + error);
        });
  }
}
