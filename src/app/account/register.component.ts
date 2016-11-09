import { Component } from '@angular/core';
import { AccountService, UserProfile, createProfile } from './account.service';

@Component({
  selector: 'sac-gwh-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  email = '';
  username = '';
  firstname = '';
  lastname = '';
  password = '';

  constructor(private accountService: AccountService) {
  };

  submit() {
    let regProfile: UserProfile = createProfile({
      email: this.email,
      username: this.username,
      firstname: this.firstname,
      lastname: this.lastname,
      password: this.password
    });

    console.log('submit register form clicked!');
    console.log(regProfile);
  }

  gconnectReg(event: MouseEvent) {
    console.log('gconnect register clicked!');
    console.log(event);
  };

}
