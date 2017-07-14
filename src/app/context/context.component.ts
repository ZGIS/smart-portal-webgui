import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NotificationService } from '../notifications/notification.service';

/**
 * This component parses the context URL and forwards to the appropriate page
 */
@Component({
  selector: 'app-sac-gwh-context-retrieve',
  template: '<i class="fa fa-spinner fa-pulse fa-fw"></i> retrieving content and redirecting...'
})

export class ContextRetrieveComponent implements OnInit {

  private TYPE_ENTRY = 'entry';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService,
              private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.route.params
      .subscribe((params: Params) => {
        switch (params['type']) {
          case this.TYPE_ENTRY: {
            // for protractor, being more explicit about zones and timeouts/asynch tasks
            this.ngZone.runOutsideAngular(() => {
              setTimeout(() => {
                this.ngZone.run(() => {
                  this.router.navigate([ 'search/' ], {
                    queryParams: {
                      query: `fileIdentifier:"${params[ 'uuid' ]}"`,
                      showModal: params[ 'uuid' ]
                    }
                  });
                });
              }, 2500);
            });
            break;
          }
          default: {
            this.notificationService.addNotification({
              message: `Unknown context ${params['type']}`,
              type: 'danger',
              id: NotificationService.MSG_ID_ERROR});
            this.router.navigate(['']);
          }
        }
      });
  }
}

