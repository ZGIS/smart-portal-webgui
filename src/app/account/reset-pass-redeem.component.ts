import { Component, OnInit } from '@angular/core';
import { AccountService } from './account.service';
import { ActivatedRoute, Params, Router }   from '@angular/router';
import { NotificationService } from '../notifications';


@Component({
  selector: 'app-sac-gwh-reset-pass-redeem',
  templateUrl: 'reset-pass-redeem.component.html'
})

export class ResetPassRedeemComponent implements OnInit {
  model: any = {};
  loading = false;

  redeemLink = '';
  passwordsAreSync = true;

  constructor( private accountService: AccountService, private route: ActivatedRoute,
               private router: Router, private notificationService: NotificationService ) {
  }

  ngOnInit(): void {
    this.route.params.forEach(( params: Params ) => {
      let redeemlink = params[ 'redeemlink' ];
      if (!redeemlink) {
        this.notificationService.addNotification({
          type: 'danger',
          message: 'Link ID not found'
        });
        this.router.navigateByUrl('/login');
      } else {
        this.redeemLink = redeemlink;
      }
    });
  }

  validatePasswordSync( event: any ) {
    this.passwordsAreSync = this.model.password === this.model.passwordConfirm;
  }

  onSubmit() {
    this.loading = true;
    if (this.model.password !== this.model.passwordConfirm) {
      this.loading = false;
      this.passwordsAreSync = false;
    } else {
      this.accountService.redeemPasswordReset(this.model.email, this.model.password,
        this.redeemLink)
        .subscribe(
          result => {
            // TODO SR this should never be false!
            // if (result === true) {
              // login successful
              this.loading = false;
              this.notificationService.addNotification({
                type: 'success',
                message: 'Thank you. Please check your emails and login with your password'
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
}
