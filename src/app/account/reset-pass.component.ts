import { Component } from '@angular/core';
import { AccountService } from './account.service';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';

@Component({
  selector: 'app-sac-gwh-reset-pass',
  templateUrl: 'reset-pass.component.html'
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
          this.loading = false;
          this.notificationService.addNotification({
            type: 'success',
            message: 'Thank you. Please check your emails and reset your password by' +
            ' clicking on th provided link..'
          });
          this.router.navigateByUrl('/login');
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
        });
  }
}
