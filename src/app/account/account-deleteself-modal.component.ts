import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService } from './account.service';
import { NotificationService } from '../notifications';
import { ProfileJs } from './account.types';

@Component ({
  selector: 'app-sac-gwh-account-deleteself-modal',
  templateUrl: 'account-deleteself-modal.component.html'
})

/**
 * Component (Modal) to change User's password
 */
export class AccountDeleteSelfModalComponent {
  @ViewChild('deleteselfModalRef') public modal: ModalDirective;

  /**
   * Current User's profile
   * @type {ProfileJs}
   */
  currentProfile: ProfileJs = this.accountService.guestProfile;

  loading = false;
  error = '';

  /**
   * Constructor
   * @param accountService - injected AccountService
   * @param notificationService - injected NotificationService
   */
  constructor( private accountService: AccountService,
               private notificationService: NotificationService ) {
  }

  /**
   * Shows the current modal
   * @param userProfile
   */
  showDeleteSelfModal(userProfile: ProfileJs) {
    this.currentProfile = userProfile;
    this.modal.show();
  }

  /**
   * closes the current modal
   */
  hideDeleteSelfModal() {
    this.modal.hide();
  }

  /**
   * Form submission - try to change user's password
   */
  onSubmit() {
    this.loading = true;
    this.accountService.deleteSelf()
      .subscribe(
        result => {
          // FIXME SR this should never be false!
          if (result === true) {
            // login successful
            this.loading = false;
            this.notificationService.addNotification({
              type: 'success',
              message: 'Thank you. Your password has been changed.'
            });
            this.modal.hide();
          } else {
            // login failed
            this.notificationService.addNotification({
              type: 'info',
              message: 'Apologies, but password could not be updated.'
            });
            this.error = 'Apologies, but password could not be updated.';
            this.loading = false;
            this.modal.hide();
          }
        },
        error => {
          this.loading = false;
          this.notificationService.addErrorResultNotification(error);
          this.modal.hide();
        });
  }
}
