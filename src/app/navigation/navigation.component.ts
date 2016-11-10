import { Component } from '@angular/core';
import { AccountService } from '../account/account.service';
import { ActivatedRoute }   from '@angular/router';
// import {DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
//  directives: [DROPDOWN_DIRECTIVES],
  selector: 'sac-gwh-navigation',
  templateUrl: './navigation.component.html'
//  styleUrls: [ './navigation.component.css' ]
})

export class NavigationComponent {

  // FIXME make this an enum or so
  currentNav: string;

  username = this.accountService.isLoggedIn() ? this.accountService.getUsername() : 'guest';
  category = 'main';

  logout() {
    this.accountService.logout();
  }

  constructor(private accountService: AccountService, private route: ActivatedRoute) {
  };

}
