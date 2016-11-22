import { Component, Output, EventEmitter } from '@angular/core';
import { AccountService } from './account.service';
import { Http } from '@angular/http';
import { Router } from '@angular/router';


@Component({
  selector: 'sac-gwh-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: []
})

export class ResetPassComponent {

  model: any = {};
  loading = false;
  error = '';
  @Output() flash = new EventEmitter();

  constructor( private accountService: AccountService, private router: Router,
               private http: Http ) {

  };

  onSubmit() {
    this.loading = true;
    this.accountService.requestPasswordReset(this.model.email)
      .subscribe(
        result => {
          if (result === true) {
            // login successful
            this.loading = false;
            this.router.navigateByUrl('/login');
          } else {
            // login failed
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
