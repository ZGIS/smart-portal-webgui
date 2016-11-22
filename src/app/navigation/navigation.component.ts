import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account/account.service';
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

  username = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  ngOnInit() {
    // prepares gapi and auth2 thing for login and register components, but dies if we go
    // directly there by link
    // only from full frsh load and nav start from http://localhost:8080/ it works
    // this.initialiseAuth2();

    /*  initialiseAuth2() {
     gapi.load('auth2', function () {
     let obj = gapi.auth2.init({
     'client_id': '988846878323-bkja0j1tgep5ojthfr2e92ao8n7iksab.apps.googleusercontent.com',
     // Scopes to request in addition to 'profile' and 'email'
     'scope': 'profile email'
     });
     console.log(obj);
     });
     }*/
  };


  logout() {
    this.accountService.logout();
  }

  constructor(private accountService: AccountService, private route: ActivatedRoute) {
  };

}
