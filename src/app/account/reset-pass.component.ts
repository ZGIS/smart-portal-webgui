import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from './account.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';


@Component({
  selector: 'app-sac-gwh-reset-pass',
  templateUrl: 'reset-pass.component.html',
  styleUrls: []
})

export class ResetPassComponent {

  model: any = {};
  loading = false;
  error = '';
  @Output() flash = new EventEmitter();

  constructor( private accountService: AccountService, private router: Router,
               private http: Http, private _notificationService: NotificationService ) {

  };

  onSubmit() {
    this.loading = true;
    this.accountService.requestPasswordReset(this.model.email)
      .subscribe(
        result => {
          if (result === true) {
            // login successful
            this.loading = false;
            this._notificationService.addNotification({
              type: 'INFO',
              message: 'Thank you. Please check your emails and reset your password by' +
              ' clicking on th provided link..'
            });
            this.router.navigateByUrl('/login');
          } else {
            // login failed
            this._notificationService.addNotification({
              type: 'ERR',
              message: 'Email not known to us.'
            });
            this.error = 'Email not known to us.';
            this.loading = false;
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
        });
  }
}
