import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { AccountService, UserProfile } from './account.service';
import { NotificationService } from '../notifications';

@Component ({
  selector: 'app-sac-gwh-account-password-modal',
  templateUrl: 'account-password-modal.component.html'
})

export class AccountPasswordModalComponent {
  @ViewChild('passwordUpdateModalRef') public modal: ModalDirective;

  currentProfile: UserProfile = this.accountService.guestProfile;
  passwordsAreSync = true;
  oldPassIsNotNewPass = true;
  model: any = {};
  loading = false;
  error = '';

  constructor( private accountService: AccountService,
               private notificationService: NotificationService ) {

  };

  validatePasswordSync( event: any ) {
    this.passwordsAreSync = this.model.password === this.model.passwordConfirm;
    this.oldPassIsNotNewPass = this.model.password !== this.model.passwordCurrent;
  }

  showUpdateModal(userProfile: UserProfile) {
    this.currentProfile = userProfile;
    this.modal.show();
  }

  hideUpdateModal() {
    this.modal.hide();
  };

  onSubmit() {
    this.loading = true;
    this.accountService.updatePassword(this.currentProfile.email, this.model.password)
      .subscribe(
        result => {
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
              message: 'Apologies, but passsword could not be updated.'
            });
            this.error = 'Apologies, but passsword could not be updated.';
            this.loading = false;
            this.modal.hide();
          }
        },
        error => {
          this.loading = false;
          this.error = <any>error;
          this.modal.hide();
        });
  }
}
