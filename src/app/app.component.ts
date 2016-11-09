import { Component } from '@angular/core';
import { AccountService } from './account/account.service';

@Component({
  selector: 'sac-gwh-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'Groundwater Hub';

  constructor(private accountService: AccountService) {
  }
}
