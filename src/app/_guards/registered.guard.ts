import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { CollectionsService, IOwcDocument } from '../workbench';
import { NotificationService } from '../notifications';


@Injectable()
export class RegisteredGuard implements CanActivate {

  constructor(private router: Router, private notificationService: NotificationService,
              private collectionsService: CollectionsService) {
  }

  canActivate(): Observable<boolean> {
    return this.collectionsService.getDefaultCollection().map(userCollectionJson => {
      if (<IOwcDocument>userCollectionJson) {
        return true;
      } else {
        return false;
      }
    }).catch(() => {
      this.router.navigate(['/account']);
      this.notificationService.addNotification({
        type: 'warning',
        message: 'Please confirm your registration email first to access your documents collection.'
      });
      return Observable.of(false);

    });
  }
}

