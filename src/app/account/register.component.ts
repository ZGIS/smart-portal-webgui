import { Component } from '@angular/core';
import { AccountService, UserProfile, createProfile } from './account.service';

@Component({
  selector: 'sac-gwh-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  constructor(private accountService: AccountService) {
  };

  onSubmit(formValue: UserProfile) {
    let regProfile = createProfile(formValue);

    console.log('submit register form clicked!');
    console.log(regProfile);
  }

  gconnectReg(event: MouseEvent) {
    console.log('gconnect register clicked!');
    console.log(event);
  };

}
