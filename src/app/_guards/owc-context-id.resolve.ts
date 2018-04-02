import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CollectionsService, OwcContext } from '../owc';
import { AccountService } from '../account';
import { NotificationService } from '../notifications';
import { IErrorResult } from '../search';

@Injectable()
export class OwcContextIdResolve implements Resolve<OwcContext> {

  constructor( private accountService: AccountService,
               private collectionsService: CollectionsService,
               private notificationService: NotificationService ) {
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<OwcContext> {
    let owcId = route.queryParams.id;
    // console.log(`guard resolve: ${owcId}`);
    const currentLoggedIn = this.accountService.isLoggedInValue();
    return this.collectionsService.queryCollectionsForViewing(currentLoggedIn, owcId, []).map(collections => {
      if (collections.length > 0) {
        return collections[ 0 ];
      } else { // id not found
        this.notificationService.addNotification({
          type: 'warning',
          message: 'This id was not found, sorry.'
        });
        throw <IErrorResult>{ message: 'This id was not found, sorry.' };
      }
    }).catch(err => {
      this.notificationService.addNotification({
        type: 'warning',
        message: 'This id was not found, sorry.',
        details: err
      });
      return Observable.throw(<IErrorResult>{ message: 'This id was not found, sorry.', details: err });
    });
  }
}
