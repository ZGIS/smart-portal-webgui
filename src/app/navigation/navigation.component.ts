import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService, ProfileJs } from '../account';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';
import { WEBGUI_APP_VERSION } from '../in-app-config';
import { DisclaimerViewComponent } from './disclaimer-view.component';

@Component({
  selector: 'app-sac-gwh-navigation',
  templateUrl: 'navigation.component.html',
  styles: [ '.fa-stack { margin-top: -5px; margin-bottom: -7px; }' ]
})

/**
 * Navigation Component
 */
export class NavigationComponent implements OnInit {

  // FIXME make this an enum or so
  currentNav: string;

  @Input() public userProfile: ProfileJs;
  @Input() public checkLoggedIn: boolean;

  @ViewChild('disclaimerModalRef') public disclaimerModal: ModalDirective;
  @ViewChild('aboutModalRef') public aboutModal: ModalDirective;

  bsModalRefDisclaimer: BsModalRef;

  category = 'main';

  public PORTAL_WEBGUI_VERSION = '';
  public PORTAL_BACKEND_VERSION = '';
  public CSW_INGESTER_VERSION = '';

  /**
   * Constructor
   * @param webguiAppVersion      - injected WEBGUI_APP_VERSION
   * @param accountService      - injected AccountService
   * @param router              - injected Router
   * @param notificationService - injected NotificationService
   */
  constructor( @Inject(WEBGUI_APP_VERSION) private webguiAppVersion: string,
               private accountService: AccountService,
               private router: Router,
               private notificationService: NotificationService ) {

    this.PORTAL_WEBGUI_VERSION = this.webguiAppVersion;

    let currentUserProfile: ProfileJs = JSON.parse(localStorage.getItem('currentUserProfile'));

    if (<ProfileJs>currentUserProfile) {
      this.userProfile = currentUserProfile;
      // console.log(this.userProfile);
    } else {
      this.userProfile = this.accountService.guestProfile;
    }
    this.checkLoggedIn = false;
  }

  /**
   * Shows the Disclaimer modal
   */
  showDisclaimerModal() {
    this.disclaimerModal.show();
  }

  /**
   * hides the disclaimer modal
   */
  hideDisclaimerModal() {
    this.disclaimerModal.hide();
    this.accountService.setHasGdprCookieAccepted();
  }

  /**
   * shows the about modal
   */
  showAboutModal() {
    this.aboutModal.show();
  }

  /**
   * hides the about modal
   */
  hideAboutModal() {
    this.aboutModal.hide();
  }

  /**
   * performs user logout
   */
  logout() {
    this.accountService.logout()
      .subscribe(
        result => {
          this.checkLoggedIn = false;
          this.userProfile = this.accountService.guestProfile;
          this.notificationService.addNotification({
            id: NotificationService.DEFAULT_DISMISS,
            type: 'info',
            message: 'You successfully logged out.'
          });
          this.accountService.deleteHasGdprCookieAccepted();
          this.router.navigateByUrl('/dashboard');
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
    // this.accountService.hasGdprCookieAccepted()
    //   .subscribe(
    //     cookieExists => {
    //       console.log(`cookie is accepted: ${cookieExists}`);
    //       if (!cookieExists) {
    //         console.log(`cookie not accepted: ${cookieExists}`);
    //         // this.showDisclaimerModal();
    //       }
    //     },
    //     error => {
    //       console.log(<any>error);
    //       // this.showDisclaimerModal();
    //     });

    this.accountService.getProfile()
      .subscribe(
        user => {
          this.userProfile = user;
          console.log('user profile change ' + this.userProfile.firstname);
          if (user.email === this.accountService.guestProfile.email) {
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
            let userProfile: ProfileJs = JSON.parse(localStorage.getItem('currentUserProfile'));
            if (<ProfileJs>userProfile) {
              this.userProfile = userProfile;
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
