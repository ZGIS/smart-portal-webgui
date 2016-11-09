import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'sac-gwh-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  @Output() flash = new EventEmitter();

  onSubmit(formRef: any) {
    console.log(formRef);
  };

  gconnectLogin() {
    console.log('gconnect login clicked!');
  };

  constructor(private accountService: AccountService) {
  };

}
