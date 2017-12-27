import {
  Component,
  AfterViewInit,
  NgZone,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { GApiAuthService } from './gapi-auth.service';

/**
 *
 */
@Component({
  selector: 'app-google-signin',
  template: '<div #oauth2>' +
  '<button class="btn btn-danger" id="google.oauth" (click)="sighInClick($event)">Google' +
  ' Sign-in</button>' +
  '</div>'
})

export class GApiAuthComponent implements AfterViewInit {
  @ViewChild('oauth2') targetRef: ElementRef;
  public auth2: any;

  @Output()
  signinResponse = new EventEmitter<string>();

  constructor(private ngZone: NgZone,
              private gapiAuthService: GApiAuthService) {
  }

  ngAfterViewInit() {
    this.gapiAuthService.getReady().subscribe(
      (ready) => {
        if (!ready) {
          return;
        }
        this.googleInit();
      });
  }

  public googleInit() {
    let that = this;
    gapi.load('auth2', function () {
      that.auth2 = gapi.auth2.init({
        client_id: '988846878323-bkja0j1tgep5ojthfr2e92ao8n7iksab.apps.googleusercontent.com',
        // cookie_policy: 'single_host_origin',
        scope: 'profile email'
      });
      // that.attachSignin(document.getElementById('google.oauth'));
    });
  }

  public attachSignin(element: any) {
    let that = this;

    this.auth2.attachClickHandler(element, {},
      function (googleUser: any) {

        googleUser.grantOfflineAccess();
        let profile = googleUser.getBasicProfile();
        let token = googleUser.getAuthResponse().id_token;
        // console.log('ID: ' + profile.getId());
        // console.log('Name: ' + profile.getName());
        // console.log('Image URL: ' + profile.getImageUrl());
        // console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE
        // console.log('attachClickHandler signinResponse');
        that.signinResponse.emit(token);

      }, function (error: any) {
        console.log(JSON.stringify(error, undefined, 2));
      });
  }

  public attachSigninGrantOffline(element: any) {
    let that = this;
    element.addEventListener('click', function () {
      that.auth2.grantOfflineAccess({'redirect_uri': 'postmessage'})
        .then(function (authResult: any) {
          if (authResult.code) {
            let token: string = authResult.code;
            // console.log('attachSigninOfflineAccess: ' + token);
            that.signinResponse.emit(token);
          } else {
            console.log('there was an error with google sign in at signInCallback');
          }
        });
    });
  }

  public sighInClick(element: any) {
    let that = this;
    that.auth2.grantOfflineAccess({'redirect_uri': 'postmessage'})
      .then(function (authResult: any) {
        if (authResult.code) {
          let token: string = authResult.code;
          // console.log('attachSigninOfflineAccess: ' + token);
          that.signinResponse.emit(token);
        } else {
          console.log('there was an error with google sign in at signInCallback');
        }
      });
  }
}
