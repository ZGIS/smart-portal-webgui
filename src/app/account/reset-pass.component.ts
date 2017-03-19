import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';


@Component({
  selector: 'app-sac-gwh-reset-pass',
  templateUrl: 'reset-pass.component.html',
  styleUrls: []
})

/**
 * Component to request password reset
 */
export class ResetPassComponent {

  model: any = {};
  loading = false;

  /**
   * Constructor
   * @param accountService      - injected AccountService
   * @param router              - injected Router
   * @param notificationService - injected NotificationService
   */
  constructor(private accountService: AccountService, private router: Router,
              private notificationService: NotificationService) {

  };

  /**
   * Submit form
   */
  onSubmit() {
    this.loading = true;
    this.accountService.requestPasswordReset(this.model.email)
      .subscribe(
        result => {
          // TODO SR this should never be anything else than true!
          // if (result === true) {
          this.loading = false;
          this.notificationService.addNotification({
            type: 'success',
            message: 'Thank you. Please check your emails and reset your password by' +
            ' clicking on th provided link..'
          });
          this.router.navigateByUrl('/login');
          // } else {
          //   // login failed
          //   this.notificationService.addNotification({
          //     type: 'info',
          //     message: 'Email not known to us.'
          //   });
          //   this.loading = false;
          // }
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
