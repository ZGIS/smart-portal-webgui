import { Component } from '@angular/core';
import { AccountService } from './account.service';

@Component({
  selector: 'sac-gwh-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  constructor(private accountService: AccountService) {
  };

  gconnectReg(event: MouseEvent) {
    console.log('gconnect register clicked!');
    console.log(event);
  };

}
