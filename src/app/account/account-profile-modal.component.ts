import { Component, ViewChild } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/modal';
import { UserProfile } from './account.service';
import { AccountService } from './account.service';
import { NotificationService } from '../notifications';

@Component ({
  selector: 'app-sac-gwh-account-profile-modal',
  templateUrl: 'account-profile-modal.component.html'
})

export class AccountProfileModalComponent {
  @ViewChild('profileUpdateModalRef') public modal: ModalDirective;
  currentProfile: UserProfile;
  loading = false;
  error = '';

  constructor( private accountService: AccountService,
               private notificationService: NotificationService ) {

  };

  showUpdateModal(userProfile: UserProfile) {
    this.currentProfile = userProfile;
    this.modal.show();
  }

  hideUpdateModal() {
    this.modal.hide();
  };

  onSubmit() {
    this.loading = true;
    this.accountService.updateProfile(this.currentProfile)
      .subscribe(
        result => {
          if (result === true) {
            // login successful
            this.loading = false;
            this.notificationService.addNotification({
              type: 'success',
              message: 'Thank you. Your details have been updated.'
            });
            this.modal.hide();
          } else {
            // login failed
            this.notificationService.addNotification({
              type: 'info',
              message: 'Profile could not be updated, sorry we are working on it.'
            });
            this.error = 'Profile could not be updated, sorry we are working on it.';
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
