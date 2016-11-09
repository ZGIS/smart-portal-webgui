import { Component } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'sac-gwh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private accountService: AccountService) {
  };

  loginSubmit(email: string, password: string) {
    console.log('login: ' + email + ' ' + password);
  };

  gconnectLogin() {
    console.log('gconnect login clicked!');
  };

}
