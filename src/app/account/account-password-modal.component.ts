import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AccountService } from './account.service';
import { NotificationService } from '../notifications';
import { ProfileJs, PasswordUpdateCredentials } from './account.types';

@Component ({
  selector: 'app-sac-gwh-account-password-modal',
  templateUrl: 'account-password-modal.component.html'
})

/**
 * Component (Modal) to change User's password
 */
export class AccountPasswordModalComponent {
  @ViewChild('passwordUpdateModalRef') public modal: ModalDirective;

  /**
   * Current User's profile
   * @type {ProfileJs}
   */
  currentProfile: ProfileJs;

  passwordsAreSync = true;
  oldPassIsNotNewPass = true;

  model: PasswordUpdateCredentials = {};
  loading = false;
  error = '';

  /**
   * Constructor
   * @param accountService - injected AccountService
   * @param notificationService - injected NotificationService
   */
  constructor( private accountService: AccountService,
               private notificationService: NotificationService ) {

    this.currentProfile = this.accountService.guestProfile;
  }

  /**
   * checks if both paswords are identical
   * @param event
   */
  validatePasswordSync( event: any ) {
    this.passwordsAreSync = this.model.passwordNew === this.model.passwordConfirm;
    this.oldPassIsNotNewPass = this.model.passwordNew !== this.model.passwordCurrent;
  }

  /**
   * Shows the current modal
   * @param userProfile
   */
  showUpdateModal(userProfile: ProfileJs) {
    this.currentProfile = userProfile;
    this.modal.show();
  }

  /**
   * closes the current modal
   */
  hideUpdateModal() {
    // delete anything that has been entered, when closing window
    this.model = {};
    this.modal.hide();
  }

  /**
   * Form submission - try to change user's password
   */
  onSubmit() {
    this.loading = true;
    this.accountService.updatePassword(this.currentProfile.email, this.model)
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
