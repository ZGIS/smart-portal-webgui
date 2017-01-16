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

@Component({
  selector: 'g-signin',
  template: '<div #oauth2>' +
  '<button class="btn btn-danger" id="google.oauth">Google Sign-in</button>' +
  '</div>'
})

export class GApiAuthComponent implements AfterViewInit {

  @ViewChild('oauth2') targetRef: ElementRef;
  public auth2: any;

  @Output()
  signinResponse = new EventEmitter<string>();

  constructor(private _zone: NgZone,
              private _gapiAuthService: GApiAuthService) {
    window['gSignInButtonClicked'] = this.gSignInButtonClicked.bind(this);
  }

  ngAfterViewInit() {
    this._gapiAuthService.getReady().subscribe(
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
        cookie_policy: 'single_host_origin',
        scope: 'profile email'
      });
      that.attachSignin(document.getElementById('google.oauth'));
    });
  }

  public attachSignin(element: any) {
    let that = this;
    this.auth2.attachClickHandler(element, {},
      function (googleUser: any) {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        // YOUR CODE HERE

      }, function (error: any) {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

  private gSignInButtonClicked() {
    let that = this;
    that.auth2.grantOfflineAccess(
      {'redirect_uri': 'postmessage'}
    ).then(this.signInCallback);
  }

  private signInCallback(authResult: any) {
    if (authResult['code']) {

      this.signinResponse.emit(authResult);

    } else {
      // There was an error.
      console.log('there was an error with google sign in at signInCallback');
    }
  }
}
